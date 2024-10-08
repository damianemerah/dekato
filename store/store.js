import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      address: [],
      setUser: (user) => set({ user }),
      setAddress: (address) => set({ address }),
      deliveryMethod: "pickup",
      setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        deliveryMethod: state.deliveryMethod,
        user: {
          id: state.user?.id,
          firstname: state.user?.firstname,
          lastname: state.user?.lastname,
          address: state.address,
          wishlist: state.user?.wishlist,
        },
      }),
    },
  ),
);

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      setCart: (cart) => set({ cart }),
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
      lgScreenSidebar: true,
      setLgScreenSidebar: (lgScreenSidebar) => set({ lgScreenSidebar }),
      menuIsClicked: false,
      setMenuIsClicked: (menuIsClicked) => set({ menuIsClicked }),
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
