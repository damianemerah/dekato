import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      isFetched: false,
      setCart: (cart) => set({ cart, isFetched: true }),
      addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "cart-storage",
    },
  ),
);

export const useProductsStore = create((set) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  // other product-related actions
}));

export const useProductStore = create(
  (set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    addProduct: (product) =>
      set((state) => ({ products: [...state.products, product] })),
    removeProduct: (id) =>
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      })),
    updateProduct: (updatedProduct) =>
      set((state) => ({
        products: state.products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product,
        ),
      })),
  }),
  {
    name: "product-storage",
  },
);
