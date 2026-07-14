import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Expense, Category, ExpenseStatus } from "@/types"

interface StoreState {
  expenses: Expense[]
  categories: Category[]
  addExpense: (expense: Omit<Expense, "id" | "createdAt" | "updatedAt">) => void
  updateExpense: (id: string, data: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  addCategory: (name: string) => void
  updateCategory: (id: string, name: string) => void
  deleteCategory: (id: string) => void
  reorderCategories: (categories: Category[]) => void
  reorderExpenses: (expenses: Expense[]) => void
  duplicateExpense: (id: string) => void
  duplicateMonth: (month: string, year: number) => void
  markMultipleAsPaid: (ids: string[]) => void
  generateRecurringExpenses: () => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      expenses: [],
      categories: [
        { id: "1", name: "Casa", order: 0 },
        { id: "2", name: "Empresa", order: 1 },
        { id: "3", name: "Cartões de Crédito", order: 2 },
        { id: "4", name: "Assinaturas", order: 3 },
        { id: "5", name: "Veículos", order: 4 },
        { id: "6", name: "Impostos", order: 5 },
        { id: "7", name: "Saúde", order: 6 },
        { id: "8", name: "Lazer", order: 7 },
        { id: "9", name: "Outros", order: 8 },
      ],

      addExpense: (expenseData) =>
        set((state) => {
          const now = new Date().toISOString()
          const newExpense: Expense = {
            ...expenseData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
          }
          return { expenses: [...state.expenses, newExpense] }
        }),

      updateExpense: (id, data) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
          ),
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      addCategory: (name) =>
        set((state) => ({
          categories: [
            ...state.categories,
            {
              id: crypto.randomUUID(),
              name,
              order: state.categories.length,
            },
          ],
        })),

      updateCategory: (id, name) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, name } : c
          ),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          expenses: state.expenses.map((e) =>
            e.categoryId === id ? { ...e, categoryId: state.categories[0]?.id || "" } : e
          ),
        })),

      reorderCategories: (categories) => set({ categories }),

      reorderExpenses: (expenses) => set({ expenses }),

      duplicateExpense: (id) =>
        set((state) => {
          const original = state.expenses.find((e) => e.id === id)
          if (!original) return state
          const now = new Date().toISOString()
          const duplicate: Expense = {
            ...original,
            id: crypto.randomUUID(),
            name: `${original.name} (cópia)`,
            status: "pending",
            createdAt: now,
            updatedAt: now,
          }
          return { expenses: [...state.expenses, duplicate] }
        }),

      duplicateMonth: (month, year) =>
        set((state) => {
          const sourceExpenses = state.expenses.filter(
            (e) => e.month === month && e.year === year
          )
          if (sourceExpenses.length === 0) return state

          const [sourceYear, sourceMonth] = [year, parseInt(month)]
          let targetYear = sourceYear
          let targetMonth = sourceMonth + 1
          if (targetMonth > 12) {
            targetMonth = 1
            targetYear++
          }

          const now = new Date().toISOString()
          const newExpenses: Expense[] = sourceExpenses.map((e) => {
            const date = new Date(e.dueDate)
            date.setMonth(targetMonth - 1)
            date.setFullYear(targetYear)
            return {
              ...e,
              id: crypto.randomUUID(),
              dueDate: date.toISOString().split("T")[0],
              month: String(targetMonth).padStart(2, "0"),
              year: targetYear,
              status: "pending" as ExpenseStatus,
              createdAt: now,
              updatedAt: now,
            }
          })

          return { expenses: [...state.expenses, ...newExpenses] }
        }),

      markMultipleAsPaid: (ids) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            ids.includes(e.id) ? { ...e, status: "paid" as ExpenseStatus, updatedAt: new Date().toISOString() } : e
          ),
        })),

      generateRecurringExpenses: () =>
        set((state) => {
          const now = new Date()
          const currentMonth = now.getMonth() + 1
          const currentYear = now.getFullYear()
          const monthStr = String(currentMonth).padStart(2, "0")

          const recurring = state.expenses.filter(
            (e) =>
              e.isRecurring &&
              !(e.month === monthStr && e.year === currentYear)
          )

          if (recurring.length === 0) return state

          const newExpenses: Expense[] = recurring
            .filter((e) => {
              const alreadyExists = state.expenses.some(
                (ex) =>
                  ex.name === e.name &&
                  ex.categoryId === e.categoryId &&
                  ex.month === monthStr &&
                  ex.year === currentYear
              )
              return !alreadyExists
            })
            .map((e) => {
              const date = new Date(e.dueDate)
              date.setMonth(currentMonth - 1)
              date.setFullYear(currentYear)
              return {
                ...e,
                id: crypto.randomUUID(),
                dueDate: date.toISOString().split("T")[0],
                month: monthStr,
                year: currentYear,
                status: "pending" as ExpenseStatus,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            })

          return { expenses: [...state.expenses, ...newExpenses] }
        }),
    }),
    {
      name: "contax-data",
    }
  )
)
