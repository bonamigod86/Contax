"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useStore } from "@/store/useStore"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { Charts } from "@/components/dashboard/charts"
import { NextBills } from "@/components/dashboard/next-bills"
import { FilterBar } from "@/components/filters/filter-bar"
import { CategoryAccordion } from "@/components/expenses/category-accordion"
import { ExpenseModal } from "@/components/expenses/expense-modal"
import { ExpenseActions } from "@/components/expenses/expense-actions"
import { CategoryModal } from "@/components/expenses/category-modal"
import { CalendarView } from "@/components/calendar/calendar-view"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import {
  LayoutGrid,
  Calendar,
  Plus,
  Copy,
  CheckSquare,
  Banknote,
  RotateCcw,
  Settings2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { getMonthName } from "@/lib/utils"
import type { Expense } from "@/types"

export default function Home() {
  const {
    expenses,
    categories,
    addExpense,
    updateExpense,
    deleteExpense,
    duplicateExpense,
    duplicateMonth,
    markMultipleAsPaid,
    generateRecurringExpenses,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useStore()

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [actionsModalOpen, setActionsModalOpen] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [defaultCategoryId, setDefaultCategoryId] = useState<string | undefined>()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [multiSelectMode, setMultiSelectMode] = useState(false)

  const now = new Date()
  const [filterMonth, setFilterMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"))
  const [filterYear, setFilterYear] = useState(String(now.getFullYear()))
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterRecurring, setFilterRecurring] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    generateRecurringExpenses()
  }, [])

  const filteredExpenses = useMemo(() => {
    let result = [...expenses]

    if (filterMonth) result = result.filter((e) => e.month === filterMonth)
    if (filterYear) result = result.filter((e) => e.year === parseInt(filterYear))
    if (filterCategory) result = result.filter((e) => e.categoryId === filterCategory)
    if (filterStatus) result = result.filter((e) => e.status === filterStatus)
    if (filterRecurring === "true") result = result.filter((e) => e.isRecurring)
    if (filterRecurring === "false") result = result.filter((e) => !e.isRecurring)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((e) => e.name.toLowerCase().includes(q))
    }

    return result
  }, [expenses, filterMonth, filterYear, filterCategory, filterStatus, filterRecurring, search])

  const categoryMap = useMemo(() => {
    const map = new Map<string, Expense[]>()
    filteredExpenses.forEach((e) => {
      const existing = map.get(e.categoryId) || []
      existing.push(e)
      map.set(e.categoryId, existing)
    })
    return map
  }, [filteredExpenses])

  const handleAddExpense = (categoryId?: string) => {
    setDefaultCategoryId(categoryId)
    setEditingExpense(null)
    setExpenseModalOpen(true)
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setExpenseModalOpen(true)
  }

  const handleSave = (
    data: Omit<Expense, "id" | "createdAt" | "updatedAt">,
    id?: string
  ) => {
    if (id) {
      updateExpense(id, data)
      toast("Conta atualizada")
    } else {
      addExpense(data)
      toast("Conta adicionada")
    }
  }

  const handleDelete = (id: string) => {
    deleteExpense(id)
    toast("Conta excluída")
  }

  const handleTogglePaid = (id: string) => {
    const expense = expenses.find((e) => e.id === id)
    if (expense) {
      const newStatus = expense.status === "paid" ? "pending" : "paid"
      updateExpense(id, { status: newStatus })
      toast(newStatus === "paid" ? "Conta marcada como paga" : "Conta revertida para pendente")
    }
  }

  const handleDuplicate = (id: string) => {
    duplicateExpense(id)
    toast("Conta duplicada")
  }

  const handleShowActions = (expense: Expense) => {
    setSelectedExpense(expense)
    setActionsModalOpen(true)
  }

  const handleDuplicateMonth = () => {
    duplicateMonth(filterMonth, parseInt(filterYear))
    toast("Mês duplicado")
  }

  const handleMarkSelectedAsPaid = () => {
    if (selectedIds.size === 0) return
    markMultipleAsPaid(Array.from(selectedIds))
    toast(`${selectedIds.size} ${selectedIds.size === 1 ? "conta marcada" : "contas marcadas"} como paga(s)`)
    setSelectedIds(new Set())
    setMultiSelectMode(false)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  const hasAnyData = expenses.length > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Contax</h1>
              <button
                onClick={() => setCategoryModalOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Gerenciar categorias"
              >
                <Settings2 className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <button
                onClick={() => {
                  let m = parseInt(filterMonth) - 1
                  let y = parseInt(filterYear)
                  if (m < 1) { m = 12; y-- }
                  setFilterMonth(String(m).padStart(2, "0"))
                  setFilterYear(String(y))
                }}
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-muted-foreground min-w-[120px] text-center">
                {getMonthName(parseInt(filterMonth))} {filterYear}
              </span>
              <button
                onClick={() => {
                  let m = parseInt(filterMonth) + 1
                  let y = parseInt(filterYear)
                  if (m > 12) { m = 1; y++ }
                  setFilterMonth(String(m).padStart(2, "0"))
                  setFilterYear(String(y))
                }}
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={(v) => v && setViewMode(v as "list" | "calendar")}>
              <TabsList className="h-9">
                <TabsTrigger value="list" className="text-xs gap-1.5">
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Lista
                </TabsTrigger>
                <TabsTrigger value="calendar" className="text-xs gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Calendário
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {hasAnyData && viewMode === "list" && (
              <div className="flex items-center gap-2">
                <Button
                  variant={multiSelectMode ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => {
                    setMultiSelectMode(!multiSelectMode)
                    if (multiSelectMode) setSelectedIds(new Set())
                  }}
                  className="h-9 gap-1.5 text-xs"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  {multiSelectMode ? "Cancelar" : "Selecionar"}
                </Button>
                {multiSelectMode && selectedIds.size > 0 && (
                  <Button size="sm" onClick={handleMarkSelectedAsPaid} className="h-9 gap-1.5 text-xs">
                    <CheckSquare className="h-3.5 w-3.5" />
                    Marcar {selectedIds.size} como paga(s)
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDuplicateMonth}
                  className="h-9 gap-1.5 text-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Duplicar mês
                </Button>
                <Button size="sm" onClick={() => handleAddExpense()} className="h-9 gap-1.5">
                  <Plus className="h-4 w-4" />
                  Nova conta
                </Button>
              </div>
            )}
          </div>
        </div>

        {hasAnyData ? (
          <>
            <DashboardCards expenses={expenses} />
            <Charts expenses={expenses} categories={categories} />
            <NextBills expenses={expenses} categories={categories} />

            <FilterBar
              categories={categories}
              selectedMonth={filterMonth}
              selectedYear={filterYear}
              selectedCategory={filterCategory}
              selectedStatus={filterStatus}
              selectedRecurring={filterRecurring}
              search={search}
              onMonthChange={setFilterMonth}
              onYearChange={setFilterYear}
              onCategoryChange={setFilterCategory}
              onStatusChange={setFilterStatus}
              onRecurringChange={setFilterRecurring}
              onSearchChange={setSearch}
            />

            {viewMode === "list" ? (
              <div className="space-y-2">
                {sortedCategories.map((category) => {
                  const catExpenses = categoryMap.get(category.id) || []
                  if (catExpenses.length === 0) return null
                  return (
                    <CategoryAccordion
                      key={category.id}
                      category={category}
                      expenses={catExpenses}
                      onEdit={handleShowActions}
                      onAdd={handleAddExpense}
                      onTogglePaid={handleTogglePaid}
                      selectedIds={selectedIds}
                      onSelect={toggleSelect}
                    />
                  )
                })}
                {filteredExpenses.length === 0 && (
                  <div className="text-center py-12 text-sm text-muted-foreground">
                    Nenhuma conta encontrada com os filtros atuais.
                  </div>
                )}
              </div>
            ) : (
              <CalendarView
                expenses={filteredExpenses}
                categories={categories}
                month={filterMonth}
                year={parseInt(filterYear)}
              />
            )}
          </>
        ) : (
          <EmptyState
            icon={<Banknote className="h-16 w-16" />}
            title="Nenhuma conta cadastrada"
            description="Você ainda não possui contas registradas. Crie sua primeira conta para começar a organizar suas finanças."
            action={
              <div className="flex gap-3">
                <Button onClick={() => handleAddExpense()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira conta
                </Button>
              </div>
            }
          />
        )}
      </div>

      <ExpenseModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        expense={editingExpense}
        categories={categories}
        defaultCategoryId={defaultCategoryId}
        onSave={handleSave}
      />

      <ExpenseActions
        open={actionsModalOpen}
        onOpenChange={setActionsModalOpen}
        expense={selectedExpense}
        category={categories.find((c) => c.id === selectedExpense?.categoryId)}
        onEdit={() => {
          if (selectedExpense) handleEditExpense(selectedExpense)
        }}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onTogglePaid={handleTogglePaid}
      />

      <CategoryModal
        open={categoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        categories={categories}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
      />

      <Toaster position="bottom-right" theme="dark" />
    </div>
  )
}
