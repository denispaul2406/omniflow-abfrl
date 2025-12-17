"use client"

import { useEffect, useState } from "react"
import { useKiosk } from "@/lib/kiosk-context"
import { ABFRLLogo } from "@/components/kiosk/abfrl-logo"

export function SessionLoading() {
  const { sessionId } = useKiosk()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 80)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 overflow-hidden">
      {/* Animated Logo */}
      <div className="mb-12 animate-pulse-gentle">
        <ABFRLLogo size={120} />
      </div>

      {/* Loading Text */}
      <h2 className="text-3xl text-muted-foreground mb-4">Loading your shopping session...</h2>

      {/* Session ID */}
      <p className="text-xl font-mono text-primary mb-10">Session ID: {sessionId}</p>

      {/* Progress Bar */}
      <div className="w-full max-w-md h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-4 text-muted-foreground">{progress}% complete</p>
    </div>
  )
}
