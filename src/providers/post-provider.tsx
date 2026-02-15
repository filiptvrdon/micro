import { createContext, useContext } from "react"
import type { PostRepository } from "@/domain/posts/repositories/post-repository.interface"
import { StubPostRepository } from "@/domain/posts/repositories/stub-post.repository"

const postRepository = new StubPostRepository()

const PostContext = createContext<{
  postRepository: PostRepository
}>({
  postRepository
})

export function usePostRepository() {
  return useContext(PostContext).postRepository
}
