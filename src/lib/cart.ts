'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
    items: CartItem[];
    isOpen: boolean;

    // Actions
    addItem: (product: Product, quantity?: number, weightOption?: string) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;

    // Computed
    getSubtotal: () => number;
    getTotalItems: () => number;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product, quantity = 1, weightOption) => {
                const items = get().items;
                const existingIndex = items.findIndex(
                    (item) => item.product.id === product.id && item.weight_option === weightOption
                );

                if (existingIndex > -1) {
                    const newItems = [...items];
                    newItems[existingIndex].quantity += quantity;
                    set({ items: newItems });
                } else {
                    set({
                        items: [
                            ...items,
                            {
                                product,
                                quantity,
                                weight_option: weightOption,
                                unit_price: product.price,
                            },
                        ],
                    });
                }
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter((item) => item.product.id !== productId),
                });
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.product.id === productId ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            toggleCart: () => set({ isOpen: !get().isOpen }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            getSubtotal: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.unit_price * item.quantity,
                    0
                );
            },

            getTotalItems: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },
        }),
        {
            name: 'laxmi-farms-cart',
            partialize: (state) => ({ items: state.items }),
        }
    )
);
