"use client"

import { useState, useEffect } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getLocalExercises } from "@/lib/utils"

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
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([])
  const [availableLevels, setAvailableLevels] = useState<string[]>([])
  const [showCustomBlock, setShowCustomBlock] = useState(false)
  const [showCustomLevel, setShowCustomLevel] = useState(false)
  const [customBlock, setCustomBlock] = useState("")
  const [customLevel, setCustomLevel] = useState("")

  useEffect(() => {
    // Update form data when exercise changes
    setFormData(exercise)
    // Reset custom inputs
    setShowCustomBlock(false)
    setShowCustomLevel(false)
    setCustomBlock("")
    setCustomLevel("")
  }, [exercise])

  useEffect(() => {
    // Get all unique blocks and levels from localStorage
    const exercises = getLocalExercises()
    const blocks = Array.from(new Set(exercises.map((ex) => ex.block))).sort()
    const levels = Array.from(new Set(exercises.map((ex) => ex.level))).sort()
    setAvailableBlocks(blocks)
    setAvailableLevels(levels)
  }, [open])

  const handleSave = () => {
    // Use custom values if they were entered
    const finalData = {
      ...formData,
      block: showCustomBlock ? customBlock : formData.block,
      level: showCustomLevel ? customLevel : formData.level,
    }
    onSave(finalData)
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
              {!showCustomBlock ? (
                <>
                  <Select
                    value={formData.block}
                    onValueChange={(value) => {
                      if (value === "_custom_") {
                        setShowCustomBlock(true)
                      } else {
                        setFormData({ ...formData, block: value })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select block" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBlocks.map((block) => (
                        <SelectItem key={block} value={block}>
                          {block}
                        </SelectItem>
                      ))}
                      <SelectItem value="_custom_">+ Create new block</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={customBlock}
                    onChange={(e) => setCustomBlock(e.target.value)}
                    placeholder="Enter new block name"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomBlock(false)
                      setCustomBlock("")
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="level">Level</Label>
              {!showCustomLevel ? (
                <>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => {
                      if (value === "_custom_") {
                        setShowCustomLevel(true)
                      } else {
                        setFormData({ ...formData, level: value })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                      <SelectItem value="_custom_">+ Create new level</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={customLevel}
                    onChange={(e) => setCustomLevel(e.target.value)}
                    placeholder="Enter new level name"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomLevel(false)
                      setCustomLevel("")
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              checked={formData.hidden}
              onCheckedChange={(checked) => setFormData({ ...formData, hidden: checked })}
              id="hidden-toggle"
            />
            <Label htmlFor="hidden-toggle" className="text-sm font-medium cursor-pointer">
              Hide from flashcards
            </Label>
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
