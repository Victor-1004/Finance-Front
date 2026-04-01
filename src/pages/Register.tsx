import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { UserPlus, Mail, Lock, User } from "lucide-react"

export const Register = () => {
  const { login } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let response = await api("/register", {
        method: "POST",
        data: { name, email, password },
      })
      if(response.status === 200) {
         login(response.token, response.user, "/dashboard")
      }
      toast.success("Conta criada com sucesso!")
    } catch (error: any) {
      toast.error(error.message || "Erro ao registrar conta")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 overflow-hidden">
      <Card className="w-full max-w-sm shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-slate-800/95">
        <CardContent className="pt-8 pb-8 px-8">
          {/* Logo/Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 mb-4 shadow-lg">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
              Cadastro
            </h1>
            <p className="text-sm text-muted-foreground">Crie sua conta para começar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 h-11 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 bg-slate-50 dark:bg-slate-900"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-11 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 bg-slate-50 dark:bg-slate-900"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-11 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 bg-slate-50 dark:bg-slate-900"
                />
              </div>
            </div>

            {/* Register Button */}
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-6" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Criando...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Já tem uma conta? {" "}
                <Link to="/login" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                  Faça Login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
