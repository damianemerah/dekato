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
      setCart: (cart) => set({ cart, isFetched: true }),
    }),
    {
      name: "cart-storage",
    },
  ),
);

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export const useCategoryStore = create((set) => ({
  categories: [],

  setCategory: (categories) => set({ categories }),
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
}));

export const useSidebarStore = create(
  persist(
    (set) => ({
      isSidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      closeSidebar: () => set({ isSidebarOpen: false }),
      openSidebar: () => set({ isSidebarOpen: true }),
    }),
    {
      name: "sidebar-storage",
    },
  ),
);

export const useSearchStore = create((set) => ({
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),

  activeDropdown: false,
  setActiveDropdown: (activeDropdown) => set({ activeDropdown }),
}));
