import { useState, useEffect } from "react"
import { api } from "../lib/api"
import type { Goal, Category, PaginatedResponse } from "../types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Edit2, Target, Calendar, DollarSign } from "lucide-react"
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

export const Goals = () => {
    const [goals, setGoals] = useState<Goal[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingGoalId, setEditingGoalId] = useState<string | null>(null)

    const [goalName, setGoalName] = useState("")
    const [targetAmount, setTargetAmount] = useState("")
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
    const [deadline, setDeadline] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<string>("")
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(10)

    const fetchGoals = async () => {
        try {
            setIsLoading(true)
            setError(null)

            let goalsUrl = `/goal?page=${page}&size=${size}`
            if (categoryFilter) goalsUrl += `&categoryId=${categoryFilter}`

            const [goalsResponse, categoriesResponse] = (await Promise.all([
                api(goalsUrl),
                api("/category/find"),
            ])) as any[]

            setGoals(goalsResponse?.content || [])
            setCategories(categoriesResponse || [])
        } catch (err: any) {
            const errorMsg = err.message || "Erro ao carregar dados"
            setError(errorMsg)
            toast.error(errorMsg)
            console.error("Goals fetch error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setPage(0)
    }, [categoryFilter])

    useEffect(() => {
        fetchGoals()
    }, [page, size, categoryFilter])

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!goalName || !targetAmount || !deadline) {
            toast.error("Preencha todos os campos obrigatórios")
            return
        }

        try {
            const goalData = {
                name: goalName,
                target_amount: Number(targetAmount),
                start_date: startDate,
                deadline: deadline,
                category_id: categoryId || null,
            }

            if (isEditMode && editingGoalId) {
                await api(`/goal/${editingGoalId}`, {
                    method: "PUT",
                    data: goalData,
                })
                toast.success("Objetivo atualizado!")
            } else {
                await api("/goal", {
                    method: "POST",
                    data: goalData,
                })
                toast.success("Objetivo criado!")
            }

            resetForm()
            setIsDialogOpen(false)
            fetchGoals()
        } catch (err: any) {
            toast.error(err.message || "Erro ao processar objetivo")
        }
    }

    const handleEdit = (goal: Goal) => {
        setGoalName(goal.name)
        setTargetAmount(goal.target_amount.toString())
        setStartDate(goal.start_date)
        setDeadline(goal.deadline)
        setCategoryId(goal.category?.id || "")
        setEditingGoalId(goal.id)
        setIsEditMode(true)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este objetivo?")) return

        try {
            await api(`/goal/${id}`, {
                method: "DELETE",
            })
            toast.success("Objetivo excluído")
            fetchGoals()
        } catch (err: any) {
            toast.error(err.message || "Erro ao excluir objetivo")
        }
    }

    const resetForm = () => {
        setGoalName("")
        setTargetAmount("")
        setStartDate(new Date().toISOString().split('T')[0])
        setDeadline("")
        setCategoryId("")
        setIsEditMode(false)
        setEditingGoalId(null)
    }

    const calculateProgress = (goal: Goal) => {
        if(!goal.progress || goal.target_amount === 0) return 0
        if(goal.percentage === undefined) return 0
        return goal.percentage > 0 ? goal.percentage : 0
    }

    const getDaysRemaining = (deadline: string) => {
        const today = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col justify-between items-start md:items-center gap-4 md:flex-row">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Objetivos Financeiros</h1>
                    <p className="text-muted-foreground mt-1">Gerencie seus objetivos e metas</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) resetForm()
                }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
                            <PlusCircle className="h-5 w-5" />
                            Novo Objetivo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                {isEditMode ? "Editar Objetivo" : "Criar Novo Objetivo"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateOrUpdate} className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Nome do Objetivo</Label>
                                <Input
                                    required
                                    value={goalName}
                                    onChange={(e) => setGoalName(e.target.value)}
                                    placeholder="Ex: Viagem, Casa, Carro..."
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Valor Alvo (R$)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    placeholder="0,00"
                                    className="h-10"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Data Inicial</Label>
                                    <Input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Prazo</Label>
                                    <Input
                                        type="date"
                                        required
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Categoria</Label>
                                <Select value={categoryId} onValueChange={setCategoryId}>
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

                            <DialogFooter className="pt-4">
                                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                                    {isEditMode ? "Atualizar" : "Criar"} Objetivo
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
                        <Button onClick={fetchGoals} className="mt-4 bg-red-600 hover:bg-red-700">
                            Tentar novamente
                        </Button>
                    </CardContent>
                </Card>
            )}

            {!isLoading && !error && (
                <>
                    {/* Filter */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end">
                            <div className="space-y-2 flex-1">
                                <Label className="text-sm font-semibold">Filtrar por Categoria</Label>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories && categories.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                onClick={() => setCategoryFilter("")}
                                variant="outline"
                                className="h-10"
                            >
                                Limpar Filtro
                            </Button>
                        </div>
                    </div>

                    {/* Goals Grid */}
                    {goals.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="pt-12 pb-12 text-center">
                                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-semibold text-muted-foreground">Nenhum objetivo criado</h3>
                                <p className="text-sm text-muted-foreground/70 mt-1">Comece criando seu primeiro objetivo financeiro</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {goals.map((goal) => {
                                const progress = calculateProgress(goal)
                                const daysRemaining = getDaysRemaining(goal.deadline)

                                return (
                                    <Card key={goal.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg line-clamp-2">{goal.name}</CardTitle>
                                                    {goal.category && (
                                                        <p className="text-sm text-muted-foreground mt-1">{goal.category.name}</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(goal)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(goal.id)}
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            {/* Progress Bar */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium">Progresso</span>
                                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                        {progress.toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Amount */}
                                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">Meta</span>
                                                </div>
                                                <span className="font-semibold">R$ {goal.target_amount.toFixed(2)}</span>
                                            </div>

                                            {/* Deadline */}
                                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">Prazo</span>
                                                </div>
                                                <span className={`font-semibold ${goal.expired ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                                                    {goal.expired ? 'Vencido' : `${daysRemaining}d`}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
