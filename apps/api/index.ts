import "dotenv/config"
import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { hankoAuth } from "./src/domain/auth/middleware/hanko-auth.middleware.js"
import { PgPostRepository } from "./src/domain/posts/repositories/pg-post.repository.js"
import { PgUserRepository } from "./src/domain/users/repositories/pg-user.repository.js"
import { S3StorageRepository } from "./src/domain/storage/repositories/s3-storage.repository.js"

const app = new Hono<{
  Variables: {
    userId: string
  }
}>()

app.use("/*", cors())
app.use("/*", async (c, next) => {
  await next()
  c.header("Cross-Origin-Embedder-Policy", "require-corp")
  c.header("Cross-Origin-Opener-Policy", "same-origin")
})

const postRepository = new PgPostRepository()
const userRepository = new PgUserRepository()
const storageRepository = new S3StorageRepository()

// --- API Routes ---

// Health check
app.get("/api/health", (c) => c.text("OK"))

// Posts
app.get("/api/posts", async (c) => {
  const userId = c.req.query("userId")
  if (userId) {
    const posts = await postRepository.getPostsByUserId(userId)
    return c.json(posts)
  }
  const posts = await postRepository.getFeed()
  return c.json(posts)
})

app.get("/api/posts/:id", async (c) => {
  const id = c.req.param("id")
  const post = await postRepository.getPostById(id)
  if (!post) return c.json({ error: "Post not found" }, 404)
  return c.json(post)
})

app.post("/api/posts", hankoAuth, async (c) => {
  const userId = c.get("userId")
  const body = await c.req.json()
  const post = await postRepository.createPost({ ...body, userId })
  return c.json(post, 201)
})

// Upload multiple media items (images/videos) and create a post in a single request (multipart/form-data)
app.post("/api/posts/media", hankoAuth, async (c) => {
  const userId = c.get("userId")
  const form = await c.req.parseBody({ all: true })
  const mediaRaw = form["media"]
  const media = Array.isArray(mediaRaw) ? mediaRaw : (mediaRaw ? [mediaRaw] : [])
  const caption = typeof form["caption"] === "string" ? form["caption"] : ""
  const tag = typeof form["tag"] === "string" ? form["tag"] : "General"

  const validMedia = media.filter((m): m is File => typeof m !== "string" && !!(m && typeof m.arrayBuffer === "function"))

  if (validMedia.length === 0) {
    return c.json({ error: "At least one media file is required (field 'media')" }, 400)
  }

  const mediaItems = []

  for (let i = 0; i < validMedia.length; i++) {
    const item = validMedia[i]
    const fileName: string = typeof item.name === "string" ? item.name : `upload-${Date.now()}-${i}`
    const contentType: string = typeof item.type === "string" && item.type ? item.type : "application/octet-stream"
    const buffer = Buffer.from(await item.arrayBuffer())

    const type = contentType.startsWith("video/") ? "video" : "image"
    const key = `posts/${userId}/${Date.now()}-${fileName}`
    const { key: storedKey } = await storageRepository.uploadFile(key, buffer, contentType)

    mediaItems.push({
      url: storedKey,
      type,
      order: i,
    })
  }

  const post = await postRepository.createPost({ userId, media: mediaItems, caption, tag })
  return c.json(post, 201)
})

// Users
app.get("/api/users/current", hankoAuth, async (c) => {
  const userId = c.get("userId")
  const user = await userRepository.getCurrentUser(userId)
  if (!user) return c.json({ error: "User not found" }, 404)
  return c.json(user)
})

app.put("/api/users/current", hankoAuth, async (c) => {
  const userId = c.get("userId")
  const body = await c.req.json()
  const data: { username?: string; displayName?: string; bio?: string } = {
    username: typeof body.username === "string" ? body.username : undefined,
    displayName: typeof body.displayName === "string" ? body.displayName : undefined,
    bio: typeof body.bio === "string" ? body.bio : undefined,
  }
  const updated = await userRepository.updateUser(userId, data)
  return c.json(updated)
})

app.post("/api/users/current/avatar", hankoAuth, async (c) => {
  const userId = c.get("userId")
  const form = await c.req.parseBody()
  const image = form["avatar"] || form["image"]
  if (!image || typeof image === "string" || typeof image.arrayBuffer !== "function") {
    return c.json({ error: "Avatar file is required (field 'avatar')" }, 400)
  }
  const fileName: string = typeof image.name === "string" ? image.name : `avatar-${Date.now()}`
  const contentType: string = typeof image.type === "string" && image.type ? image.type : "application/octet-stream"
  const buffer = Buffer.from(await image.arrayBuffer())
  const key = `avatars/${userId}/${Date.now()}-${fileName}`
  const { key: storedKey } = await storageRepository.uploadFile(key, buffer, contentType)
  const updated = await userRepository.updateUser(userId, { avatarUrl: storedKey })
  return c.json(updated)
})

