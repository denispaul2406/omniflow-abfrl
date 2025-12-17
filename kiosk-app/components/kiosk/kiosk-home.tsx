"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { QrCode, ArrowRight, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useKiosk } from "@/lib/kiosk-context"
import { ABFRLLogo } from "@/components/kiosk/abfrl-logo"

// Dynamically import QRCode with SSR disabled for Next.js compatibility
const QRCodeComponent = dynamic(() => import("react-qr-code"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <QrCode className="w-32 h-32 text-muted-foreground animate-pulse" />
    </div>
  ),
})

export function KioskHome() {
  const { handleScanComplete, kioskSessionId } = useKiosk()
  const [sessionInput, setSessionInput] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleStartScanning = () => {
    setIsScanning(true)
    // Simulate QR scan after 2 seconds
    setTimeout(() => {
      handleScanComplete("abc123")
    }, 2000)
  }

  const handleManualEntry = () => {
    if (sessionInput.trim()) {
      handleScanComplete(sessionInput.trim())
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background">
      {/* Logo */}
      <div className="mb-3 flex-shrink-0">
        <ABFRLLogo size={60} />
      </div>

      {/* Welcome Text */}
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2 text-center flex-shrink-0">
        Welcome to OmniFlow Kiosk 👋
      </h1>
      <p className="text-base md:text-lg text-muted-foreground mb-4 text-center flex-shrink-0">Continue your shopping journey seamlessly</p>

      {/* QR Scan Card */}
      <Card className="p-6 max-w-2xl w-full shadow-soft hover:shadow-medium transition-all duration-300 mb-4 flex-shrink-0">
        <div className="flex flex-col items-center text-center">
          {/* QR Code Display */}
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-white p-3 flex items-center justify-center mb-4 shadow-lg">
            {isMounted && kioskSessionId ? (
              <QRCodeComponent
                value={kioskSessionId}
                size={200}
                level="H"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <QrCode className="w-24 h-24 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Loading QR Code...</p>
              </div>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-2">Scan This QR Code with Your Mobile App</h2>

          <p className="text-sm md:text-base text-muted-foreground mb-3 max-w-lg">
            Open your ABFRL app → Tap "Try in Store" → Scan this QR code to sync your cart
          </p>
          
          {isMounted && kioskSessionId && (
            <div className="bg-primary/5 border border-primary/20 p-2 rounded-lg mb-3">
              <p className="text-xs text-muted-foreground mb-1">Kiosk Session ID:</p>
              <p className="text-xs font-mono font-semibold text-primary" suppressHydrationWarning>{kioskSessionId}</p>
            </div>
          )}

          <Button
            size="lg"
            className="h-12 px-8 text-base font-semibold animate-pulse-gentle"
            onClick={handleStartScanning}
            disabled={isScanning}
            suppressHydrationWarning
          >
            {isScanning ? "Scanning..." : "Start Scanning"}
          </Button>
        </div>
      </Card>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-3 w-full max-w-2xl flex-shrink-0">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground font-medium">OR</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Manual Entry */}
      <Card className="p-4 max-w-2xl w-full shadow-soft flex-shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm md:text-base text-muted-foreground whitespace-nowrap">Enter Session ID:</span>
          <Input
            value={sessionInput}
            onChange={(e) => setSessionInput(e.target.value)}
            placeholder="e.g., abc123"
            className="h-11 md:h-12 text-sm md:text-base font-mono flex-1 min-w-[150px]"
            suppressHydrationWarning
          />
          <Button
            variant="outline"
            size="lg"
            className="h-11 md:h-12 px-6 text-sm md:text-base bg-transparent"
            onClick={handleManualEntry}
            disabled={!sessionInput.trim()}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Help Link */}
      <button className="mt-3 text-primary hover:underline flex items-center gap-2 text-sm md:text-base flex-shrink-0" suppressHydrationWarning>
        <HelpCircle className="h-4 w-4" />
        Why use our kiosk?
      </button>
    </div>
  )
}
