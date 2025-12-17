"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KioskHeader } from "@/components/kiosk/kiosk-header"
import { useKiosk } from "@/lib/kiosk-context"
import { supabase } from "@/lib/supabase/client"
import type { Tables } from "@/lib/supabase/types"
import Image from "next/image"

// Helper functions for gender filtering
const getUserGender = (userName: string): 'male' | 'female' | null => {
  const name = userName.toLowerCase();
  const femaleNames = ['priya', 'priyanka', 'sneha', 'kavya', 'ananya', 'meera', 'divya', 'neha', 'shreya'];
  const maleNames = ['aarav', 'rohan', 'rahul', 'arjun', 'vikram', 'aditya', 'siddharth', 'karan'];
  if (femaleNames.some(n => name.includes(n))) return 'female';
  if (maleNames.some(n => name.includes(n))) return 'male';
  return null;
};

const filterProductsByGender = (products: Tables<"products">[], gender: 'male' | 'female' | null): Tables<"products">[] => {
  if (!gender) return products;
  return products.filter(p => {
    const imageUrl = p.image_url || '';
    if (gender === 'male') {
      return imageUrl.includes('/men/') || imageUrl.includes('/data/men/');
    } else if (gender === 'female') {
      return imageUrl.includes('/women/') || imageUrl.includes('/data/women/');
    }
    return true;
  });
};

interface BrandGroup {
  brand: string
  products: Tables<"products">[]
}

export function BrowseStore() {
  const { setCurrentScreen, handleFindProduct, userSession } = useKiosk()
  const [brands, setBrands] = useState<BrandGroup[]>([])

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("brand", { ascending: true })

      if (error) {
        console.error("Error loading products for browse view:", error)
        return
      }
      if (!data) return

      // Filter by user gender
      const userGender = userSession ? getUserGender(userSession.userName) : null
      let filteredData = filterProductsByGender(data, userGender)

      const groups: Record<string, Tables<"products">[]> = {}
      for (const p of filteredData) {
        const brand = p.brand || "ABFRL"
        if (!groups[brand]) groups[brand] = []
        groups[brand].push(p)
      }

      const grouped: BrandGroup[] = Object.entries(groups).map(([brand, products]) => ({
        brand,
        products,
      }))

      setBrands(grouped)
    }

    loadProducts()
  }, [userSession])

  const handleSelectProduct = (product: Tables<"products">) => {
    // Map product into a temporary CartItem shape to reuse handleFindProduct flow
    handleFindProduct({
      id: product.id,
      productId: product.id,
      name: product.name,
      size: (product.size && product.size[0]) || "M",
      price: product.price,
      quantity: 1,
      image: product.image_url || "/placeholder.jpg",
      inStock: (product.stock_count || 0) > 0,
      location: product.aisle ? `Aisle ${product.aisle}` : null,
    })
  }

  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden">
      <KioskHeader />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-10 pt-6 pb-4">
          <div>
            <h2 className="text-4xl font-heading font-bold text-foreground mb-1">Browse Store</h2>
            <p className="text-muted-foreground text-lg">
              Explore ABFRL brands and pick what you want to try in-store.
            </p>
          </div>
          <Button variant="outline" className="h-11 px-6" onClick={() => setCurrentScreen("welcome")}>
            Back to actions
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-8">
          {brands.map((group) => (
            <section key={group.brand} className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-heading font-bold text-foreground">{group.brand}</h3>
                <span className="text-sm text-muted-foreground">
                  {group.products.length} styles
                </span>
              </div>

              <div className="grid grid-cols-3 gap-5">
                {group.products.map((product) => (
                  <Card
                    key={product.id}
                    className="p-4 cursor-pointer hover:shadow-medium hover:-translate-y-1 transition-all duration-200 flex flex-col"
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="aspect-[4/5] w-full rounded-xl overflow-hidden bg-muted mb-3">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={500}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <p className="font-semibold text-foreground line-clamp-2 mb-1">
                        {product.name}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.product_type || "Fashion"}
                      </p>
                      <div className="flex items-baseline justify-between mt-auto">
                        <span className="text-lg font-bold text-foreground">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.discount_percent && product.discount_percent > 0 && (
                          <span className="text-xs font-semibold text-success">
                            {product.discount_percent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}


