import { useState, useEffect } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  category: string;
  quantity: number;
}

const STORAGE_KEY = "tacticmind_cart";

function parsePrice(price: string): number {
  return parseInt(price.replace(/\D/g, ""), 10) || 0;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.priceNum * i.quantity, 0);

  const addItem = (product: { id: number; name: string; price: string; image: string; category: string }) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, priceNum: parsePrice(product.price), quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const changeQty = (id: number, delta: number) => {
    setItems(prev =>
      prev
        .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
        .filter(i => i.quantity > 0)
    );
  };

  const clear = () => setItems([]);

  return { items, totalCount, totalPrice, addItem, removeItem, changeQty, clear };
}
