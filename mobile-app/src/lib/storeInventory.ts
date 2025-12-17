export interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone?: string;
}

export interface StoreInventory {
  storeId: string;
  storeName: string;
  address: string;
  distance: string;
  products: {
    productId: string;
    size: string;
    stock: number;
  }[];
}

// Static Bangalore stores data
export const BANGALORE_STORES: Store[] = [
  {
    id: '1',
    name: 'Forum Mall',
    address: 'Koramangala, Bangalore',
    distance: '3 km',
    phone: '+91 80 1234 5678'
  },
  {
    id: '2',
    name: 'Indiranagar',
    address: '100 Feet Road, Indiranagar',
    distance: '7 km',
    phone: '+91 80 1234 5679'
  },
  {
    id: '3',
    name: 'DLF Promenade',
    address: 'Whitefield, Bangalore',
    distance: '10 km',
    phone: '+91 80 1234 5680'
  },
  {
    id: '4',
    name: 'Saket Mall',
    address: 'Bannerghatta Road, Bangalore',
    distance: '15 km',
    phone: '+91 80 1234 5681'
  },
  {
    id: '5',
    name: 'Select Citywalk',
    address: 'MG Road, Bangalore',
    distance: '5 km',
    phone: '+91 80 1234 5682'
  }
];

/**
 * Check store inventory for a product
 * In real app, this would query Supabase or inventory API
 */
export const checkStoreInventory = async (
  productId: string,
  size: string
): Promise<StoreInventory[]> => {
  // Mock data for demo - in real app, this would query Supabase
  return [
    {
      storeId: '1',
      storeName: 'Forum Mall',
      address: 'Koramangala',
      distance: '3 km',
      products: [{ productId, size, stock: 2 }]
    },
    {
      storeId: '2',
      storeName: 'Indiranagar',
      address: '100 Feet Road',
      distance: '7 km',
      products: [{ productId, size, stock: 5 }]
    },
    {
      storeId: '3',
      storeName: 'DLF Promenade',
      address: 'Whitefield',
      distance: '10 km',
      products: [{ productId, size, stock: 0 }] // Out of stock
    },
    {
      storeId: '4',
      storeName: 'Saket Mall',
      address: 'Bannerghatta Road',
      distance: '15 km',
      products: [{ productId, size, stock: 1 }]
    },
    {
      storeId: '5',
      storeName: 'Select Citywalk',
      address: 'MG Road',
      distance: '5 km',
      products: [{ productId, size, stock: 3 }]
    }
  ];
};

/**
 * Get stores with stock for a product
 */
export const getStoresWithStock = async (
  productId: string,
  size: string
): Promise<StoreInventory[]> => {
  const inventory = await checkStoreInventory(productId, size);
  return inventory.filter(store => 
    store.products.some(p => p.productId === productId && p.stock > 0)
  );
};

