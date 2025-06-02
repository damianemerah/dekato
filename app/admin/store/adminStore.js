import { create } from 'zustand';

export const useAdminStore = create((set, get) => ({
  variants: [],
  variantOptions: [],
  defaultVariantOptions: [],
  variantIsSaved: true,
  actionType: '',
  editVariantWithId: null,
  optionIsSaved: true,
  productImages: [],

  setOptionIsSaved: (optionIsSaved) => set({ optionIsSaved }),
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

  removeVariant: (id) => {
    set((state) => ({
      variants: state.variants.filter((variant) => variant.id !== id),
    }));
  },

  setVariantOptions: (variantOptions) => set({ variantOptions }),
  setDefaultVariantOptions: (defaultVariantOptions) =>
    set({ defaultVariantOptions }),

  addVariantOptions: (option) =>
    set((state) => ({
      variantOptions: [...state.variantOptions, option],
    })),

  updateVariantOptionName: (id, name) =>
    set((state) => ({
      variantOptions: state.variantOptions.map((option) =>
        option.id === id ? { ...option, name } : option
      ),
    })),

  updateVariantOptionValues: (id, values) =>
    set((state) => ({
      variantOptions: state.variantOptions.map((option) =>
        option.id === id ? { ...option, values } : option
      ),
    })),

  removeVariantOption: (id) =>
    set((state) => ({
      variantOptions: state.variantOptions.filter((opt) => opt.id !== id),
    })),

  setActionType: (actionType) => set({ actionType }),
  setVariantIsSaved: (variantIsSaved) => set({ variantIsSaved }),
  setEditVariantWithId: (editVariantWithId) => set({ editVariantWithId }),
  setProductImages: (images) => set({ productImages: images }),
}));
