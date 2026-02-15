import { createContext, useContext } from "react"
import type { UserRepository } from "../repositories/user-repository.interface"
import { StubUserRepository } from "../repositories/stub-user.repository"

const userRepository = new StubUserRepository()

const UserContext = createContext<{
  userRepository: UserRepository
}>({
  userRepository
})

export function useUserRepository() {
  return useContext(UserContext).userRepository
}
