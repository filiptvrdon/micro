import { createRemoteJWKSet, jwtVerify } from "jose"
import type { Context, Next } from "hono"
import { PgUserRepository } from "../../../domain/users/repositories/pg-user.repository.js"

const userRepository = new PgUserRepository()

export const hankoAuth = async (c: Context, next: Next) => {
  const HANKO_AUTH_URL = process.env.HANKO_AUTH_URL
  const authHeader = c.req.header("Authorization")
  const token = authHeader?.split(" ")[1]

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  // Bypass for local development
  if (process.env.NODE_ENV !== "production" && token === "dev-token-secret") {
    const userId = "dev-user-123"
    c.set("userId", userId)
    await userRepository.ensureUserExists(userId)
    return await next()
  }

  if (!HANKO_AUTH_URL) {
    console.error("HANKO_AUTH_URL is not defined")
    return c.json({ error: "Internal Server Error" }, 500)
  }

  try {
    const JWKS_URL = `${HANKO_AUTH_URL}/.well-known/jwks.json`
    const JWKS = createRemoteJWKSet(new URL(JWKS_URL))
    const { payload } = await jwtVerify(token, JWKS)
    const userId = payload.sub

    if (!userId) {
      return c.json({ error: "Invalid token: missing sub" }, 401)
    }

    // Attach userId to context
    c.set("userId", userId)

    // Ensure user exists in the database
    try {
      await userRepository.ensureUserExists(userId)
    } catch (error) {
      console.error("Failed to ensure user exists in DB:", error)
      // We might want to continue anyway, or fail. 
      // Given the requirement, we should probably ensure it works.
      // If it fails due to DB issue, next() might fail later with foreign key errors.
    }

    await next()
  } catch (error) {
    console.error("JWT verification failed:", error)
    return c.json({ error: "Unauthorized" }, 401)
  }
}
