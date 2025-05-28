"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import type { Exercise } from "@/lib/types"
import Flashcard from "@/components/flashcard"
import LanguageToggle from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Home, Settings, RefreshCw } from "lucide-react"
import { shuffleArray, getLocalExercises, saveLocalExercises } from "@/lib/utils"
import exercisesData from "@/data/exercices.json"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function FlashcardsPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [viewedIndices, setViewedIndices] = useState<Set<number>>(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [showBlockFilters, setShowBlockFilters] = useState(false)
  const [showLevelFilters, setShowLevelFilters] = useState(false)
  const blockFilterRef = useRef<HTMLDivElement>(null)
  const levelFilterRef = useRef<HTMLDivElement>(null)

  const initializeSession = () => {
    // Try to get exercises from localStorage first
    const localExercises = getLocalExercises()

    let allExercises: Exercise[] = [];
    if (localExercises.length > 0) {
      // Filter out hidden exercises
      allExercises = localExercises.filter((ex) => !ex.hidden)
      setExercises(shuffleArray(allExercises))
      setFilteredExercises(shuffleArray(allExercises))
    } else {
      // If no local exercises, use the default data
      saveLocalExercises(exercisesData as Exercise[])
      allExercises = (exercisesData as Exercise[]).filter((ex) => !ex.hidden)
      setExercises(shuffleArray(allExercises))
      setFilteredExercises(shuffleArray(allExercises))
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
    if (filteredExercises.length > 0) {
      const progressPercentage = ((currentIndex + 1) / filteredExercises.length) * 100
      setProgress(progressPercentage)
    } else {
      setProgress(0)
    }
  }, [currentIndex, filteredExercises.length])

  useEffect(() => {
    // Apply filters based on selected blocks and levels
    const filtered = exercises.filter((ex) => {
      const matchesBlock = selectedBlocks.length > 0 ? selectedBlocks.includes(ex.block) : true
      const matchesLevel = selectedLevels.length > 0 ? selectedLevels.includes(ex.level) : true
      return matchesBlock && matchesLevel
    })
    setFilteredExercises(filtered)
    setCurrentIndex(0)
    setViewedIndices(new Set([0]))
  }, [selectedBlocks, selectedLevels, exercises])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (blockFilterRef.current && !blockFilterRef.current.contains(event.target as Node)) {
        setShowBlockFilters(false)
      }
      if (levelFilterRef.current && !levelFilterRef.current.contains(event.target as Node)) {
        setShowLevelFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const resetSession = () => {
    setIsLoading(true)
    setTimeout(() => {
      initializeSession()
    }, 300)
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      // Ajouter l'index actuel à viewedIndices si ce n'est pas déjà fait
      const newViewedIndices = new Set(viewedIndices)
      newViewedIndices.add(currentIndex - 1)
      setViewedIndices(newViewedIndices)
    }
  }

  const goToNext = () => {
    if (filteredExercises.length === 0) return;

    if (currentIndex < filteredExercises.length - 1) {
      setCurrentIndex(currentIndex + 1)
      // Ajouter l'index suivant à viewedIndices si ce n'est pas déjà fait
      const newViewedIndices = new Set(viewedIndices)
      newViewedIndices.add(currentIndex + 1)
      setViewedIndices(newViewedIndices)
    } else {
      // Si on est à la fin, revenir au début pour permettre une navigation circulaire
      setCurrentIndex(0)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Récupérer toutes les valeurs uniques de block et level pour les filtres
  const allBlocks = Array.from(new Set(exercises.map((ex) => ex.block))).sort()
  const allLevels = Array.from(new Set(exercises.map((ex) => ex.level))).sort()

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <LanguageToggle />

      <div className="w-full max-w-2xl mb-2 mt-12">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress: {Math.round(progress)}%</span>
          <span className="text-sm">
            {viewedIndices.size} / {filteredExercises.length || exercises.length} cards viewed
          </span>
        </div>
        <Progress value={filteredExercises.length > 0 ? progress : 0} className="h-2" />
      </div>

      <div className="flex justify-between items-center w-full max-w-2xl mb-8 mt-4">
        <Link href="/">
          <Button variant="outline" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>

        <div className="text-sm">
          Card {filteredExercises.length > 0 ? currentIndex + 1 : 0} / {filteredExercises.length || exercises.length}
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

      {/* Filtres block et level avec sélection multiple */}
      <div className="flex w-full max-w-2xl mb-4 gap-4">
        <div className="flex-1 relative" ref={blockFilterRef}>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowBlockFilters(!showBlockFilters)}
          >
            Filter by Block ({selectedBlocks.length})
          </Button>
          {showBlockFilters && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg p-2 max-h-60 overflow-auto">
              <ScrollArea className="h-full">
                {allBlocks.map((block) => (
                  <div key={block} className="flex items-center space-x-2 p-1">
                    <Checkbox
                      id={`block-${block}`}
                      checked={selectedBlocks.includes(block)}
                      onCheckedChange={(checked) => {
                        setSelectedBlocks(
                          checked
                            ? [...selectedBlocks, block]
                            : selectedBlocks.filter((b) => b !== block)
                        )
                      }}
                    />
                    <Label htmlFor={`block-${block}`} className="text-sm">
                      {block}
                    </Label>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
        <div className="flex-1 relative" ref={levelFilterRef}>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowLevelFilters(!showLevelFilters)}
          >
            Filter by Level ({selectedLevels.length})
          </Button>
          {showLevelFilters && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg p-2 max-h-60 overflow-auto">
              <ScrollArea className="h-full">
                {allLevels.map((level) => (
                  <div key={level} className="flex items-center space-x-2 p-1">
                    <Checkbox
                      id={`level-${level}`}
                      checked={selectedLevels.includes(level)}
                      onCheckedChange={(checked) => {
                        setSelectedLevels(
                          checked
                            ? [...selectedLevels, level]
                            : selectedLevels.filter((l) => l !== level)
                        )
                      }}
                    />
                    <Label htmlFor={`level-${level}`} className="text-sm">
                      {level}
                    </Label>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
        {(selectedBlocks.length > 0 || selectedLevels.length > 0) && (
          <button
            className="ml-2 text-xs underline text-gray-500"
            onClick={() => { setSelectedBlocks([]); setSelectedLevels([]); }}
          >
            Reset filters
          </button>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        {filteredExercises.length > 0 ? (
          <Flashcard exercise={filteredExercises[currentIndex]} />
        ) : (
          <div className="w-full max-w-md h-96 flex items-center justify-center border rounded-lg shadow-md bg-white">
            <p className="text-lg text-gray-600 text-center">No exercises found with the selected filters. Please change filters.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between w-full max-w-2xl mt-8 mb-12">
        <Button onClick={goToPrevious} disabled={filteredExercises.length === 0 || currentIndex === 0} className="w-24">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Prev
        </Button>

        <Button
          onClick={goToNext}
          disabled={filteredExercises.length === 0 || currentIndex === filteredExercises.length - 1}
          className="w-24"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
