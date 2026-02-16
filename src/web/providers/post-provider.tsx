import { createContext, useContext } from "react"
import type { PostRepository } from "@/domain/posts/repositories/post-repository.interface"
import { ApiPostRepository } from "@/domain/posts/repositories/api-post.repository"

const postRepository = new ApiPostRepository()

const PostContext = createContext<{
  postRepository: PostRepository
}>({
  postRepository
})

export function usePostRepository() {
  return useContext(PostContext).postRepository
}
