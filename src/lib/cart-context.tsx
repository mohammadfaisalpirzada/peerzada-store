'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  customDetails?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalAmount: number;
  addPendingItem: (item: Omit<CartItem, 'quantity'>) => void;
  checkPendingItem: () => void;
}

const STORAGE_KEY = 'peerzada_cart';
const PENDING_ITEM_KEY = 'peerzada_pending_cart_item';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItemInternal = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.customDetails === item.customDetails);
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId && i.customDetails === item.customDetails
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const checkPendingItemInternal = useCallback(() => {
    try {
      const stored = localStorage.getItem(PENDING_ITEM_KEY);
      if (stored) {
        const pending = JSON.parse(stored) as Omit<CartItem, 'quantity'>;
        localStorage.removeItem(PENDING_ITEM_KEY);
        addItemInternal(pending);
      }
    } catch {
      localStorage.removeItem(PENDING_ITEM_KEY);
    }
  }, [addItemInternal]);

  // Check for pending item on mount (after login redirect)
  useEffect(() => {
    if (hydrated) {
      checkPendingItemInternal();
    }
  }, [hydrated, checkPendingItemInternal]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    addItemInternal(item);
  }, [addItemInternal]);

  const addPendingItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    localStorage.setItem(PENDING_ITEM_KEY, JSON.stringify(item));
  }, []);

  const checkPendingItem = useCallback(() => {
    checkPendingItemInternal();
  }, [checkPendingItemInternal]);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev =>
      prev.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, totalAmount, addPendingItem, checkPendingItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
