"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, X } from "lucide-react"

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show the install prompt
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowPrompt(false)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt")
      } else {
        console.log("User dismissed the install prompt")
      }
      // Clear the saved prompt
      setDeferredPrompt(null)
      // Hide the install button
      setShowPrompt(false)
    })
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-black/80 border border-white/10 p-4 shadow-lg max-w-xs">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-white">Install AI Prophet</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-white/10"
            onClick={() => setShowPrompt(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-white/70 mb-3">
          Install AI Prophet on your device for a better experience and faster access.
        </p>
        <Button
          className="w-full bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:from-[#00b86b] hover:to-[#2bc0b8]"
          onClick={handleInstallClick}
        >
          <Download className="h-4 w-4 mr-2" />
          Install App
        </Button>
      </Card>
    </div>
  )
}

