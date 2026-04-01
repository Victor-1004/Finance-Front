import { useState, useEffect } from "react"
import { api } from "../lib/api"
import type { Category } from "../types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Tag, Layers } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [name, setName] = useState("")

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = (await api("/category/find")) as Category[]
      setCategories(response)
    } catch (error: any) {
      toast.error(error.message || "Erro ao carregar categorias")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api("/category", {
        method: "POST",
        data: { name, is_default: false }
      })
      console.log(response)
      if(response.status === 201) {
        toast.success("Categoria criada!")
        setIsDialogOpen(false)
        setName("")
        fetchCategories()
      }
      if(response.status === 400) {
        toast.error(response.data.error || "Erro ao criar categoria")
      }
      if(response.status === 409) {
        toast.error(response.data.error || "Erro ao criar categoria. Já existe uma categoria com esse nome para este usuário.")
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar categoria")
    }
  }

  const handleDelete = async (id: string, is_default: boolean) => {
    if (is_default) {
      toast.error("Não é possível excluir uma categoria padrão")
      return
    }
    
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return
    try {
      const response = await api(`/category/${id}`, { 
        method: "DELETE",
        data: { id }
      })
      if (response.status === 200) {
      toast.success("Categoria excluída")
      fetchCategories()
      } else {
        toast.error(response.data.error || "Erro ao excluir categoria")
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir categoria")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Categoria</Label>
                <Input 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Ex: Lazer, Alimentação..." 
                />
              </div>
              <DialogFooter>
                <Button type="submit">Salvar Categoria</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 border-slate-200/50 dark:border-slate-700/50">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Layers className="h-8 w-8 text-slate-400 animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Nenhuma categoria encontrada</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Crie sua primeira categoria personalizada</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="group relative rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300/75 dark:hover:border-slate-600/75 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-900/20"
                >
                  <div className={`absolute inset-0 ${cat.is_default ? 'bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10' : 'bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10'}`} />
                  <div className="relative p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${cat.is_default ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                          <Tag className={`h-5 w-5 ${cat.is_default ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">{cat.name}</h3>
                      </div>
                      {!cat.is_default && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cat.id, cat.is_default)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="mt-auto">
                      {cat.is_default ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          <Layers className="h-3 w-3" />
                          Padrão do Sistema
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          <Tag className="h-3 w-3" />
                          Personalizada
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
