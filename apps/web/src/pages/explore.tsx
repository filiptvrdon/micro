import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Card } from "@/components/ui/card.tsx"
import { useUserRepository } from "@/providers/user-provider.tsx"
import type { User } from "@/domain/users/types/user.ts"
import { Link } from "react-router-dom"

export function ExplorePage() {
  const userRepository = useUserRepository()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<User[]>([])
  const [newUsers, setNewUsers] = useState<User[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [loadingNew, setLoadingNew] = useState(true)
  const [following, setFollowing] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const loadNew = async () => {
      try {
        const users = await userRepository.getNewUsers(12)
        setNewUsers(users)
      } catch (e) {
        console.error("Failed to load new users", e)
      } finally {
        setLoadingNew(false)
      }
    }
    loadNew()
  }, [userRepository])

  useEffect(() => {
    const initFollowing = async () => {
      try {
        const me = await userRepository.getCurrentUser()
        if (me) {
          const followingList = await userRepository.getFollowing(me.id)
          const map: Record<string, boolean> = {}
          followingList.forEach((u) => (map[u.id] = true))
          setFollowing(map)
        }
      } catch (e) {
        console.error("Failed to load following state", e)
      }
    }
    initFollowing()
  }, [userRepository])


  const runSearch = async () => {
    const q = query.trim()
    if (!q) {
      setResults([])
      return
    }
    try {
      setLoadingSearch(true)
      const users = q.startsWith("#")
        ? await userRepository.getUsersByTag(q.slice(1))
        : await userRepository.searchUsers(q)
      setResults(users)
    } catch (e) {
      console.error("Search failed", e)
    } finally {
      setLoadingSearch(false)
    }
  }

  const toggleFollow = async (userId: string) => {
    try {
      const isF = following[userId]
      if (isF) {
        await userRepository.unfollowUser(userId)
      } else {
        await userRepository.followUser(userId)
      }
      setFollowing((prev) => ({ ...prev, [userId]: !isF }))
    } catch (e) {
      console.error("Failed to toggle follow", e)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users or tags"
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch()
          }}
        />
        <Button onClick={runSearch} disabled={loadingSearch}>
          {loadingSearch ? "Searching..." : "Search"}
        </Button>
      </div>

      {!query.trim() && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">New arrivals</h3>
          {loadingNew ? (
            <div className="text-center text-sm text-muted-foreground py-8">Loading...</div>
          ) : newUsers.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">No users yet.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {newUsers.map((u) => (
                <UserRow key={u.id} user={u} followed={!!following[u.id]} onToggleFollow={() => toggleFollow(u.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {query.trim() && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Results</h3>
          {loadingSearch ? (
            <div className="text-center text-sm text-muted-foreground py-8">Searching...</div>
          ) : results.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">No users found.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {results.map((u) => (
                <UserRow key={u.id} user={u} followed={!!following[u.id]} onToggleFollow={() => toggleFollow(u.id)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function UserRow({ user, followed, onToggleFollow }: { user: User; followed: boolean; onToggleFollow: () => void }) {
  return (
    <Card className="p-3 flex items-center gap-3">
      <Link to={`/profile/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{user.displayName[0]}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{user.displayName}</div>
          <div className="text-xs text-muted-foreground truncate">@{user.username}</div>
        </div>
      </Link>
      <Button variant={followed ? "secondary" : "default"} size="sm" className="rounded-full" onClick={onToggleFollow}>
        {followed ? "Following" : "Follow"}
      </Button>
    </Card>
  )
}
