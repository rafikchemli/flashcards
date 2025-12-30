"use client"

import { useState, useEffect } from "react"
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
  const [videoLoading, setVideoLoading] = useState(false)

  const title = exercise.title_en
  const description = exercise.description_en
  const videoId = exercise.youtube_url ? extractYouTubeId(exercise.youtube_url) : null
  const hasDirectVideo = !!exercise.video
  const hasAnyVideo = videoId || hasDirectVideo

  // Reset video and description when exercise changes
  useEffect(() => {
    setShowVideo(false)
    setShowDescription(false)
    setVideoLoading(false)
  }, [exercise.id])

  // Set loading when video is toggled on
  useEffect(() => {
    if (showVideo) {
      setVideoLoading(true)
      // Auto-hide loader after 2 seconds as fallback
      const timer = setTimeout(() => setVideoLoading(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showVideo])

  const handleSave = (updatedExercise: Exercise) => {
    onUpdate?.(updatedExercise)
  }

  return (
    <>
      <Card className="w-full max-w-2xl min-h-96 max-h-[600px] flex flex-col relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 opacity-50 hover:opacity-100 z-10"
          onClick={() => setShowEditDialog(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <CardContent className={`flex flex-col items-center flex-1 p-6 overflow-y-auto ${showVideo || showDescription ? 'justify-start' : 'justify-center'}`}>
          <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>

          <div className="w-full space-y-4 flex flex-col items-center">
            {showVideo && videoId && (
              <div className="w-full max-w-md aspect-video relative">
                {videoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                  </div>
                )}
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title={title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                  onLoad={() => setVideoLoading(false)}
                />
              </div>
            )}

            {showVideo && hasDirectVideo && (
              <div className="w-full max-w-md aspect-video relative">
                {videoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                  </div>
                )}
                <video
                  width="100%"
                  height="100%"
                  controls
                  autoPlay
                  className="rounded-lg"
                  onLoadedData={() => setVideoLoading(false)}
                  onWaiting={() => setVideoLoading(true)}
                  onPlaying={() => setVideoLoading(false)}
                >
                  <source src={exercise.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {showDescription && description && (
              <div className="text-sm text-left max-w-md space-y-4">
                {description.split('\n\n').map((section, sectionIdx) => {
                  const lines = section.split('\n');
                  const header = lines[0];
                  const items = lines.slice(1);

                  // Check if this is a section with a header
                  if (header.endsWith(':')) {
                    const isPrecaution = header.toLowerCase().includes('precaution');
                    return (
                      <div key={sectionIdx} className={isPrecaution ? 'border-l-4 border-red-500 pl-3' : ''}>
                        <h4 className={`font-semibold mb-2 ${isPrecaution ? 'text-red-600' : 'text-gray-900'}`}>
                          {header}
                        </h4>
                        <ul className="space-y-1.5">
                          {items.map((item, itemIdx) => (
                            <li key={itemIdx} className={`flex items-start ${isPrecaution ? 'text-red-600' : 'text-gray-700'}`}>
                              <span className="mr-2 mt-0.5 flex-shrink-0">{item.startsWith('⚠️') ? '⚠️' : '•'}</span>
                              <span>{item.replace(/^[•⚠️]\s*/, '')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        </CardContent>

        <div className="p-4 flex justify-center gap-2">
          {hasAnyVideo && (
            <Button
              onClick={() => setShowVideo(!showVideo)}
              variant="outline"
              className="flex-1 max-w-xs"
            >
              <Video className="mr-2 h-4 w-4" />
              {showVideo ? "Hide Video" : "Show Video"}
            </Button>
          )}
          <Button
            onClick={() => setShowDescription(!showDescription)}
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
