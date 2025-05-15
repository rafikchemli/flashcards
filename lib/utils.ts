import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Exercise } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function getLocalExercises(): Exercise[] {
  if (typeof window === "undefined") return []

  const storedExercises = localStorage.getItem("exercises")
  if (storedExercises) {
    return JSON.parse(storedExercises)
  }
  return []
}

export function saveLocalExercises(exercises: Exercise[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("exercises", JSON.stringify(exercises))
}
