"use client"

import { useState } from "react"
import type { Exercise } from "@/lib/types"
import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil } from "lucide-react"
import EditFlashcardDialog from "./edit-flashcard-dialog"

interface FlashcardProps {
  exercise: Exercise
  onUpdate?: (updatedExercise: Exercise) => void
}

export default function Flashcard({ exercise, onUpdate }: FlashcardProps) {
  const [showDescription, setShowDescription] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { language } = useLanguage()

  const title = language === "en" ? exercise.title_en : exercise.title_fr
  const description = language === "en" ? exercise.description_en : exercise.description_fr

  const handleSave = (updatedExercise: Exercise) => {
    onUpdate?.(updatedExercise)
  }

  return (
    <>
      <Card className="w-full max-w-2xl h-96 flex flex-col justify-between relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 opacity-50 hover:opacity-100"
          onClick={() => setShowEditDialog(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <CardContent className="flex flex-col items-center justify-center h-full p-6">
          <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>

          {showDescription && <p className="text-lg text-center">{description}</p>}
        </CardContent>

        <div className="p-4 flex justify-center">
          <Button onClick={() => setShowDescription(!showDescription)} variant="outline" className="w-full max-w-xs">
            {showDescription ? "Hide Description" : "Show Description"}
          </Button>
        </div>
      </Card>

      <EditFlashcardDialog
        exercise={exercise}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleSave}
      />
    </>
  )
}
