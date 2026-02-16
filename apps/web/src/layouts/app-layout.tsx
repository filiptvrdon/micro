import { useEffect, useState } from "react"
import { Outlet, NavLink, Navigate } from "react-router-dom"
import { Home, User, PlusSquare, MoreHorizontal, LogOut, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useUserRepository } from "@/providers/user-provider.tsx"
import type { User as UserType } from "@/domain/users/types/user.ts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { useAuth } from "@/providers/auth-provider.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"

export function AppLayout() {
  const { session, isLoading, logout } = useAuth()
  const userRepository = useUserRepository()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  useEffect(() => {
    if (session) {
      userRepository.getCurrentUser(session.userId).then(setCurrentUser)
    }
  }, [userRepository, session])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Top Header */}
      <header className="w-full max-w-md flex justify-between items-center py-6 px-4">
        <h1 className="text-2xl font-semibold tracking-tight">Micro</h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <NavLink to="/settings" className="flex items-center w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-md flex-1 pb-24 px-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-background/80 backdrop-blur-md border-t border-border px-6 py-3 flex justify-between items-center z-50">
        <NavLink to="/" className={({ isActive }) => `p-2 rounded-lg transition-colors ${isActive ? 'text-primary bg-secondary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Home className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </NavLink>

        <NavLink to="/upload" className={({ isActive }) => `p-2 rounded-lg transition-colors ${isActive ? 'text-primary bg-secondary' : 'text-muted-foreground hover:text-foreground'}`}>
          <PlusSquare className="h-6 w-6" />
          <span className="sr-only">Upload</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `p-2 rounded-lg transition-colors ${isActive ? 'text-primary bg-secondary' : 'text-muted-foreground hover:text-foreground'}`}>
          {currentUser?.avatarUrl ? (
            <Avatar className="h-7 w-7 border-2 border-transparent aria-[current=page]:border-primary transition-all">
              <AvatarImage src={currentUser.avatarUrl} />
              <AvatarFallback>{currentUser.displayName[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-6 w-6" />
          )}
          <span className="sr-only">Profile</span>
        </NavLink>
      </nav>

      {/* Footer Branding */}
      <footer className="w-full max-w-md py-8 text-center opacity-30 pointer-events-none">
        <span className="text-xs tracking-widest uppercase">Micro</span>
      </footer>
    </div>
  )
}
