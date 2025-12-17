"use client"

import { useState, useMemo } from "react"
import { X, MapPin, Truck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface OutOfStockModalProps {
  product: {
    id: string
    name: string
    size: string
    price: number
    image: string
  }
  onClose: () => void
  onHomeDelivery: () => void
}

export function OutOfStockModal({ product, onClose, onHomeDelivery }: OutOfStockModalProps) {
  // Bangalore store names for Use Case 3 (Priya)
  const bangaloreStores = [
    { name: "Forum Mall", distance: "3 km", address: "Whitefield" },
    { name: "Indiranagar", distance: "5 km", address: "100 Feet Road" },
    { name: "DLF Promenade", distance: "7 km", address: "Whitefield Road" },
    { name: "Phoenix Mall", distance: "8 km", address: "Whitefield Main Road" }
  ];

  // Select a random Bangalore store once per session (using useMemo to persist)
  const randomStore = useMemo(() => {
    return bangaloreStores[Math.floor(Math.random() * bangaloreStores.length)];
  }, []); // Empty dependency array ensures it's only calculated once

  const options = [
    {
      icon: MapPin,
      title: `Visit ${randomStore.name} (${randomStore.distance})`,
      description: `Size ${product.size} in stock`,
      subtext: `We'll reserve it for 2 hours at ${randomStore.address}`,
      action: "Reserve & Get Directions",
      onClick: () => {
        // For demo: Just close modal
        onClose();
      }
    },
    {
      icon: Truck,
      title: "Home Delivery",
      description: `Size ${product.size} arrives tomorrow by 6 PM`,
      subtext: "Free delivery (Gold member perk)",
      action: "Ship to Home",
      onClick: onHomeDelivery,
      recommended: true,
    },
  ]

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-2xl shadow-soft max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
          <Card className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-heading font-bold text-foreground">
                Size Not Available
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Info */}
            <div className="flex items-start gap-6 mb-6">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={120}
                height={120}
                className="rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                  {product.name}
                </h3>
                <p className="text-lg text-muted-foreground mb-2">Size {product.size}</p>
                <p className="text-xl font-bold text-foreground">₹{product.price.toLocaleString()}</p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-full">
                  <span className="text-lg font-semibold text-destructive">
                    ⚠️ Your size is not available for this product at this store
                  </span>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-lg text-foreground">
                You can visit <span className="font-semibold">{randomStore.name}</span> ({randomStore.distance}) at {randomStore.address} or opt for home delivery.
              </p>
            </div>

            <p className="text-xl text-muted-foreground mb-6">We found 2 options for you:</p>

            {/* Options */}
            <div className="space-y-4 mb-6">
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
                  onClick={option.onClick}
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
                    >
                      {option.action}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <p className="text-center text-muted-foreground italic text-sm">All options sync with your mobile cart 🔄</p>
          </Card>
        </div>
      </div>
  )
}

