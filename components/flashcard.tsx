"use client"

import { useState } from "react"
import type { Exercise } from "@/lib/types"
import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FlashcardProps {
  exercise: Exercise
}

export default function Flashcard({ exercise }: FlashcardProps) {
  const [showDescription, setShowDescription] = useState(false)
  const { language } = useLanguage()

  const title = language === "en" ? exercise.title_en : exercise.title_fr
  const description = language === "en" ? exercise.description_en : exercise.description_fr

  return (
    <Card className="w-full max-w-2xl h-96 flex flex-col justify-between">
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
  )
}
