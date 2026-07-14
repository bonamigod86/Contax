export type ExpenseStatus = "pending" | "paid" | "overdue"

export interface Category {
  id: string
  name: string
  order: number
}

export interface Expense {
  id: string
  name: string
  categoryId: string
  value: number
  dueDate: string
  status: ExpenseStatus
  notes: string
  isRecurring: boolean
  createdAt: string
  updatedAt: string
  order: number
  month: string
  year: number
}

export type ViewMode = "list" | "calendar"

export interface AppData {
  expenses: Expense[]
  categories: Category[]
}