app.get("/api/users/:id", async (c) => {
  const id = c.req.param("id")
  const user = await userRepository.getUserById(id)
  if (!user) return c.json({ error: "User not found" }, 404)
  return c.json(user)
})

app.get("/api/users/:username/profile", async (c) => {
  const username = c.req.param("username")
  const profile = await userRepository.getUserProfile(username)
  if (!profile) return c.json({ error: "Profile not found" }, 404)
  return c.json(profile)
})

app.get("/api/users/:id/following", async (c) => {
  const id = c.req.param("id")
  const following = await userRepository.getFollowing(id)
  return c.json(following)
})

app.get("/api/users/:id/followers", async (c) => {
  const id = c.req.param("id")
  const followers = await userRepository.getFollowers(id)
  return c.json(followers)
})

app.get("/api/users/search", async (c) => {
  const query = c.req.query("q")
  if (!query) return c.json([])
  const users = await userRepository.searchUsers(query)
  return c.json(users)
})

app.get("/api/users", async (c) => {
  const limit = c.req.query("limit") ? parseInt(c.req.query("limit")!) : undefined
  const users = await userRepository.getUsers(limit)
  return c.json(users)
})

app.get("/api/users/by-tag", async (c) => {
  const tag = c.req.query("tag")
  if (!tag) return c.json([])
  const users = await userRepository.getUsersByTag(tag)
  return c.json(users)
})

app.post("/api/users/:id/follow", hankoAuth, async (c) => {
  const followerId = c.get("userId")
  const followingId = c.req.param("id")
  if (followerId === followingId) return c.json({ error: "Cannot follow yourself" }, 400)
  await userRepository.followUser(followerId, followingId)
  return c.json({ success: true })
})

app.post("/api/users/:id/unfollow", hankoAuth, async (c) => {
  const followerId = c.get("userId")
  const followingId = c.req.param("id")
  await userRepository.unfollowUser(followerId, followingId)
  return c.json({ success: true })
})

app.get("/api/users/:id/is-following", hankoAuth, async (c) => {
  const followerId = c.get("userId")
  const followingId = c.req.param("id")
  const following = await userRepository.isFollowing(followerId, followingId)
  return c.json({ isFollowing: following })
})

// Media proxy: stream from S3 to handle CORS and COEP correctly
app.get("/media/*", async (c) => {
  const path = c.req.path
  const prefix = "/media/"
  const key = decodeURI(path.startsWith(prefix) ? path.slice(prefix.length) : path)
  if (!key) return c.text("Missing key", 400)

  try {
    const range = c.req.header("Range")
    const res = await storageRepository.downloadFile(key, range)

    if (res.ContentType) c.header("Content-Type", res.ContentType)
    if (res.ContentLength) c.header("Content-Length", res.ContentLength.toString())
    if (res.ContentRange) c.header("Content-Range", res.ContentRange)
    if (res.AcceptRanges) c.header("Accept-Ranges", res.AcceptRanges)

    // Explicitly allow cross-origin resource sharing/policy for COEP compatibility
    c.header("Cross-Origin-Resource-Policy", "cross-origin")
    c.header("Access-Control-Allow-Origin", "*")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return c.body(res.Body as any, res.Status as any)
  } catch (e: unknown) {
    const error = e as { name?: string }
    if (error.name === "NoSuchKey" || error.name === "NotFound") {
      return c.text("Not found", 404)
    }
    console.error("Failed to proxy media", e)
    return c.text("Internal server error", 500)
  }
})

// --- Static Assets & SPA Fallback ---

// Cache control for hashed assets
app.use("/assets/*", async (c, next) => {
  await next()
  c.header("Cache-Control", "public, max-age=31536000, immutable")
})

// Serve static files from public directory
app.use("/*", serveStatic({ root: "./public" }))

// SPA fallback: Serve index.html for any other route
app.get("*", async (c) => {
  try {
    const html = await readFile(join(process.cwd(), "public/index.html"), "utf-8")
    return c.html(html, 200, {
      "Cache-Control": "no-store",
    })
  } catch {
    return c.text("Frontend not built or index.html missing", 404)
  }
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
