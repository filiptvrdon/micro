import { createContext, useContext } from "react"
import type { UserRepository } from "@/domain/users/repositories/user-repository.interface"
import { ApiUserRepository } from "@/domain/users/repositories/api-user.repository"

const userRepository = new ApiUserRepository()

const UserContext = createContext<{
  userRepository: UserRepository
}>({
  userRepository
})

export function useUserRepository() {
  return useContext(UserContext).userRepository
}
