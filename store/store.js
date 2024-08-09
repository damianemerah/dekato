import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create((set) => ({
  user: null,
  address: [],
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setAddress: (address) => set({ address }),
  addAddress: (address) =>
    set((state) => ({ address: [...state.address, address] })),
  removeAddress: (id) =>
    set((state) => ({
      address: state.address.filter((address) => address.id !== id),
    })),
  updateAddress: (updatedAddress) =>
    set((state) => ({
      address: state.address.map((address) =>
        address.id === updatedAddress.id ? updatedAddress : address,
      ),
    })),
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

export const useCategoryStore = create(
  persist(
    (set) => ({
      categories: [],
      setCategories: (categories) => set({ categories }),
      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      removeCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        })),
      updateCategory: (updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category,
          ),
        })),
    }),
    {
      name: "category-storage",
    },
  ),
);

export const useSidebarStore = create((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
