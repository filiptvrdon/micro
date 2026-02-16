export interface User {
  id: string
  username: string
  displayName: string
  avatarUrl?: string
  bio?: string
}

export interface UserProfile extends User {
  followerCount: number
  followingCount: number
  postCount: number
}
