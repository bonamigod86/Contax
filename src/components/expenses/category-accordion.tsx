"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ExpenseCard } from "./expense-card"
import { formatCurrency } from "@/lib/utils"
import { Plus, ChevronDown, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import type { Category, Expense } from "@/types"

interface CategoryAccordionProps {
  category: Category
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onAdd: (categoryId: string) => void
  onTogglePaid: (id: string) => void
  selectedIds: Set<string>
  onSelect: (id: string) => void
}

export function CategoryAccordion({
  category,
  expenses,
  onEdit,
  onAdd,
  onTogglePaid,
  selectedIds,
  onSelect,
}: CategoryAccordionProps) {
  const [open, setOpen] = useState(true)
  const sorted = [...expenses].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )
  const total = expenses.reduce((acc, e) => acc + e.value, 0)

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {open ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <div className="w-2 h-2 rounded-full bg-primary/60" />
          <span className="text-sm font-medium">{category.name}</span>
          <span className="text-xs text-muted-foreground">
            {expenses.length} {expenses.length === 1 ? "conta" : "contas"}
          </span>
        </div>
        <span className="text-sm font-semibold tabular-nums">{formatCurrency(total)}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-1 px-3 pb-3">
              <AnimatePresence mode="popLayout">
                {sorted.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onEdit={onEdit}
                    onTogglePaid={onTogglePaid}
                    selected={selectedIds.has(expense.id)}
                    onSelect={onSelect}
                  />
                ))}
              </AnimatePresence>
              <Separator className="my-2" />
              <div className="flex items-center justify-between px-1 pt-1">
                <span className="text-xs text-muted-foreground">Subtotal</span>
                <span className="text-sm font-semibold tabular-nums">{formatCurrency(total)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 text-xs text-muted-foreground hover:text-foreground gap-1 mt-2"
                onClick={() => onAdd(category.id)}
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar conta
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
