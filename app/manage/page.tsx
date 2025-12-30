"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { Exercise } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Save, Trash2, Search, X } from "lucide-react"
import { getLocalExercises, saveLocalExercises } from "@/lib/utils"
import exercisesData from "@/data/exercices.json"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ManagePage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null)
  const [editedExercise, setEditedExercise] = useState<Exercise | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [blockFilter, setBlockFilter] = useState<string>("")
  const [levelFilter, setLevelFilter] = useState<string>("")
  const [showCustomBlock, setShowCustomBlock] = useState(false)
  const [showCustomLevel, setShowCustomLevel] = useState(false)
  const [customBlock, setCustomBlock] = useState("")
  const [customLevel, setCustomLevel] = useState("")

  useEffect(() => {
    // Try to get exercises from localStorage first
    const localExercises = getLocalExercises()

    if (localExercises.length > 0) {
      setExercises(localExercises)
      setSelectedExerciseId(localExercises[0].id)
    } else {
      // If no local exercises, use the default data
      saveLocalExercises(exercisesData as Exercise[])
      setExercises(exercisesData as Exercise[])
      setSelectedExerciseId((exercisesData as Exercise[])[0].id)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (selectedExerciseId !== null) {
      const exercise = exercises.find((ex) => ex.id === selectedExerciseId)
      if (exercise) {
        setEditedExercise({ ...exercise })
      }
    }
  }, [selectedExerciseId, exercises])

  const handleInputChange = (field: string, value: string | boolean) => {
    if (!editedExercise) return

    setEditedExercise({
      ...editedExercise,
      [field]: value,
    })
  }

  const saveChanges = () => {
    if (!editedExercise) return

    // Use custom values if they were entered
    const finalExercise = {
      ...editedExercise,
      block: showCustomBlock ? customBlock : editedExercise.block,
      level: showCustomLevel ? customLevel : editedExercise.level,
    }

    const updatedExercises = exercises.map((ex) => (ex.id === editedExercise.id ? finalExercise : ex))

    setExercises(updatedExercises)
    saveLocalExercises(updatedExercises)

    // Reset custom inputs
    setShowCustomBlock(false)
    setShowCustomLevel(false)
    setCustomBlock("")
    setCustomLevel("")
  }

  const deleteExercise = () => {
    if (!editedExercise || exercises.length <= 1) return

    const updatedExercises = exercises.filter((ex) => ex.id !== editedExercise.id)
    setExercises(updatedExercises)
    saveLocalExercises(updatedExercises)

    // Select the first exercise after deletion
    if (updatedExercises.length > 0) {
      setSelectedExerciseId(updatedExercises[0].id)
    } else {
      setSelectedExerciseId(null)
      setEditedExercise(null)
    }
  }

  const resetToDefault = () => {
    if (confirm("This will reset all exercises to default. Continue?")) {
      saveLocalExercises(exercisesData as Exercise[])
      setExercises(exercisesData as Exercise[])
      setSelectedExerciseId((exercisesData as Exercise[])[0].id)
    }
  }

  // Récupérer toutes les valeurs uniques de block et level pour les filtres
  const allBlocks = Array.from(new Set(exercises.map((ex) => ex.block))).sort()
  const allLevels = Array.from(new Set(exercises.map((ex) => ex.level))).sort()

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.title_en.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBlock = blockFilter ? ex.block === blockFilter : true
    const matchesLevel = levelFilter ? ex.level === levelFilter : true
    return matchesSearch && matchesBlock && matchesLevel
  })

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
        <Button onClick={resetToDefault}>Reset to Default</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="flex justify-between items-center w-full max-w-4xl mb-8 mt-12">
        <Link href="/">
          <Button variant="outline" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>

        <h1 className="text-xl font-bold">Manage Exercises</h1>

        <Button variant="outline" size="sm" onClick={resetToDefault}>
          Reset All
        </Button>
      </div>

      {/* Filtres block et level */}
      <div className="flex w-full max-w-4xl mb-4 gap-4">
        <div className="flex-1">
          <select
            className="w-full border rounded px-3 py-2 text-sm bg-white"
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
          >
            <option value="">All Blocks</option>
            {allBlocks.map((block) => (
              <option key={block} value={block}>{block}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <select
            className="w-full border rounded px-3 py-2 text-sm bg-white"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="">All Levels</option>
            {allLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        {(blockFilter || levelFilter) && (
          <button
            className="ml-2 text-xs underline text-gray-500"
            onClick={() => { setBlockFilter(""); setLevelFilter(""); }}
          >
            Reset filters
          </button>
        )}
      </div>

      <div className="flex w-full max-w-4xl gap-6">
        {/* Exercise List */}
        <div className="w-1/3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle>Exercise List</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exercises..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="absolute right-2 top-2.5" onClick={() => setSearchTerm("")}>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-1">
                  {filteredExercises.map((exercise) => (
                    <Button
                      key={exercise.id}
                      variant={selectedExerciseId === exercise.id ? "default" : "ghost"}
                      className={`w-full justify-start text-left ${exercise.hidden ? "opacity-50" : ""}`}
                      onClick={() => setSelectedExerciseId(exercise.id)}
                    >
                      {exercise.title_en}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="w-2/3">
          {editedExercise ? (
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Edit Exercise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Title</h3>
                  <Input
                    value={editedExercise.title_en}
                    onChange={(e) => handleInputChange("title_en", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Description</h3>
                  <Textarea
                    value={editedExercise.description_en}
                    onChange={(e) => handleInputChange("description_en", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">YouTube URL (optional)</h3>
                  <Input
                    value={editedExercise.youtube_url || ""}
                    onChange={(e) => handleInputChange("youtube_url", e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Video URL (optional)</h3>
                  <Input
                    value={editedExercise.video || ""}
                    onChange={(e) => handleInputChange("video", e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Block</h3>
                    {!showCustomBlock ? (
                      <Select
                        value={editedExercise.block}
                        onValueChange={(value) => {
                          if (value === "_custom_") {
                            setShowCustomBlock(true)
                          } else {
                            handleInputChange("block", value)
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select block" />
                        </SelectTrigger>
                        <SelectContent>
                          {allBlocks.map((block) => (
                            <SelectItem key={block} value={block}>
                              {block}
                            </SelectItem>
                          ))}
                          <SelectItem value="_custom_">+ Create new block</SelectItem>
                        </SelectContent>
                      </Select>
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
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Level</h3>
                    {!showCustomLevel ? (
                      <Select
                        value={editedExercise.level}
                        onValueChange={(value) => {
                          if (value === "_custom_") {
                            setShowCustomLevel(true)
                          } else {
                            handleInputChange("level", value)
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {allLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                          <SelectItem value="_custom_">+ Create new level</SelectItem>
                        </SelectContent>
                      </Select>
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

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editedExercise.hidden}
                    onCheckedChange={(checked) => handleInputChange("hidden", checked)}
                    id="hidden"
                  />
                  <label htmlFor="hidden" className="text-sm font-medium">
                    Hide from flashcards
                  </label>
                </div>

                <div className="flex justify-between pt-4">
                  <Button onClick={saveChanges} variant="default">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>

                  <Button onClick={deleteExercise} variant="destructive" disabled={exercises.length <= 1}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <p>Select an exercise to edit</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
