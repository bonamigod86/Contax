"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils"
import type { Expense, Category } from "@/types"

interface NextBillsProps {
  expenses: Expense[]
  categories: Category[]
}

export function NextBills({ expenses, categories }: NextBillsProps) {
  const now = new Date()
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0")
  const currentYear = now.getFullYear()

  const nextDue = [...expenses]
    .filter((e) => e.month === currentMonth && e.year === currentYear && e.status !== "paid")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  if (nextDue.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Próximos Vencimentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {nextDue.map((expense) => {
          const category = categories.find((c) => c.id === expense.categoryId)
          return (
            <div
              key={expense.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{expense.name}</span>
                <span className="text-xs text-muted-foreground">{category?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium tabular-nums">
                  {formatCurrency(expense.value)}
                </span>
                <Badge variant="outline" className={getStatusColor(expense.status)}>
                  {getStatusLabel(expense.status)}
                </Badge>
                <span className="text-xs text-muted-foreground min-w-[70px] text-right">
                  {new Date(expense.dueDate + "T12:00:00").toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
