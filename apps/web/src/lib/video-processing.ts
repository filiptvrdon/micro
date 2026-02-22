import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

let loadPromise: Promise<FFmpeg> | null = null
let execPromise: Promise<unknown> = Promise.resolve()

export async function loadFFmpeg() {
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    try {
      const instance = new FFmpeg()
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm"
      await instance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      })
      return instance
    } catch (e) {
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
    const ffmpeg = await loadFFmpeg()
    const id = Math.random().toString(36).substring(7)
    const inputName = `input_${id}.mp4`
    const outputName = `output_${id}.mp4`

    const inputData = await fetchFile(file)
    await ffmpeg.writeFile(inputName, inputData)

    try {
      // Trim to 10 seconds and compress
      // -t 10: duration 10s
      // -vcodec libx264: h264 codec
      // -crf 28: compression (higher is more compressed, 23 is default, 28 is decent)
      // -preset fast: encoding speed
      // -movflags +faststart: relocate moov atom to the front for faster playback
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

      const data = await ffmpeg.readFile(outputName)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = new Blob([data as any], { type: "video/mp4" })
      return new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".mp4", { type: "video/mp4" })
    } finally {
      // Cleanup FS
      try { await ffmpeg.deleteFile(inputName) } catch { /* ignore */ }
      try { await ffmpeg.deleteFile(outputName) } catch { /* ignore */ }
    }
  }))) as File

  return result
}
