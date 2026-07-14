"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  Banknote,
  AlertCircle,
  CheckCircle2,
  Clock,
  CalendarDays,
  ListChecks,
} from "lucide-react"
import type { Expense } from "@/types"

interface DashboardCardsProps {
  expenses: Expense[]
  loading?: boolean
}

export function DashboardCards({ expenses, loading }: DashboardCardsProps) {
  const now = new Date()
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0")
  const currentYear = now.getFullYear()

  const monthExpenses = expenses.filter(
    (e) => e.month === currentMonth && e.year === currentYear
  )

  const total = monthExpenses.reduce((acc, e) => acc + e.value, 0)
  const totalPaid = monthExpenses
    .filter((e) => e.status === "paid")
    .reduce((acc, e) => acc + e.value, 0)
  const totalPending = monthExpenses
    .filter((e) => e.status === "pending")
    .reduce((acc, e) => acc + e.value, 0)
  const totalOverdue = monthExpenses
    .filter((e) => e.status === "overdue")
    .reduce((acc, e) => acc + e.value, 0)

  const nextDue = [...monthExpenses]
    .filter((e) => e.status !== "paid")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]

  const cards = [
    {
      title: "Total do Mês",
      value: formatCurrency(total),
      icon: Banknote,
      color: "text-blue-500",
    },
    {
      title: "Total Pago",
      value: formatCurrency(totalPaid),
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
    {
      title: "Total Pendente",
      value: formatCurrency(totalPending),
      icon: Clock,
      color: "text-amber-500",
    },
    {
      title: "Total Vencido",
      value: formatCurrency(totalOverdue),
      icon: AlertCircle,
      color: "text-red-500",
    },
    {
      title: "Próximo Vencimento",
      value: nextDue ? new Date(nextDue.dueDate + "T12:00:00").toLocaleDateString("pt-BR") : "—",
      icon: CalendarDays,
      color: "text-purple-500",
    },
    {
      title: "Quantidade de Contas",
      value: String(monthExpenses.length),
      icon: ListChecks,
      color: "text-cyan-500",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="border-border/50 hover:border-border/80 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <card.icon className={`h-4 w-4 ${card.color}`} />
                <span className="text-xs text-muted-foreground">{card.title}</span>
              </div>
              <p className="text-lg font-semibold tracking-tight">{card.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
