"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { Exercise } from "@/lib/types"
import Flashcard from "@/components/flashcard"
import LanguageToggle from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Home, Settings, RefreshCw } from "lucide-react"
import { shuffleArray, getLocalExercises, saveLocalExercises } from "@/lib/utils"
import exercisesData from "@/data/exercices.json"

export default function FlashcardsPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [viewedIndices, setViewedIndices] = useState<Set<number>>(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  const initializeSession = () => {
    // Try to get exercises from localStorage first
    const localExercises = getLocalExercises()

    if (localExercises.length > 0) {
      // Filter out hidden exercises and shuffle
      const visibleExercises = localExercises.filter((ex) => !ex.hidden)
      setExercises(shuffleArray(visibleExercises))
    } else {
      // If no local exercises, use the default data
      saveLocalExercises(exercisesData as Exercise[])
      const visibleExercises = (exercisesData as Exercise[]).filter((ex) => !ex.hidden)
      setExercises(shuffleArray(visibleExercises))
    }

    // Reset viewed indices and current index
    setViewedIndices(new Set([0])) // Mark the first card as viewed
    setCurrentIndex(0)
    setProgress(0)
    setIsLoading(false)
  }

  useEffect(() => {
    initializeSession()
  }, [])

  useEffect(() => {
    if (exercises.length > 0) {
      const progressPercentage = (viewedIndices.size / exercises.length) * 100
      setProgress(progressPercentage)
    }
  }, [viewedIndices, exercises.length])

  const resetSession = () => {
    setIsLoading(true)
    setTimeout(() => {
      initializeSession()
    }, 300)
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToNext = () => {
    // If we've seen all cards, just go to the next one in sequence
    if (viewedIndices.size >= exercises.length) {
      setCurrentIndex((prev) => (prev < exercises.length - 1 ? prev + 1 : prev))
      return
    }

    // Find the next unviewed card
    const unviewedIndices = Array.from({ length: exercises.length }, (_, i) => i).filter((i) => !viewedIndices.has(i))

    if (unviewedIndices.length > 0) {
      // Pick a random unviewed card
      const randomIndex = Math.floor(Math.random() * unviewedIndices.length)
      const nextIndex = unviewedIndices[randomIndex]

      // Mark it as viewed and set as current
      const newViewedIndices = new Set(viewedIndices)
      newViewedIndices.add(nextIndex)
      setViewedIndices(newViewedIndices)
      setCurrentIndex(nextIndex)
    } else {
      // If all cards have been viewed, just go to the next one in sequence
      setCurrentIndex((prev) => (prev < exercises.length - 1 ? prev + 1 : prev))
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">No exercises available</h1>
        <p className="mb-8">All exercises are hidden or no exercises were found.</p>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/manage">
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Manage Exercises
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <LanguageToggle />

      <div className="w-full max-w-2xl mb-2 mt-12">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress: {Math.round(progress)}%</span>
          <span className="text-sm">
            {viewedIndices.size} / {exercises.length} cards viewed
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex justify-between items-center w-full max-w-2xl mb-8 mt-4">
        <Link href="/">
          <Button variant="outline" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>

        <div className="text-sm">
          Card {currentIndex + 1} / {exercises.length}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetSession}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Link href="/manage">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Manage
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <Flashcard exercise={exercises[currentIndex]} />
      </div>

      <div className="flex justify-between w-full max-w-2xl mt-8 mb-12">
        <Button onClick={goToPrevious} disabled={currentIndex === 0} className="w-24">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Prev
        </Button>

        <Button
          onClick={goToNext}
          disabled={viewedIndices.size >= exercises.length && currentIndex === exercises.length - 1}
          className="w-24"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
