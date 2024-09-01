import { create } from "zustand";

export const useAdminStore = create((set) => ({
  variants: [],
  setVariants: (variants) => set({ variants }),
  updateVariant: (variantId, newVariant) =>
    set((state) => {
      const updatedVariants = state.variants.map((variant) => {
        if (variant.id === variantId) {
          return { ...variant, ...newVariant };
        }
        return variant;
      });

      return {
        variants: updatedVariants,
      };
    }),

  addVariant: (variant) =>
    set((state) => ({ variants: [...state.variants, variant] })),

  removeVariant: (id) =>
    set((state) => ({
      variants: state.variants.filter((variant) => variant.id !== id),
    })),

  variantOptions: [],
  addVariantOptions: (option) =>
    set((state) => ({ variantOptions: [...state.variantOptions, option] })),
  setVariantOptions: (variantOptions) => set({ variantOptions }),

  curVariantOptions: [],
  setCurVariantOptions: (curVariantOptions) => set({ curVariantOptions }),
  updateVariantOptionName: (id, value) =>
    set((state) => ({
      variantOptions: state.variantOptions.map((option) =>
        option.id === id ? { ...option, name: value } : option,
      ),
    })),
  updateVariantOptionValues: (e, groupId) =>
    set((state) => {
      if (e.key === "Enter" || e.key === ",") {
        const value = e.target.value.split(",")[0].trim();
        try {
          if (value.length > 0) {
            return {
              variantOptions: state.variantOptions.map((option) =>
                option.id === groupId
                  ? { ...option, values: [...option.values, value] }
                  : option,
              ),
            };
          }
        } catch (error) {
          console.error(error);
        } finally {
          e.target.value = "";
        }
      }
      return state;
    }),

  removeVariantOptionValue: (groupId, index) =>
    set((state) => ({
      variantOptions: state.variantOptions.map((option) =>
        option.id === groupId
          ? {
              ...option,
              values: option.values.filter((_, i) => i !== index),
            }
          : option,
      ),
    })),

  removeVariantOption: (id) =>
    set((state) => ({
      variantOptions: state.variantOptions.filter((opt) => opt.id !== id),
    })),

  variantIsSaved: false,
  actionType: "",
  setActionType: (actionType) => set({ actionType }),
  setVariantIsSaved: (variantIsSaved) => set({ variantIsSaved }),
  editVariantWithId: null,
  setEditVariantWithId: (editVariantWithId) => set({ editVariantWithId }),
}));

export const useCategoryStore = create((set) => ({
  allCategories: [],
  setAllCategories: (allCategories) => set({ allCategories }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}));
