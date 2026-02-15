import { createContext, useContext } from "react"
import type { PostRepository } from "@/domain/posts/repositories/post-repository.interface"
import { PgPostRepository } from "@/domain/posts/repositories/pg-post.repository"

const postRepository = new PgPostRepository()

const PostContext = createContext<{
  postRepository: PostRepository
}>({
  postRepository
})

export function usePostRepository() {
  return useContext(PostContext).postRepository
}
