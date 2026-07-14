"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"
import type { Category, ExpenseStatus } from "@/types"

interface FilterBarProps {
  categories: Category[]
  selectedMonth: string
  selectedYear: string
  selectedCategory: string
  selectedStatus: string
  selectedRecurring: string
  search: string
  onMonthChange: (v: string) => void
  onYearChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onStatusChange: (v: string) => void
  onRecurringChange: (v: string) => void
  onSearchChange: (v: string) => void
}

export function FilterBar({
  categories,
  selectedMonth,
  selectedYear,
  selectedCategory,
  selectedStatus,
  selectedRecurring,
  search,
  onMonthChange,
  onYearChange,
  onCategoryChange,
  onStatusChange,
  onRecurringChange,
  onSearchChange,
}: FilterBarProps) {
  const [open, setOpen] = useState(false)

  const hasFilters =
    selectedMonth || selectedYear || selectedCategory || selectedStatus || selectedRecurring

  const clearFilters = () => {
    onMonthChange("")
    onYearChange("")
    onCategoryChange("")
    onStatusChange("")
    onRecurringChange("")
    onSearchChange("")
  }

  const months = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conta..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(!open)}
          className="h-9 gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasFilters && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {open && (
        <div className="flex flex-wrap gap-2 p-3 rounded-lg border bg-card">
          <Select value={selectedMonth} onValueChange={(v) => v && onMonthChange(v)}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value} className="text-xs">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={(v) => v && onYearChange(v)}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {[2025, 2026, 2027].map((y) => (
                <SelectItem key={y} value={String(y)} className="text-xs">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={(v) => v && onCategoryChange(v)}>
            <SelectTrigger className="w-[150px] h-8 text-xs">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-xs">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={(v) => v && onStatusChange(v)}>
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending" className="text-xs">Pendente</SelectItem>
              <SelectItem value="paid" className="text-xs">Pago</SelectItem>
              <SelectItem value="overdue" className="text-xs">Atrasado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRecurring} onValueChange={(v) => v && onRecurringChange(v)}>
            <SelectTrigger className="w-[150px] h-8 text-xs">
              <SelectValue placeholder="Recorrência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true" className="text-xs">Recorrentes</SelectItem>
              <SelectItem value="false" className="text-xs">Não recorrentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
