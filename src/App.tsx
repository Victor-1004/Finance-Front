import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import { Login } from "./pages/Login"

import { Layout } from "./components/Layout"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Toaster } from "sonner"
import { Register } from "./pages/Register"
import { Dashboard } from "./pages/Dashboard"
import { Categories } from "./pages/Categories"
import { Goals } from "./pages/Goals"
import { NotFound } from "./pages/NotFound.tsx"

export function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="goals" element={<Goals />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
