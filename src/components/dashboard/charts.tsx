"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/lib/utils"
import type { Expense, Category } from "@/types"

interface ChartsProps {
  expenses: Expense[]
  categories: Category[]
}

const COLORS = [
  "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a855f7",
  "#06b6d4", "#f97316", "#ec4899", "#6366f1", "#14b8a6",
]

export function Charts({ expenses, categories }: ChartsProps) {
  const now = new Date()
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0")
  const currentYear = now.getFullYear()

  const monthExpenses = expenses.filter(
    (e) => e.month === currentMonth && e.year === currentYear
  )

  const categoryData = useMemo(() => {
    const map = new Map<string, number>()
    monthExpenses.forEach((e) => {
      const current = map.get(e.categoryId) || 0
      map.set(e.categoryId, current + e.value)
    })
    return Array.from(map.entries())
      .map(([categoryId, value]) => {
        const cat = categories.find((c) => c.id === categoryId)
        return {
          name: cat?.name || "Sem categoria",
          value,
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [monthExpenses, categories])

  const statusData = useMemo(() => {
    const paid = monthExpenses
      .filter((e) => e.status === "paid")
      .reduce((acc, e) => acc + e.value, 0)
    const pending = monthExpenses
      .filter((e) => e.status === "pending")
      .reduce((acc, e) => acc + e.value, 0)
    const overdue = monthExpenses
      .filter((e) => e.status === "overdue")
      .reduce((acc, e) => acc + e.value, 0)
    return [
      { name: "Pago", value: paid, color: "#22c55e" },
      { name: "Pendente", value: pending, color: "#f59e0b" },
      { name: "Atrasado", value: overdue, color: "#ef4444" },
    ]
  }, [monthExpenses])

  if (monthExpenses.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Distribuição por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {categoryData.slice(0, 6).map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {item.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Pagas vs Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  tickFormatter={(v) => `R$${(Number(v) / 100).toFixed(0)}`}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
