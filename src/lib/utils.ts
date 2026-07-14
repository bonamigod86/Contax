import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date + "T12:00:00"))
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "paid":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    case "overdue":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    default:
      return "bg-amber-500/10 text-amber-500 border-amber-500/20"
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "paid":
      return "Pago"
    case "overdue":
      return "Atrasado"
    default:
      return "Pendente"
  }
}

export function getMonthName(month: number): string {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ]
  return months[month - 1] || ""
}
