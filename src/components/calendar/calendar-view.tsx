"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Expense, Category } from "@/types"

interface CalendarViewProps {
  expenses: Expense[]
  categories: Category[]
  month: string
  year: number
}

export function CalendarView({ expenses, month, year }: CalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const daysInMonth = new Date(year, parseInt(month), 0).getDate()
  const firstDayOfWeek = new Date(year, parseInt(month) - 1, 1).getDay()

  const days = useMemo(() => {
    const daysArray = []
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i)
    }
    return daysArray
  }, [daysInMonth, firstDayOfWeek])

  const expensesByDay = useMemo(() => {
    const map = new Map<number, Expense[]>()
    expenses
      .filter((e) => e.month === month && e.year === year)
      .forEach((e) => {
        const day = parseInt(e.dueDate.split("-")[2])
        const existing = map.get(day) || []
        existing.push(e)
        map.set(day, existing)
      })
    return map
  }, [expenses, month, year])

  const getDayStatus = (day: number) => {
    const dayExpenses = expensesByDay.get(day)
    if (!dayExpenses) return null
    if (dayExpenses.every((e) => e.status === "paid")) return "paid"
    if (dayExpenses.some((e) => e.status === "overdue" || (e.status === "pending" && new Date(`${year}-${month}-${String(day).padStart(2, "0")}T23:59:59`) < new Date())))
      return "overdue"
    return "pending"
  }

  const today = new Date()
  const isToday = (day: number) =>
    day === today.getDate() &&
    parseInt(month) === today.getMonth() + 1 &&
    year === today.getFullYear()

  const dayExpenses = selectedDay ? expensesByDay.get(selectedDay) || [] : []

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      <div className="md:col-span-5">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="text-center text-xs text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {days.map((day, i) => (
                <div key={i} className="aspect-square p-0.5">
                  {day && (
                    <button
                      onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                      className={`w-full h-full rounded-lg text-xs flex flex-col items-center justify-center gap-0.5 transition-colors relative
                        ${isToday(day) ? "ring-1 ring-primary" : ""}
                        ${selectedDay === day ? "bg-primary/10" : "hover:bg-muted"}
                      `}
                    >
                      <span className={`font-medium ${isToday(day) ? "text-primary" : ""}`}>{day}</span>
                      {getDayStatus(day) && (
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            getDayStatus(day) === "paid"
                              ? "bg-emerald-500"
                              : getDayStatus(day) === "overdue"
                              ? "bg-red-500"
                              : "bg-amber-500"
                          }`}
                        />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="h-full">
          <CardContent className="p-4">
            {selectedDay ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">
                    {String(selectedDay).padStart(2, "0")}/{String(month).padStart(2, "0")}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {dayExpenses.length} {dayExpenses.length === 1 ? "conta" : "contas"}
                  </span>
                </div>
                {dayExpenses.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Nenhuma conta neste dia</p>
                ) : (
                  <div className="space-y-2">
                    {dayExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="p-2 rounded-lg border bg-card space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium truncate">{expense.name}</span>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(expense.status)} text-[10px] px-1 py-0`}
                          >
                            {getStatusLabel(expense.status)}
                          </Badge>
                        </div>
                        <span className="text-xs font-semibold tabular-nums">
                          {formatCurrency(expense.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-xs text-muted-foreground">Clique em um dia para ver as contas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
