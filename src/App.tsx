import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/layouts/app-layout"
import { FeedPage } from "@/pages/feed"
import { ProfilePage } from "@/pages/profile"
import { LoginPage } from "@/pages/login"
import { AuthProvider } from "@/providers/auth-provider"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<FeedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/upload" element={<div className="py-20 text-center">Upload Coming Soon</div>} />
            {/* Redirect any other route to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
