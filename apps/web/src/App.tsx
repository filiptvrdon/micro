import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/layouts/app-layout.tsx"
import { FeedPage } from "@/pages/feed.tsx"
import { ProfilePage } from "@/pages/profile.tsx"
import { SettingsPage } from "@/pages/settings.tsx"
import { LoginPage } from "@/pages/login.tsx"
import { UploadPage } from "@/pages/upload.tsx"
import { AuthProvider } from "@/providers/auth-provider.tsx"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<FeedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/upload" element={<UploadPage />} />
            {/* Redirect any other route to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
