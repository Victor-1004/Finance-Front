import { useState, useEffect } from "react"
import { api } from "../lib/api"
import type { Transaction, PaginatedResponse, Category } from "../types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowUpCircle, ArrowDownCircle, DollarSign, Trash2, TrendingUp, ArrowLeft, ArrowLeftCircle, ArrowRightCircle, ArrowRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const Dashboard = () => {
  const [data, setData] = useState<PaginatedResponse<Transaction>>({ page: 0, size: 20, total: 0, content: [], totalPages: 0 })
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [balance, setBalance] = useState(0)

  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [type, setType] = useState<"income" | "expense">("expense")
  const [categoryId, setCategoryId] = useState("")
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [filterInitialDate, setFilterInitialDate] = useState<string>("")
  const [filterFinalDate, setFilterFinalDate] = useState<string>("")
  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (filterInitialDate && filterFinalDate) {
        const initialDate = new Date(filterInitialDate)
        const finalDate = new Date(filterFinalDate)
        if (finalDate < initialDate) {
          toast.error("Data final não pode ser anterior à data inicial")
          setFilterInitialDate("")
          setFilterFinalDate("")
          setIsLoading(false)
          return
        }
      }
      
      let transactionUrl = `/transaction?page=${page}&size=${size}`
      if (filterInitialDate) transactionUrl += `&initialDate=${filterInitialDate}`
      if (filterFinalDate) transactionUrl += `&finalDate=${filterFinalDate}`
      
      let balanceUrl = "/transaction/balance"
      if (filterInitialDate) balanceUrl += `?initialDate=${filterInitialDate}`
      if (filterFinalDate) balanceUrl += `${filterInitialDate ? '&' : '?'}finalDate=${filterFinalDate}`
      
      const [txResponse, catResponse, balanceResponse] = (await Promise.all([
        api(transactionUrl),
        api("/category/find"),
        api(balanceUrl)
      ])) as any[]
      
      
      setData(txResponse)
      setCategories(catResponse)
      setBalance(balanceResponse?.balance || 0)
    } catch (err: any) {
      const errorMsg = err.message || "Erro ao carregar dados"
      setError(errorMsg)
      toast.error(errorMsg)
      console.error("Dashboard fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setPage(0)
  }, [filterInitialDate, filterFinalDate])

  useEffect(() => {
    fetchData()
  }, [page, size, filterInitialDate, filterFinalDate])

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    let response = await api("/transaction", {
      method: "POST",
      data: {
        amount: Number(amount),
        description,
        date,
        type,
        category_id: categoryId,
      }
    })
    if (response.status === 200 || response.status === 201) {
      toast.success("Transação criada!")
      setIsDialogOpen(false)
      resetForm()
      fetchData()
    } else {
      toast.error("Erro ao criar transação")
      resetForm()
    }

  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return

    const response = await api(`/transaction/${id}`, {
      method: "DELETE",
      data: { id }
    })
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      toast.success("Transação excluída")
    } else {
      toast.error("Erro ao excluir transação")
    }
      fetchData()

  }

  const resetForm = () => {
    setAmount("")
    setDescription("")
    setDate(new Date().toISOString().split('T')[0])
    setType("expense")
    setCategoryId("")
  }

  const income = data.content.filter(t => t.type === "income").reduce((acc, curr) => acc + Number(curr.amount), 0)
  const expense = data.content.filter(t => t.type === "expense").reduce((acc, curr) => acc + Number(curr.amount), 0)

  // Organize data by date
  const sortedTransactions = [...data.content].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col justify-between items-start md:items-center gap-4 md:flex-row">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Olá,</h1>
          <p className="text-muted-foreground mt-1">Bem-vindo ao seu painel financeiro</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
              <PlusCircle className="h-5 w-5" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Registrar Transação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTransaction} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Tipo</Label>
                  <Select value={type} onValueChange={(v: "income" | "expense") => setType(v)}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">
                        <div className="flex items-center gap-2">
                          <ArrowUpCircle className="h-4 w-4 text-green-500" />
                          Receita
                        </div>
                      </SelectItem>
                      <SelectItem value="expense">
                        <div className="flex items-center gap-2">
                          <ArrowDownCircle className="h-4 w-4 text-red-500" />
                          Despesa
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Valor (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Descrição</Label>
                <Input
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Almoço, Conta de água..."
                  className="h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Data</Label>
                  <Input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Categoria</Label>
                  <Select required value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  Salvar Transação
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {!isLoading && error && (
        <Card className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400 font-medium">Erro ao carregar dados</p>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">{error}</p>
            <Button onClick={fetchData} className="mt-4 bg-red-600 hover:bg-red-700">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && (
        <>
          {/* Filter Period */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="space-y-2 flex-1">
                <Label className="text-sm font-semibold">Data Inicial</Label>
                <Input
                  type="date"
                  value={filterInitialDate}
                  onChange={(e) => setFilterInitialDate(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label className="text-sm font-semibold">Data Final</Label>
                <Input
                  type="date"
                  value={filterFinalDate}
                  onChange={(e) => setFilterFinalDate(e.target.value)}
                  className="h-10"
                />
              </div>
              <Button
                onClick={() => {
                  setFilterInitialDate("")
                  setFilterFinalDate("")
                }}
                variant="outline"
                className="h-10"
              >
                Limpar Filtro
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Balance Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">Saldo Total</p>
                  <div className="p-2.5 bg-blue-500/20 rounded-lg">
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                  R$ {balance.toFixed(2).replace(".", ",")}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {balance >= 0 ? '✓ Saldo positivo' : '✗ Saldo negativo'}
                </p>
              </CardContent>
            </Card>

            {/* Income Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">Receitas</p>
                  <div className="p-2.5 bg-emerald-500/20 rounded-lg">
                    <ArrowUpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  R$ {income.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Total de entradas</p>
              </CardContent>
            </Card>

            {/* Expense Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">Despesas</p>
                  <div className="p-2.5 bg-red-500/20 rounded-lg">
                    <ArrowDownCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  R$ {expense.toFixed(2).replace(".", ",")}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Total de saídas</p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Últimas Transações</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Histórico de movimentações</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow className="border-b border-slate-200 dark:border-slate-700">
                      <TableHead className="font-semibold">Data</TableHead>
                      <TableHead className="font-semibold">Descrição</TableHead>
                      <TableHead className="font-semibold">Categoria</TableHead>
                      <TableHead className="font-semibold text-right">Valor</TableHead>
                      <TableHead className="font-semibold text-center">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          <div className="flex justify-center">
                            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : sortedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          <p>Nenhuma transação encontrada. Registre sua primeira entrada!</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedTransactions.map((tx, index) => (
                        <TableRow
                          key={tx.id}
                          className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-slate-900/50' : 'bg-slate-50/50 dark:bg-slate-800/20'
                            }`}
                        >
                          <TableCell className="font-medium text-sm">
                            {tx.date.split("-").reverse().join("/")}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {tx.description}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {tx.category?.name}
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-right">
                            <span className={tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                              {tx.type === 'income' ? '+' : '-'} R$ {Number(tx.amount).toFixed(2).replace(".", ",")}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(tx.id)}
                              className="hover:bg-red-500/10 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  <TableFooter className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow className="border-t border-slate-200 dark:border-slate-700 flex flex-row items-center justify-between w-full">

                      <div className="flex flex-row p-4 items-center">
                        <div className="flex flex-row p-4 items-center">
                          <ArrowLeftCircle className={`h-5 w-5 text-muted-foreground mr-2 ${page === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-75 cursor-pointer'}`} onClick={() => page > 0 && setPage(page - 1)} />
                          <ArrowLeft className={`h-5 w-5 text-muted-foreground ${page === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-75 cursor-pointer'}`} onClick={() => page > 0 && setPage(page - 1)} />
                          <span className="ml-2 text-sm text-muted-foreground">Página {data.page + 1} de {data.totalPages}</span>
                          <ArrowRight className={`h-5 w-5 text-muted-foreground ml-2 ${page === data.totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-75 cursor-pointer'}`} onClick={() => page < data.totalPages - 1 && setPage(page + 1)} />
                          <ArrowRightCircle className={`h-5 w-5 text-muted-foreground ml-2 ${page === data.totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-75 cursor-pointer'}`} onClick={() => setPage(data.totalPages - 1)} />
                        </div>
                        <Select value={size.toString()} onValueChange={(v) => { setSize(Number(v)); setPage(0) }}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 por página</SelectItem>
                            <SelectItem value="10">10 por página</SelectItem>
                            <SelectItem value="20">20 por página</SelectItem>
                            <SelectItem value="50">50 por página</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
