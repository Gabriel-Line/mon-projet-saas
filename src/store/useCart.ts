
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCart = create()(
  persist(
    (set, get: any) => ({
      items: [],
      addItem: (newItem: any) => {
        const items = get().items;
        const exists = items.find((i: any) => i.id === newItem.id);
        if (exists) {
          set({ items: items.map((i: any) => i.id === newItem.id ? { ...i, quantite: i.quantite + 1 } : i) });
        } else {
          set({ items: [...items, { ...newItem, quantite: 1 }] });
        }
      },
    }),
    { name: 'operix-storage' }
  )
);