import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Pilates Instructor Exam Flashcards</h1>
      <p className="text-lg text-center mb-12 max-w-md text-gray-600">
        Study all 34 exercises with this minimalist flashcard application.
      </p>
      <Link href="/flashcards">
        <Button size="lg" className="text-xl px-12 py-6 rounded-lg">
          Start
        </Button>
      </Link>
    </div>
  )
}
