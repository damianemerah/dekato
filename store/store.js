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
  userIsLoading: false,
  setUserIsLoading: (userIsLoading) => set({ userIsLoading }),
}));

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      setCart: (cart) => set({ cart, isFetched: true }),
      cartIsLoading: false,
      setCartIsLoading: (cartIsLoading) => set({ cartIsLoading }),
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

export const useCategoryStore = create(
  persist(
    (set) => ({
      selectedCategory: "women",
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    {
      name: "selected-category",
    },
  ),
);

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
