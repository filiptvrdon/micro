import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

let loadPromise: Promise<FFmpeg> | null = null
let execPromise: Promise<unknown> = Promise.resolve()

export async function loadFFmpeg() {
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    try {
      console.log("[FFmpeg] Loading FFmpeg instance...")
      console.log(`[FFmpeg] crossOriginIsolated: ${window.crossOriginIsolated}`)
      const instance = new FFmpeg()
      const baseURL = window.location.origin + "/ffmpeg"

      console.log(`[FFmpeg] baseURL: ${baseURL}`)

      console.log("[FFmpeg] Fetching core JS...")
      const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript")
      console.log(`[FFmpeg] Core JS ready: ${coreURL}`)

      console.log("[FFmpeg] Fetching WASM...")
      const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm")
      console.log(`[FFmpeg] WASM ready: ${wasmURL}`)

      console.log("[FFmpeg] Initializing worker and loading core...")
      await instance.load({
        coreURL,
        wasmURL,
      })
      console.log("[FFmpeg] FFmpeg loaded successfully")

      instance.on("log", ({ message }) => {
        console.log(`[FFmpeg Log] ${message}`)
      })

      instance.on("progress", ({ progress, time }) => {
        console.log(`[FFmpeg Progress] ${Math.round(progress * 100)}% (time: ${time / 1000000}s)`)
      })

      return instance
    } catch (e) {
      console.error("[FFmpeg] Failed to load FFmpeg:", e)
      loadPromise = null
      throw e
    }
  })()

  return loadPromise
}

export async function processVideo(file: File): Promise<File> {
  // Use a mutex to ensure only one video is processed at a time
  // as the same FFmpeg instance is shared and it's not thread-safe.
  const result = (await (execPromise = execPromise.catch(() => { /* ignore */ }).then(async () => {
    console.log(`[FFmpeg] Processing video: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
    const ffmpeg = await loadFFmpeg()
    const id = Math.random().toString(36).substring(7)
    const inputName = `input_${id}.mp4`
    const outputName = `output_${id}.mp4`

    console.log(`[FFmpeg] Writing file to FS: ${inputName}`)
    const inputData = await fetchFile(file)
    await ffmpeg.writeFile(inputName, inputData)

    try {
      // Trim to 10 seconds and compress
      // -t 10: duration 10s
      // -vcodec libx264: h264 codec
      // -crf 28: compression (higher is more compressed, 23 is default, 28 is decent)
      // -preset fast: encoding speed
      // -movflags +faststart: relocate moov atom to the front for faster playback
      console.log(`[FFmpeg] Executing command for ${outputName}...`)
      await ffmpeg.exec([
        "-i",
        inputName,
        "-t",
        "10",
        "-vcodec",
        "libx264",
        "-crf",
        "28",
        "-preset",
        "fast",
        "-movflags",
        "+faststart",
        outputName,
      ])

      console.log(`[FFmpeg] Reading processed file: ${outputName}`)
      const data = await ffmpeg.readFile(outputName)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = new Blob([data as any], { type: "video/mp4" })
      const resultFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".mp4", { type: "video/mp4" })
      console.log(`[FFmpeg] Processing complete: ${resultFile.name} (${(resultFile.size / 1024 / 1024).toFixed(2)} MB)`)
      return resultFile
    } catch (e) {
      console.error("[FFmpeg] Error during processing:", e)
      throw e
    } finally {
      // Cleanup FS
      console.log("[FFmpeg] Cleaning up FS...")
      try { await ffmpeg.deleteFile(inputName) } catch { /* ignore */ }
      try { await ffmpeg.deleteFile(outputName) } catch { /* ignore */ }
    }
  }))) as File

  return result
}
