
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  image_url: string | null;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Charger le panier au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('operix_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Sauvegarder à chaque modification
  useEffect(() => {
    localStorage.setItem('operix_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantite: item.quantite + 1 } : item
        );
      }
      return [...prev, { ...product, quantite: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantite, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};