"use client"

import { useState } from "react"
import type { Exercise } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Video } from "lucide-react"
import EditFlashcardDialog from "./edit-flashcard-dialog"
import { extractYouTubeId } from "@/lib/youtube"

interface FlashcardProps {
  exercise: Exercise
  onUpdate?: (updatedExercise: Exercise) => void
}

export default function Flashcard({ exercise, onUpdate }: FlashcardProps) {
  const [showDescription, setShowDescription] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  const title = exercise.title_en
  const description = exercise.description_en
  const videoId = exercise.youtube_url ? extractYouTubeId(exercise.youtube_url) : null

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

          {showVideo && videoId ? (
            <div className="w-full max-w-md aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          ) : showDescription ? (
            <p className="text-lg text-center">{description}</p>
          ) : null}
        </CardContent>

        <div className="p-4 flex justify-center gap-2">
          {videoId && (
            <Button
              onClick={() => {
                setShowVideo(!showVideo)
                if (!showVideo) setShowDescription(false)
              }}
              variant="outline"
              className="flex-1 max-w-xs"
            >
              <Video className="mr-2 h-4 w-4" />
              {showVideo ? "Hide Video" : "Show Video"}
            </Button>
          )}
          <Button
            onClick={() => {
              setShowDescription(!showDescription)
              if (!showDescription) setShowVideo(false)
            }}
            variant="outline"
            className="flex-1 max-w-xs"
          >
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
