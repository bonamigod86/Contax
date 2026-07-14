"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Expense, Category } from "@/types"

interface ExpenseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense: Expense | null
  categories: Category[]
  defaultCategoryId?: string
  onSave: (data: Omit<Expense, "id" | "createdAt" | "updatedAt">, id?: string) => void
}

export function ExpenseModal({
  open,
  onOpenChange,
  expense,
  categories,
  defaultCategoryId,
  onSave,
}: ExpenseModalProps) {
  const [name, setName] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [value, setValue] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [status, setStatus] = useState<"pending" | "paid" | "overdue">("pending")
  const [notes, setNotes] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)

  useEffect(() => {
    if (expense) {
      setName(expense.name)
      setCategoryId(expense.categoryId)
      setValue(String(expense.value))
      setDueDate(expense.dueDate)
      setStatus(expense.status)
      setNotes(expense.notes)
      setIsRecurring(expense.isRecurring)
    } else {
      setName("")
      setCategoryId(defaultCategoryId || categories[0]?.id || "")
      setValue("")
      setDueDate(new Date().toISOString().split("T")[0])
      setStatus("pending")
      setNotes("")
      setIsRecurring(false)
    }
  }, [expense, defaultCategoryId, categories, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(
      {
        name,
        categoryId,
        value: parseFloat(value) || 0,
        dueDate,
        status,
        notes,
        isRecurring,
        month: dueDate.split("-")[1],
        year: parseInt(dueDate.split("-")[0]),
        order: expense?.order || 0,
      },
      expense?.id
    )
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{expense ? "Editar Conta" : "Nova Conta"}</DialogTitle>
          <DialogDescription>
            {expense ? "Altere as informações da conta abaixo." : "Preencha as informações da nova conta."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Conta de luz"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Valor (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => v && setStatus(v as "pending" | "paid" | "overdue")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="overdue">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações opcionais..."
              className="resize-none h-20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isRecurring"
              checked={isRecurring}
              onCheckedChange={(v) => setIsRecurring(v as boolean)}
            />
            <Label htmlFor="isRecurring" className="text-sm font-normal cursor-pointer">
              Conta recorrente (repete todo mês)
            </Label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
