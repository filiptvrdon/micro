import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/layouts/app-layout"
import { FeedPage } from "@/pages/feed"
import { ProfilePage } from "@/pages/profile"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<FeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/upload" element={<div className="py-20 text-center">Upload Coming Soon</div>} />
          {/* Redirect any other route to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
