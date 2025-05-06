import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const createPersistedStore = (initialState, name, partialize) =>
  create(
    persist((set) => initialState(set), {
      name,
      ...(partialize && { partialize }),
    })
  );

export const useUserStore = createPersistedStore(
  (set) => ({
    user: null,
    address: [],
    setUser: (user) => set({ user }),
    setAddress: (address) => set({ address }),
    deliveryMethod: 'pickup',
    setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),
  }),
  'user-storage',
  (state) => ({
    deliveryMethod: state.deliveryMethod,
    user: {
      id: state.user?.id,
      firstname: state.user?.firstname,
      lastname: state.user?.lastname,
      address: state.address,
      wishlist: state.user?.wishlist,
    },
  })
);

export const useSidebarStore = createPersistedStore(
  (set) => ({
    isSidebarOpen:
      typeof window !== 'undefined'
        ? window.innerWidth <= 1024
          ? JSON.parse(localStorage.getItem('isSidebarOpen')) || true
          : false
        : false,

    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    closeSidebar: () => set({ isSidebarOpen: false }),
    openSidebar: () => set({ isSidebarOpen: true }),
    lgScreenSidebar: true,
    setLgScreenSidebar: (lgScreenSidebar) => set({ lgScreenSidebar }),
    menuIsClicked: false,
    setMenuIsClicked: (menuIsClicked) => set({ menuIsClicked }),
    isMobile: false,
    setIsMobile: (isMobile) => set({ isMobile }),
  }),
  'sidebar-storage'
);

export const useRecommendMutateStore = create((set) => ({
  shouldMutate: false,
  setShouldMutate: (shouldMutate) => set({ shouldMutate }),
}));
