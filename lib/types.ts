export interface Exercise {
  id: number
  title_en: string
  description_en: string
  title_fr: string
  description_fr: string
  hidden: boolean
}

export type Language = "en" | "fr"
