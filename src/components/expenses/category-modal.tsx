"use client"

import { useState } from "react"
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
import { Plus, Pencil, Trash2, Check, X } from "lucide-react"
import type { Category } from "@/types"

interface CategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  onAdd: (name: string) => void
  onUpdate: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export function CategoryModal({
  open,
  onOpenChange,
  categories,
  onAdd,
  onUpdate,
  onDelete,
}: CategoryModalProps) {
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (newName.trim()) {
      onAdd(newName.trim())
      setNewName("")
    }
  }

  const handleUpdate = (id: string) => {
    if (editName.trim()) {
      onUpdate(id, editName.trim())
      setEditingId(null)
      setEditName("")
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?\nAs contas dela serão movidas para a primeira categoria.")) {
      onDelete(id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Categorias</DialogTitle>
          <DialogDescription>
            Crie, edite ou exclua categorias para organizar suas contas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nova categoria..."
            className="h-9"
          />
          <Button type="submit" size="sm" className="h-9 gap-1 shrink-0" disabled={!newName.trim()}>
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </form>

        <div className="space-y-1 max-h-[300px] overflow-y-auto">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              {editingId === cat.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-emerald-500"
                    onClick={() => handleUpdate(cat.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary/60" />
                    <span className="text-sm">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        setEditingId(cat.id)
                        setEditName(cat.name)
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
