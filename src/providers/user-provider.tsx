import { createContext, useContext } from "react"
import type { UserRepository } from "@/domain/users/repositories/user-repository.interface"
import { PgUserRepository } from "@/domain/users/repositories/pg-user.repository"

const userRepository = new PgUserRepository()

const UserContext = createContext<{
  userRepository: UserRepository
}>({
  userRepository
})

export function useUserRepository() {
  return useContext(UserContext).userRepository
}
