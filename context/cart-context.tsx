"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { LocalCart, LocalCartItem } from "@/lib/types";

const CART_KEY = "shaw_safety_cart";

const EMPTY_CART: LocalCart = {
  items: [],
  totalQuantity: 0,
  cost: {
    subtotalAmount: { amount: "0.00", currencyCode: "USD" },
    totalAmount: { amount: "0.00", currencyCode: "USD" },
  },
};

function computeCart(items: LocalCartItem[]): LocalCart {
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + parseFloat(i.price.amount) * i.quantity,
    0
  );
  const currency = items[0]?.price.currencyCode ?? "USD";
  const amount = subtotal.toFixed(2);
  return {
    items,
    totalQuantity,
    cost: {
      subtotalAmount: { amount, currencyCode: currency },
      totalAmount: { amount, currencyCode: currency },
    },
  };
}

type AddItemInput = Omit<LocalCartItem, "quantity"> & { quantity?: number };

type CartContextValue = {
  cart: LocalCart;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (input: AddItemInput) => void;
  updateItem: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<LocalCart>(EMPTY_CART);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setCart(JSON.parse(stored) as LocalCart);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((input: AddItemInput) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.variantId === input.variantId);
      const items: LocalCartItem[] = existing
        ? prev.items.map((i) =>
            i.variantId === input.variantId
              ? { ...i, quantity: i.quantity + (input.quantity ?? 1) }
              : i
          )
        : [...prev.items, { ...input, quantity: input.quantity ?? 1 }];
      return computeCart(items);
    });
  }, []);

  const updateItem = useCallback((variantId: string, quantity: number) => {
    setCart((prev) => {
      const items =
        quantity <= 0
          ? prev.items.filter((i) => i.variantId !== variantId)
          : prev.items.map((i) =>
              i.variantId === variantId ? { ...i, quantity } : i
            );
      return computeCart(items);
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setCart((prev) => computeCart(prev.items.filter((i) => i.variantId !== variantId)));
  }, []);

  return (
    <CartContext value={{ cart, isOpen, openCart, closeCart, addItem, updateItem, removeItem }}>
      {children}
    </CartContext>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
