'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { CartItem } from '@/lib/types';
import toast from 'react-hot-toast';

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = 'thrift_hub_cart';

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const isFirstRender = useRef(true);

  // Persist cart to localStorage whenever items change (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product_id === newItem.product_id && item.size === newItem.size
        );

        if (existingIndex >= 0) {
          const existing = prev[existingIndex];
          const updatedQty = Math.min(
            existing.quantity + (newItem.quantity ?? 1),
            existing.stock
          );
          if (updatedQty === existing.quantity) {
            toast.error('Maximum stock reached');
            return prev;
          }
          const updated = [...prev];
          updated[existingIndex] = { ...existing, quantity: updatedQty };
          toast.success('Cart updated');
          return updated;
        }

        const item: CartItem = { ...newItem, quantity: newItem.quantity ?? 1 };
        toast.success('Added to cart!');
        return [...prev, item];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.product_id === productId && item.size === size))
    );
    toast.success('Item removed from cart');
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity < 1) return;
      setItems((prev) =>
        prev.map((item) => {
          if (item.product_id === productId && item.size === size) {
            const newQty = Math.min(quantity, item.stock);
            return { ...item, quantity: newQty };
          }
          return item;
        })
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
