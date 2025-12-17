"use client"

import { Circle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useKiosk } from "@/lib/kiosk-context"
import { ABFRLLogo } from "@/components/kiosk/abfrl-logo"

export function KioskHeader() {
  const { userSession, idleTimeRemaining, handleReturnHome } = useKiosk()

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-background">
      <ABFRLLogo size={50} />

      <div className="flex items-center gap-6">
        {/* Session Sync Indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Circle className="h-3 w-3 fill-success text-success animate-pulse" />
          Session synced
        </div>

        {/* User Info */}
        {userSession && (
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full shadow-soft">
            <span className="text-sm font-medium">{userSession.userName}</span>
            {userSession.loyaltyTier === 'Gold' && (
              <span className="px-2 py-0.5 text-white text-xs font-semibold rounded-full" style={{ backgroundColor: 'hsl(var(--loyalty-gold))' }}>✨ GOLD</span>
            )}
            {userSession.loyaltyTier === 'Silver' && (
              <span className="px-2 py-0.5 text-white text-xs font-semibold rounded-full" style={{ backgroundColor: 'hsl(var(--loyalty-silver))' }}>SILVER</span>
            )}
          </div>
        )}

        {/* Timeout Indicator */}
        <div className="text-sm text-muted-foreground">Auto-logout in {idleTimeRemaining}</div>

        {/* Home Button */}
        <Button variant="outline" size="sm" onClick={handleReturnHome}>
          <Home className="h-4 w-4 mr-2" />
          Exit
        </Button>
      </div>
    </header>
  )
}
