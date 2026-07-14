"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils"
import {
  Pencil,
  Copy,
  Trash2,
  CheckCircle2,
  Undo2,
  AlertCircle,
  RotateCcw,
} from "lucide-react"
import type { Expense, Category } from "@/types"

interface ExpenseActionsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense: Expense | null
  category?: Category
  onEdit: () => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onTogglePaid: (id: string) => void
}

export function ExpenseActions({
  open,
  onOpenChange,
  expense,
  category,
  onEdit,
  onDuplicate,
  onDelete,
  onTogglePaid,
}: ExpenseActionsProps) {
  if (!expense) return null

  const isOverdue =
    expense.status === "overdue" ||
    (expense.status === "pending" &&
      new Date(expense.dueDate + "T23:59:59") < new Date())

  const actions = [
    {
      label: "Editar informações",
      icon: Pencil,
      onClick: () => {
        onEdit()
        onOpenChange(false)
      },
    },
    {
      label: expense.status === "paid" ? "Reverter para pendente" : "Marcar como pago",
      icon: expense.status === "paid" ? Undo2 : CheckCircle2,
      onClick: () => {
        onTogglePaid(expense.id)
        onOpenChange(false)
      },
    },
    {
      label: "Duplicar conta",
      icon: Copy,
      onClick: () => {
        onDuplicate(expense.id)
        onOpenChange(false)
      },
    },
    {
      label: "Excluir conta",
      icon: Trash2,
      destructive: true,
      onClick: () => {
        if (confirm("Tem certeza que deseja excluir esta conta?")) {
          onDelete(expense.id)
          onOpenChange(false)
        }
      },
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base">{expense.name}</DialogTitle>
            <Badge
              variant="outline"
              className={getStatusColor(isOverdue && expense.status === "pending" ? "overdue" : expense.status)}
            >
              {isOverdue && expense.status === "pending" ? "Atrasado" : getStatusLabel(expense.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Valor</span>
            <span className="font-semibold">{formatCurrency(expense.value)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Vencimento</span>
            <span>{new Date(expense.dueDate + "T12:00:00").toLocaleDateString("pt-BR")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Categoria</span>
            <span>{category?.name || "Sem categoria"}</span>
          </div>
          {expense.isRecurring && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Recorrência</span>
              <span className="flex items-center gap-1">
                <RotateCcw className="h-3 w-3" /> Mensal
              </span>
            </div>
          )}
          {expense.notes && (
            <>
              <Separator />
              <div className="text-sm">
                <span className="text-muted-foreground block mb-1">Observações</span>
                <p className="text-sm">{expense.notes}</p>
              </div>
            </>
          )}
        </div>

        <Separator />

        <div className="flex flex-col gap-1">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className={`justify-start gap-3 h-9 text-sm ${action.destructive ? "text-destructive hover:text-destructive hover:bg-destructive/10" : ""}`}
              onClick={action.onClick}
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
