"use client"

import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "fr" : "en")}
      className="fixed top-4 right-4"
    >
      {language === "en" ? "Français" : "English"}
    </Button>
  )
}
