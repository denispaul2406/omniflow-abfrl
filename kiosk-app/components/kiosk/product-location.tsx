"use client"

import { MapPin, Navigation, Phone, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useKiosk } from "@/lib/kiosk-context"
import { KioskHeader } from "@/components/kiosk/kiosk-header"
import Image from "next/image"

export function ProductLocation() {
  const { selectedProduct, setCurrentScreen, handleFindProduct, cartItems } = useKiosk()

  const availableSizes = ["38 slim", "40 regular", "42 slim"]
  
  // Extract aisle number from product location (e.g., "Aisle 3, Right" -> 3)
  const getAisleNumber = (location: string | null): number => {
    if (!location) return 3 // Default
    const match = location.match(/Aisle (\d+)/i)
    return match ? parseInt(match[1]) : 3
  }
  
  const productAisle = selectedProduct ? getAisleNumber(selectedProduct.location) : 3

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="w-[30%] bg-muted p-8 flex flex-col">
        <Button variant="ghost" className="self-start mb-6 text-lg" onClick={() => setCurrentScreen("welcome")}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>

        <h2 className="text-2xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
          <MapPin className="h-7 w-7 text-primary" />
          FINDING YOUR ITEMS
        </h2>

        {selectedProduct && (
          <Card className="p-6 mb-6">
            <div className="flex gap-4 mb-4">
              <Image
                src={selectedProduct.image || "/placeholder.svg"}
                alt={selectedProduct.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-foreground">{selectedProduct.name}</h3>
                <p className="text-muted-foreground">Size {selectedProduct.size}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-lg text-success font-semibold mb-4">
              <CheckCircle className="h-6 w-6" />
              In Stock Here
            </div>

            <div className="flex items-center gap-2 text-primary text-lg">
              <MapPin className="h-5 w-5" />
              Location: {selectedProduct.location}
            </div>

            <Button className="w-full mt-6 h-12 text-base">See on Map →</Button>
          </Card>
        )}

        <div className="h-px bg-border my-6" />

        <div>
          <p className="text-muted-foreground mb-4">Need a different size?</p>
          <p className="font-semibold text-foreground mb-3">Available sizes nearby:</p>
          <ul className="space-y-2">
            {availableSizes.map((size, index) => {
              // Randomize aisle for different sizes (but keep it consistent per size)
              const sizeAisle = productAisle + (index % 3) // Vary between product aisle and nearby
              return (
                <li key={size} className="text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {size} (Aisle {sizeAisle})
                </li>
              )
            })}
          </ul>

          <Button variant="outline" className="w-full mt-6 h-12 bg-transparent">
            Check Other Sizes
          </Button>
        </div>

        <div className="mt-auto">
          <p className="text-sm text-muted-foreground mb-4">Other items in cart:</p>
          <div className="space-y-2">
            {cartItems
              .filter((item) => item.id !== selectedProduct?.id)
              .map((item) => (
                <Card
                  key={item.id}
                  className="p-3 flex items-center gap-3 cursor-pointer hover:bg-background/80 shadow-soft"
                  onClick={() => handleFindProduct(item)}
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.inStock ? item.location : "Out of stock"}</p>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </aside>

      {/* Right Content - Store Map */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <KioskHeader />

        <div className="flex-1 p-10 overflow-y-auto">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-6">STORE MAP</h2>

          {/* Interactive Map */}
          <Card className="p-8 mb-6 bg-background shadow-soft">
            <div className="grid grid-cols-6 gap-4">
              {/* Row 1 */}
              <div className="col-span-1 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-primary animate-pulse mb-2" />
                  <span className="text-sm font-semibold text-primary">YOU</span>
                </div>
              </div>
              {[1, 2, 3].map((aisle) => {
                const isProductAisle = aisle === productAisle
                return (
                  <div
                    key={aisle}
                    className={`col-span-1 h-32 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                      isProductAisle ? "border-primary bg-primary/10 shadow-lg" : "border-border bg-muted"
                    }`}
                  >
                    <span className="text-lg font-semibold">Aisle {aisle}</span>
                    {isProductAisle && (
                      <div className="mt-2 flex items-center gap-1 text-primary">
                        <MapPin className="h-5 w-5 animate-bounce" />
                        <span className="text-sm font-bold">HERE</span>
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="col-span-2" />

              {/* Animated Path */}
              <div className="col-span-6 h-8 flex items-center justify-center">
                <div className="w-1/2 border-t-2 border-dashed border-primary animate-pulse" />
              </div>

              {/* Row 2 */}
              <div className="col-span-1" />
              {[4, 5, 6].map((aisle) => {
                const isProductAisle = aisle === productAisle
                return (
                  <div
                    key={aisle}
                    className={`col-span-1 h-32 rounded-xl border-2 flex items-center justify-center ${
                      isProductAisle ? "border-primary bg-primary/10 shadow-lg" : "border-border bg-muted"
                    }`}
                  >
                    <span className="text-lg font-semibold">Aisle {aisle}</span>
                    {isProductAisle && (
                      <div className="absolute mt-12 flex items-center gap-1 text-primary">
                        <MapPin className="h-5 w-5 animate-bounce" />
                        <span className="text-sm font-bold">HERE</span>
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="col-span-2 flex items-center justify-center">
                <Card className="px-8 py-4 bg-secondary text-secondary-foreground font-bold text-lg shadow-soft">CHECKOUT →</Card>
              </div>
            </div>
          </Card>

          <p className="text-lg text-muted-foreground mb-8">Walking distance: ~15 meters</p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button size="lg" className="h-16 px-10 text-xl">
              <Navigation className="mr-2 h-6 w-6" />
              Get Directions
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-10 text-xl bg-transparent">
              <Phone className="mr-2 h-6 w-6" />
              Call Store Associate
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
