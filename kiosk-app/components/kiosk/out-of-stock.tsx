"use client"

import { ArrowLeft, Ruler, MapPin, Truck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useKiosk } from "@/lib/kiosk-context"
import { KioskHeader } from "@/components/kiosk/kiosk-header"
import Image from "next/image"

export function OutOfStock() {
  const { selectedProduct, setCurrentScreen, handleCheckout, userSession } = useKiosk()

  // Bangalore store names for Use Case 3 (Priya)
  const bangaloreStores = [
    { name: "Forum Mall", distance: "3 km", address: "Whitefield" },
    { name: "Indiranagar", distance: "5 km", address: "100 Feet Road" },
    { name: "DLF Promenade", distance: "7 km", address: "Whitefield Road" },
    { name: "Phoenix Mall", distance: "8 km", address: "Whitefield Main Road" }
  ];

  // Check if this is Priya's product (W White Floral Printed Round Neck Cotton Top)
  const isPriyasProduct = selectedProduct?.name.toLowerCase().includes('w white floral') || 
                          selectedProduct?.name.toLowerCase().includes('white floral printed round neck');
  
  // Select a random Bangalore store for Priya's product
  const randomStore = bangaloreStores[Math.floor(Math.random() * bangaloreStores.length)];

  const options = isPriyasProduct ? [
    {
      icon: Ruler,
      title: `OPTION 1: Try Size L Here`,
      description: "Available now in-store (Aisle 5)",
      subtext: "Might be slightly loose",
      action: "Try This Size",
      recommended: false,
    },
    {
      icon: MapPin,
      title: `OPTION 2: Visit ${randomStore.name} (${randomStore.distance})`,
      description: `Size ${selectedProduct?.size || 'M'} in stock`,
      subtext: `We'll reserve it for 2 hours at ${randomStore.address}`,
      action: "Reserve & Get Directions",
      recommended: false,
    },
    {
      icon: Truck,
      title: "OPTION 3: Home Delivery",
      description: `Size ${selectedProduct?.size || 'M'} arrives tomorrow by 6 PM`,
      subtext: "Free delivery (Gold member perk)",
      action: "Ship to Home",
      recommended: true,
    },
  ] : [
    {
      icon: Ruler,
      title: "OPTION 1: Try Size L Here",
      description: "Available now in-store (Aisle 5)",
      subtext: "Might be slightly loose",
      action: "Try This Size",
      recommended: false,
    },
    {
      icon: MapPin,
      title: "OPTION 2: Visit DLF Promenade (10 km)",
      description: "Size M in stock",
      subtext: "We'll reserve it for 2 hours",
      action: "Reserve & Get Directions",
      recommended: false,
    },
    {
      icon: Truck,
      title: "OPTION 3: Home Delivery",
      description: "Size M arrives tomorrow by 6 PM",
      subtext: "Free delivery (Gold member perk)",
      action: "Ship to Home",
      recommended: true,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <KioskHeader />

      <main className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-4xl w-full p-10 shadow-soft">
          {/* Header */}
          <Button variant="ghost" className="mb-6 text-lg" onClick={() => setCurrentScreen("welcome")}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>

          <div className="flex items-start gap-6 mb-6">
            {selectedProduct && (
              <Image
                src={selectedProduct.image || "/placeholder.svg"}
                alt={selectedProduct.name}
                width={100}
                height={100}
                className="rounded-xl object-cover"
              />
            )}
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                {selectedProduct?.name} (Size {selectedProduct?.size})
              </h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
                <span className="text-xl font-semibold text-secondary-foreground">
                  {isPriyasProduct 
                    ? `⚠️ Your size is not available for this product at this store`
                    : `⚠️ Out of Stock at This Location`}
                </span>
              </div>
            </div>
          </div>

          {isPriyasProduct && (
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-lg text-foreground">
                You can visit <span className="font-semibold">{randomStore.name}</span> ({randomStore.distance}) at {randomStore.address} or opt for home delivery.
              </p>
            </div>
          )}

          <p className="text-xl text-muted-foreground mb-8">We found 3 options for you:</p>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {options.map((option) => (
              <Card
                key={option.title}
                className={`p-6 border-2 transition-all hover:shadow-md cursor-pointer ${
                  option.recommended ? "" : "border-border hover:border-primary/30"
                }`}
                style={option.recommended ? { 
                  borderColor: 'hsl(var(--loyalty-gold))', 
                  backgroundColor: 'hsl(var(--loyalty-gold) / 0.05)' 
                } : undefined}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-soft ${
                      option.recommended ? "text-white" : "bg-muted"
                    }`}
                    style={option.recommended ? { backgroundColor: 'hsl(var(--loyalty-gold))' } : undefined}
                  >
                    <option.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-semibold text-foreground">{option.title}</h3>
                      {option.recommended && (
                        <span className="px-3 py-1 text-white text-sm font-semibold rounded-full flex items-center gap-1" style={{ backgroundColor: 'hsl(var(--loyalty-gold))' }}>
                          <Star className="h-4 w-4" />
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-foreground mb-1">{option.description}</p>
                    <p className="text-muted-foreground">{option.subtext}</p>
                  </div>
                  <Button
                    size="lg"
                    className={`h-14 px-8 text-lg ${option.recommended ? "hover:opacity-90" : ""}`}
                    style={option.recommended ? { backgroundColor: 'hsl(var(--loyalty-gold))', color: 'white' } : undefined}
                    onClick={() => {
                      if (option.title.includes("Home Delivery")) {
                        handleCheckout()
                      }
                    }}
                  >
                    {option.action}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-center text-muted-foreground italic">All options sync with your mobile cart 🔄</p>
        </Card>
      </main>
    </div>
  )
}

