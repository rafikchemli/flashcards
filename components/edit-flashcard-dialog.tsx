"use client"

import { useState } from "react"
import type { Exercise } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EditFlashcardDialogProps {
  exercise: Exercise
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedExercise: Exercise) => void
}

export default function EditFlashcardDialog({
  exercise,
  open,
  onOpenChange,
  onSave,
}: EditFlashcardDialogProps) {
  const [formData, setFormData] = useState<Exercise>(exercise)

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Flashcard</DialogTitle>
          <DialogDescription>Make changes to the flashcard content below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title_en">Title</Label>
            <Input
              id="title_en"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description_en">Description</Label>
            <Textarea
              id="description_en"
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              rows={6}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="block">Block</Label>
              <Input
                id="block"
                value={formData.block}
                onChange={(e) => setFormData({ ...formData, block: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
