import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Erro 404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">
          Pagina nao encontrada
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          A rota que voce tentou acessar nao existe ou foi movida.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/dashboard">
            <Button className="w-full gap-2 sm:w-auto">
              <Home className="h-4 w-4" />
              Ir para o dashboard
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    </div>
  )
}
