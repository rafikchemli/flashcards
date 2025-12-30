export interface Exercise {
  id: number
  title_en: string
  description_en: string
  title_fr: string
  description_fr: string
  block: string
  level: string
  hidden: boolean
  youtube_url?: string
  video?: string
  precautions?: string[]
  cues?: string[]
  objectives?: string[]
  setup?: string[]
  movement?: string[]
}

export type Language = "en" | "fr"

// Optionnel : pour usage dans les filtres UI
export type Block =
  | "Foundation"
  | "Abdominal Work"
  | "Spinal Articulation"
  | "Lateal/Flexion Rotation"
  | "Back Extension"
  | "Bridging/Full Body Intergration"
  | "Leg Work"
  | "Arm Work"

export type Level = "Fundamental" | "Intermediate" | "Advanced"
