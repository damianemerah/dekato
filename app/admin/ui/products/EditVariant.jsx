import { useState, memo, useCallback } from "react";
import { useVariantStore } from "../../store/variantStore";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { toast } from "react-toastify";

import { ButtonPrimary } from "@/app/ui/Button";
import ModalWrapper from "./ModalWrapper";
import DeleteIcon from "@/public/assets/icons/remove.svg";
import AddIcon from "@/public/assets/icons/add.svg";
import ListIcon from "@/public/assets/icons/list.svg";
import Image6 from "@/public/assets/image6.png";
import VariantGroupTable from "./VariantGroupTable";

function arrayToMap(arr) {
  const map = new Map();

  for (const item of arr) {
    const key = JSON.stringify(item);
    map.set(key, item);
  }
  return map;
}

export default memo(function EditVariant({
  setOpenSlider,
  openSlider,
  handleOpenSlider2,
}) {
  const [activeGroup, setActiveGroup] = useState({ id: null });

  const variants = useVariantStore((state) => state.variants);
  const setVariants = useVariantStore((state) => state.setVariants);
  const updateVariant = useVariantStore((state) => state.updateVariant);
  const setVariantIsSaved = useVariantStore((state) => state.setVariantIsSaved);
  const setEditVariantWithId = useVariantStore(
    (state) => state.setEditVariantWithId,
  );
  const variantOptions = useVariantStore((state) => state.variantOptions);
  const addVariantOptions = useVariantStore((state) => state.addVariantOptions);
  const updateVariantOptionName = useVariantStore(
    (state) => state.updateVariantOptionName,
  );
  const updateVariantOptionValues = useVariantStore(
    (state) => state.updateVariantOptionValues,
  );
  const removeVariantOption = useVariantStore(
    (state) => state.removeVariantOption,
  );
  const removeVariantOptionValue = useVariantStore(
    (state) => state.removeVariantOptionValue,
  );

  const handleAddGroup = useCallback(() => {
    addVariantOptions({ id: uuidv4(), name: "", values: [] });
  }, [addVariantOptions]);

  const handleGroupNameChange = useCallback(
    (id, value) => {
      updateVariantOptionName(id, value);
    },
    [updateVariantOptionName],
  );

  const handleValueChange = useCallback(
    (e, groupId) => {
      updateVariantOptionValues(e, groupId);
      console.log(variantOptions);
    },
    [updateVariantOptionValues, variantOptions],
  );

  const handleRemoveGroup = useCallback(
    (id) => {
      removeVariantOption(id);
    },
    [removeVariantOption],
  );

  const handleRemoveGroupItem = useCallback(
    (groupId, index) => {
      removeVariantOptionValue(groupId, index);
    },
    [removeVariantOptionValue],
  );

  const handleGroupAction = useCallback((id) => {
    setActiveGroup((prev) => (prev.id === id ? { id: null } : { id }));
  }, []);

  const handleCreateBulkVariant = useCallback(
    (attributes) => {
      // Base case: when no more attributes to process, return an empty combination
      try {
        if (attributes.length === 0) {
          return [{}];
        }

        if (attributes.some((attr) => attr.values.length === 0)) {
          const emptyValueIndex = attributes.findIndex(
            (el) => el.values.length === 0,
          );
          const val = attributes[emptyValueIndex].name.toUpperCase();
          toast.warn(`${val} group cannot be empty`);
          return;
        }

        // Proceed with bulk creation
      } catch (error) {
        toast.error("An error occurred while creating bulk variants.");
      }

      const [firstAttribute, ...remainingAttributes] = attributes;
      const remainingCombinations =
        handleCreateBulkVariant(remainingAttributes);

      const combinations = [];
      for (const value of firstAttribute.values) {
        for (const combination of remainingCombinations) {
          combinations.push({
            ...combination,
            id: uuidv4(),
            [firstAttribute.name]: value,
          });
        }
      }
      setVariants(combinations);
      setVariantIsSaved(false);

      return combinations;
    },
    [setVariants, setVariantIsSaved],
  );

  const handleChangeValue = useCallback(
    (e, index, field) => {
      const { value } = e.target;
      if (isNaN(value) || value < 0) {
        toast.warn("Please enter a valid number.");
        return;
      }
      updateVariant(variants[index].id, { [field]: value });
    },
    [updateVariant, variants],
  );

  const handleSaveVariant = useCallback(() => {
    if (variants.length === 0) return;
    setVariantIsSaved(true);
    setOpenSlider(false);
  }, [variants, setVariantIsSaved, setOpenSlider]);

  return (
    <ModalWrapper openSlider={openSlider} setOpenSlider={setOpenSlider}>
      <div className="sticky top-0 z-[25] flex min-h-24 items-center justify-between bg-white px-6 shadow-shadowSm">
        <h2 className="text-xl font-medium text-primary">Edit Variants</h2>
        <div className="cursor-pointer rounded-md p-1 text-xl hover:bg-grayBg">
          <DeleteIcon onClick={() => setOpenSlider(false)} />
        </div>
      </div>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-medium text-primary">Group</h2>
          <ButtonPrimary
            className="flex items-center gap-1.5 !rounded-full !px-4 !py-1.5"
            onClick={handleAddGroup}
          >
            <AddIcon className="text-xxs font-extrabold text-white" />
            Add
          </ButtonPrimary>
        </div>
        <VariantGroupTable
          variantOptions={variantOptions}
          handleGroupNameChange={handleGroupNameChange}
          handleRemoveGroupItem={handleRemoveGroupItem}
          handleValueChange={handleValueChange}
          handleGroupAction={handleGroupAction}
          activeGroup={activeGroup}
          handleRemoveGroup={handleRemoveGroup}
          setActiveGroup={setActiveGroup}
        />
      </div>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-medium text-primary">Variations</h2>
          <div className="flex items-center gap-2">
            <ButtonPrimary
              className="flex items-center gap-1.5 !rounded-full bg-primary !px-4 !py-1.5 text-white"
              onClick={handleOpenSlider2}
            >
              <AddIcon className="text-xxs font-extrabold text-white" />
              Add
            </ButtonPrimary>
            <ButtonPrimary
              className="flex items-center gap-1 !rounded-full !bg-slate-500 !px-4 !py-1.5"
              onClick={() => handleCreateBulkVariant(variantOptions)}
            >
              <ListIcon className="scale-125 text-xl" />
              Bulk Add
            </ButtonPrimary>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full table-fixed bg-white">
            <thead>
              <tr className="bg-gray-100 text-xs uppercase leading-normal text-gray-600">
                <th className="max-w-6 px-6 py-3 text-left font-medium">
                  IMAGE
                </th>
                <th className="text-left font-medium">OPTIONS</th>
                <th className="py-3 text-left font-medium">QUANTITY</th>
                <th className="py-3 text-left font-medium">PRICE</th>
                <th className="px-6 py-3 text-right font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light text-gray-600">
              {variants.map((variant, index) => (
                <tr
                  className="border-b border-gray-200 hover:bg-gray-50"
                  key={index}
                >
                  <td className="px-6 py-3 text-left font-medium">
                    <div
                      className="h-12 w-12 overflow-hidden rounded-md"
                      onClick={() => setEditVariantWithId(variant.id)}
                    >
                      <Image
                        src={Image6}
                        alt="product image"
                        width={100}
                        height={100}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 text-left">
                    {console.log(variant)}
                    <div className="flex flex-wrap items-center justify-start gap-x-1 gap-y-1.5 rounded-md">
                      {Object.entries(variant).map(
                        ([key, value], i) =>
                          key !== "id" &&
                          key !== "price" &&
                          key !== "quantity" && (
                            <div
                              className="cursor-pointer rounded-full text-sm"
                              key={i}
                            >
                              <span className="rounded-l-full bg-slate-500 p-1.5 text-xxs font-semibold uppercase tracking-widest text-white">
                                {key}
                              </span>
                              <span className="rounded-r-full bg-slate-100 p-1.5 text-xxs font-semibold uppercase tracking-widest text-primary">
                                {value}
                              </span>
                            </div>
                          ),
                      )}
                    </div>
                  </td>
                  <td className="">
                    <input
                      type="number"
                      name="quantity"
                      autoComplete="off"
                      placeholder="Quantity"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                      onChange={(e) => handleChangeValue(e, index, "quantity")}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      autoComplete="off"
                      placeholder="Price"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                      onChange={(e) => handleChangeValue(e, index, "price")}
                    />
                  </td>
                  <td className="pr-6 text-right">
                    <button className="align-middle text-xl font-bold tracking-wider text-primary">
                      ...
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="fixed bottom-0 right-0 mr-5 flex items-center justify-end gap-6 py-4">
            <button
              className="text-[15px] font-bold tracking-wider"
              onClick={() => setOpenSlider(false)}
            >
              Cancel
            </button>
            <ButtonPrimary
              className="!rounded-md !px-3.5 py-4"
              onClick={handleSaveVariant}
            >
              Save changes
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
});
