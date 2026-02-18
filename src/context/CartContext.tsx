"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils'; 

type CartItem = {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  stock: number;
  image_url: string | null;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  formatPrice: (price: number) => string; 
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = sessionStorage.getItem('operix_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    sessionStorage.setItem('operix_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      const currentQty = exists ? exists.quantite : 0;
      const modif = product.quantite || 1;
      const newQty = currentQty + modif;

      
      if (modif > 0 && newQty > product.stock) {
        alert(`Désolé, seulement ${product.stock} unités disponibles.`);
        return prev;
      }

      if (exists) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantite: newQty } : item
        );
      }
      return [...prev, { ...product, quantite: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem('operix_cart');
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantite, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, formatPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};