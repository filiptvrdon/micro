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

// Upload image and create a post in a single request (multipart/form-data)
app.post("/api/posts/image", hankoAuth, async (c) => {
  const userId = c.get("userId")
  const form = await c.req.parseBody()
  const image: any = (form as any)["image"]
  const caption = typeof (form as any)["caption"] === "string" ? (form as any)["caption"] : ""
  const tag = typeof (form as any)["tag"] === "string" ? (form as any)["tag"] : "General"

  if (!image || typeof image.arrayBuffer !== "function") {
    return c.json({ error: "Image file is required (field 'image')" }, 400)
  }

  const fileName: string = typeof image.name === "string" ? image.name : `upload-${Date.now()}`
  const contentType: string = typeof image.type === "string" && image.type ? image.type : "application/octet-stream"
  const arrayBuffer = await image.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const key = `posts/${userId}/${Date.now()}-${fileName}`
  const { key: storedKey } = await storageRepository.uploadFile(key, buffer, contentType)

  const post = await postRepository.createPost({ userId, imageUrl: storedKey, caption, tag })
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
  const image: any = (form as any)["avatar"] || (form as any)["image"]
  if (!image || typeof image.arrayBuffer !== "function") {
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

// Media proxy: redirect to short-lived signed S3 URL
app.get("/media/*", async (c) => {
  const path = c.req.path
  const prefix = "/media/"
  const key = decodeURI(path.startsWith(prefix) ? path.slice(prefix.length) : path)
  if (!key) return c.text("Missing key", 400)
  try {
    const signed = await storageRepository.getSignedUrl(key, 300)
    return c.redirect(signed, 302)
  } catch (e) {
    console.error("Failed to sign media URL", e)
    return c.text("Not found", 404)
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
  } catch (e) {
    return c.text("Frontend not built or index.html missing", 404)
  }
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
