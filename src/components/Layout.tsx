import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Link, Outlet, useLocation } from "react-router-dom"
import { LogOut, Receipt, Moon, Sun, Laptop, LayoutDashboard, Tag } from "lucide-react"
import { useTheme } from "./theme-provider"

export const Layout = () => {
  const { user, logout } = useAuth()
  const { setTheme, theme } = useTheme()
  const location = useLocation()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const isActive = (path: string) => location.pathname.includes(path)

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-8 gap-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 font-bold text-lg hover:opacity-80 transition-opacity">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Finance Control</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className={`gap-2 transition-all duration-200 ${
                  isActive('/dashboard') && !isActive('/categories')
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
            <Link to="/dashboard/categories">
              <Button
                variant="ghost"
                className={`gap-2 transition-all duration-200 ${
                  isActive('/categories')
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Tag className="h-4 w-4" />
                <span className="hidden sm:inline">Categorias</span>
              </Button>
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 md:ml-auto">
            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800">
                  {theme === 'light' ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Laptop className="h-5 w-5 text-slate-500" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 cursor-pointer">
                  <Sun className="h-4 w-4" /> Claro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 cursor-pointer">
                  <Moon className="h-4 w-4" /> Escuro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 cursor-pointer">
                  <Laptop className="h-4 w-4" /> Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-lg p-0 hover:bg-slate-200 dark:hover:bg-slate-800">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-semibold leading-none text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400 cursor-pointer gap-2 focus:bg-red-50 dark:focus:bg-red-950">
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
