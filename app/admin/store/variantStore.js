import { create } from "zustand";
import EditVariant from "../ui/products/EditVariant";

export const useVariantStore = create((set) => ({
  variants: [],

  setVariants: (variants) => set({ variants }),
  updateVariant: (variantId, newVariant) =>
    set((state) => ({
      variants: state.variants.map((variant) =>
        variant.id === variantId ? { ...variant, ...newVariant } : variant,
      ),
    })),

  variantOptions: [],

  addVariantOptions: (option) =>
    set((state) => ({ variantOptions: [...state.variantOptions, option] })),

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
        if (value.length > 0) {
          e.target.value = "";
          return {
            variantOptions: state.variantOptions.map((option) =>
              option.id === groupId
                ? { ...option, values: [...option.values, value] }
                : option,
            ),
          };
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
  EditVariantWithId: null,
  setEditVariantWithId: (id) => set({ EditVariantWithId: id }),
}));
