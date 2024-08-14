import { create } from "zustand";
import EditVariant from "../ui/products/EditVariant";

export const useAdminStore = create((set) => ({
  variants: [],

  setVariants: (variants) => set({ variants }),
  updateVariant: (variantId, newVariant) =>
    set((state) => {
      const updatedVariants = state.variants.map((variant) => {
        if (variant.id === variantId) {
          if (newVariant.image instanceof File) {
            if (variant.imageURL) {
              URL.revokeObjectURL(variant.imageURL);
            }
            newVariant.image = URL.createObjectURL(newVariant.image);
            console.log("New Variant Image", newVariant.image instanceof File);
            console.log("Updated Variants🎉🎉🎉");
          }
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
