import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Size } from '@/types';
import { generateCartItemId } from '@/lib/utils';

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const id = generateCartItemId(item.productId, item.size, item.color);
        const existingItem = get().items.find(i => i.id === id);

        if (existingItem) {
          set((state) => ({
            items: state.items.map(i =>
              i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, id }],
          }));
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'veilvogue-cart',
    }
  )
);
