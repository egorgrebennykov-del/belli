import React, { createContext, use, useMemo, useState } from 'react';
import { BoutiqueProduct } from '@/services/nhost';

export interface BagEntry {
  product: BoutiqueProduct;
  size: string;
  quantity: number;
}

interface BagContextValue {
  bag: BagEntry[];
  favoriteIds: string[];
  bagCount: number;
  bagSubtotal: number;
  addToBag: (product: BoutiqueProduct, size: string) => void;
  updateBagQuantity: (productId: string, size: string, delta: number) => void;
  clearBag: () => void;
  toggleFavorite: (id: string) => void;
}

const BagContext = createContext<BagContextValue | null>(null);

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [bag, setBag] = useState<BagEntry[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const addToBag = (product: BoutiqueProduct, size: string) => {
    setBag((prev) => {
      const existing = prev.find(
        (entry) => entry.product.id === product.id && entry.size === size
      );
      if (existing) {
        return prev.map((entry) =>
          entry.product.id === product.id && entry.size === size
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
  };

  const updateBagQuantity = (productId: string, size: string, delta: number) => {
    setBag((prev) =>
      prev
        .map((entry) =>
          entry.product.id === productId && entry.size === size
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const clearBag = () => setBag([]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const bagCount = useMemo(
    () => bag.reduce((sum, item) => sum + item.quantity, 0),
    [bag]
  );

  const bagSubtotal = useMemo(
    () => bag.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [bag]
  );

  return (
    <BagContext
      value={{
        bag,
        favoriteIds,
        bagCount,
        bagSubtotal,
        addToBag,
        updateBagQuantity,
        clearBag,
        toggleFavorite,
      }}>
      {children}
    </BagContext>
  );
}

export function useBag(): BagContextValue {
  const ctx = use(BagContext);
  if (!ctx) {
    throw new Error('useBag must be used inside BagProvider');
  }
  return ctx;
}
