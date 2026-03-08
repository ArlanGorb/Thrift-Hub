'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Product } from '@/lib/types';
import toast from 'react-hot-toast';

interface WishlistContextValue {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const WISHLIST_KEY = 'thrift_hub_wishlist';

function loadWishlist(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>(loadWishlist);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        toast('Sudah ada di favorit', { icon: '❤️' });
        return prev;
      }
      toast.success('Ditambahkan ke favorit!');
      return [...prev, product];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
    toast.success('Dihapus dari favorit');
  }, []);

  const toggleItem = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        toast.success('Dihapus dari favorit');
        return prev.filter((p) => p.id !== product.id);
      }
      toast.success('Ditambahkan ke favorit!');
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.some((p) => p.id === productId),
    [items]
  );

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, toggleItem, isInWishlist, itemCount: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
