"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils"
import { Pencil, RotateCcw, GripVertical } from "lucide-react"
import { motion } from "framer-motion"
import type { Expense } from "@/types"

interface ExpenseCardProps {
  expense: Expense
  onEdit: (expense: Expense) => void
  onTogglePaid: (id: string) => void
  selected?: boolean
  onSelect?: (id: string) => void
}

export function ExpenseCard({ expense, onEdit, onTogglePaid, selected, onSelect }: ExpenseCardProps) {
  const isOverdue = expense.status === "overdue" || (
    expense.status === "pending" &&
    new Date(expense.dueDate + "T23:59:59") < new Date()
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
    >
      {onSelect && (
        <Checkbox
          checked={selected}
          onCheckedChange={() => onSelect(expense.id)}
          className="data-[state=checked]:bg-primary"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{expense.name}</span>
          {expense.isRecurring && (
            <RotateCcw className="h-3 w-3 text-muted-foreground shrink-0" />
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(expense.dueDate + "T12:00:00").toLocaleDateString("pt-BR")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium tabular-nums">{formatCurrency(expense.value)}</span>
        <Badge
          variant="outline"
          className={`${getStatusColor(isOverdue && expense.status === "pending" ? "overdue" : expense.status)} text-[10px] px-1.5 py-0`}
        >
          {isOverdue && expense.status === "pending" ? "Atrasado" : getStatusLabel(expense.status)}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onEdit(expense)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  )
}
