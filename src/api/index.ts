import "dotenv/config"
import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { PgPostRepository } from "./domain/posts/repositories/pg-post.repository"
import { PgUserRepository } from "./domain/users/repositories/pg-user.repository"

const app = new Hono()

app.use("/*", cors())

const postRepository = new PgPostRepository()
const userRepository = new PgUserRepository()

// Health check
app.get("/health", (c) => c.text("OK"))

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

app.post("/api/posts", async (c) => {
  const body = await c.req.json()
  const post = await postRepository.createPost(body)
  return c.json(post, 201)
})

// Users
app.get("/api/users/current", async (c) => {
  const userId = c.req.query("userId")
  const user = await userRepository.getCurrentUser(userId)
  if (!user) return c.json({ error: "User not found" }, 404)
  return c.json(user)
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

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
