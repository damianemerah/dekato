import create from "zustand";

const useStore = create((set) => ({
  // State for the save bar
  isSaveBarActive: false,
  // State for the loading indicator
  isLoading: false,
  // State for the active page
  activePage: "admin",

  // Setters for the state
  setIsSaveBarActive: (value) => set({ isSaveBarActive: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  setActivePage: (value) => set({ activePage: value }),
}));

export default useStore;
