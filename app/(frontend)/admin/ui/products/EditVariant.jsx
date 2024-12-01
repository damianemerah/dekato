import { memo, useCallback, useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { message, Dropdown } from "antd";

import { InfoCircleOutlined } from "@ant-design/icons";
import DeleteIcon from "@/public/assets/icons/remove.svg";
import AddIcon from "@/public/assets/icons/add.svg";
import ListIcon from "@/public/assets/icons/list.svg";
import noImage from "@/public/assets/no-image.webp";

import { ButtonPrimary } from "@/app/ui/button";
import ModalWrapper from "./ModalWrapper";
import VariantGroupTable from "./VariantGroupTable";

export default memo(function EditVariant({
  setOpenSlider,
  openSlider,
  handleOpenSlider2,
  handleEditSingleVariant,
  actionType,
}) {
  const variants = useAdminStore((state) => state.variants);
  const setVariants = useAdminStore((state) => state.setVariants);
  const removeVariant = useAdminStore((state) => state.removeVariant);
  const updateVariant = useAdminStore((state) => state.updateVariant);
  const setVariantIsSaved = useAdminStore((state) => state.setVariantIsSaved);
  const variantOptions = useAdminStore((state) => state.variantOptions);
  const addVariantOptions = useAdminStore((state) => state.addVariantOptions);
  const setDefaultVariantOptions = useAdminStore(
    (state) => state.setDefaultVariantOptions,
  );
  const defaultVariantOptions = useAdminStore(
    (state) => state.defaultVariantOptions,
  );
  const setVariantOptions = useAdminStore((state) => state.setVariantOptions);
  const optionIsSaved = useAdminStore((state) => state.optionIsSaved);
  const setOptionIsSaved = useAdminStore((state) => state.setOptionIsSaved);

  const handleCreateBulkVariant = useCallback(
    (data, index = 0, currentVariant = {}, currentLabels = {}, result = []) => {
      // Base case: when all attributes are processed
      if (index === data.length) {
        result.push({
          id: uuidv4(),
          options: { ...currentVariant },
          ...currentLabels,
        });
        return;
      }

      const currentAttribute = data[index];
      const { name, values, labelId } = currentAttribute; // @VariantGroupTable.jsx

      values.forEach((value) => {
        currentVariant[name] = value;
        currentLabels[`${name}_label`] = labelId; // Moved outside of options

        handleCreateBulkVariant(
          data,
          index + 1,
          { ...currentVariant },
          { ...currentLabels },
          result,
        );
      });

      return result;
    },
    [],
  );

  useEffect(() => {
    if (actionType === "edit" && defaultVariantOptions.length) {
      setVariantOptions(defaultVariantOptions);
    } else if (actionType === "create") {
      setVariants([]);
      setVariantOptions([]);
      setOptionIsSaved(false);
      setVariantIsSaved(false);
    }
  }, [
    actionType,
    defaultVariantOptions,
    setVariantOptions,
    setVariants,
    setOptionIsSaved,
    setVariantIsSaved,
  ]);

  const handleInputChange = useCallback(
    (e, index, field) => {
      const { value } = e.target;
      if (isNaN(value) || value < 0) {
        message.warning("Please enter a valid number.");
        return;
      }
      updateVariant(variants[index].id, { [field]: value });
    },
    [updateVariant, variants],
  );

  const handleSaveVariant = useCallback(() => {
    setVariantIsSaved(true);
    setDefaultVariantOptions(variantOptions);

    setOpenSlider(false);
    message.success("Variants saved");
  }, [
    setVariantIsSaved,
    setOpenSlider,
    setDefaultVariantOptions,
    variantOptions,
  ]);

  const handleSaveOption = useCallback(() => {
    if (optionIsSaved || variantOptions.length === 0) return;

    if (
      variantOptions.some(
        (option) => option.name === "" || option.values.length === 0,
      )
    ) {
      message.warning("Values cannot be empty");
      return;
    }

    // Check for duplicate option names
    const optionNames = variantOptions.map((option) =>
      option.name.toLowerCase().trim(),
    );
    const hasDuplicates = optionNames.some(
      (name, index) => optionNames.indexOf(name) !== index,
    );

    if (hasDuplicates) {
      message.warning("Duplicate option names are not allowed");
      return;
    }

    // If no duplicates, proceed with saving

    setOptionIsSaved(true);
    message.success("Options saved");
  }, [setOptionIsSaved, variantOptions, optionIsSaved]);

  const items = [
    {
      key: "1",
      label: <span className="text-red-500">Remove</span>,
      onClick: (variantId) => removeVariant(variantId),
    },
    {
      key: "2",
      label: "Cancel",
      onClick: () => {},
    },
  ];

  const renderSaveProductWarning = () => {
    if (actionType === "create") {
      return (
        <div className="mb-6 flex h-full items-center justify-center">
          <div className="flex items-center justify-center rounded-md bg-yellow-50 p-4">
            <InfoCircleOutlined className="text-xl text-yellow-500" />
            <p className="text-sm text-yellow-700">
              Please save the product with images first before adding variants
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ModalWrapper openSlider={openSlider} setOpenSlider={setOpenSlider}>
      <div className="sticky top-0 z-[25] flex min-h-24 items-center justify-between bg-white px-6 shadow-shadowSm">
        <h2 className="text-xl font-medium text-primary">Edit Variants</h2>
        <div className="cursor-pointer rounded-md p-1 text-xl hover:bg-grayBg">
          <DeleteIcon onClick={() => setOpenSlider(false)} />
        </div>
      </div>
      {actionType === "create" ? (
        renderSaveProductWarning()
      ) : (
        <div className="relative h-screen">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-medium text-primary">Group</h2>
              <div className="flex items-center gap-2">
                <ButtonPrimary
                  className="flex items-center gap-1.5 !rounded-full bg-primary !px-4 !py-1.5"
                  onClick={() => {
                    addVariantOptions({
                      id: uuidv4(),
                      name: "",
                      values: [],
                    });
                    setOptionIsSaved(false);
                  }}
                >
                  <AddIcon className="text-xxs font-extrabold text-white" />
                  Add
                </ButtonPrimary>
                {!optionIsSaved && (
                  <ButtonPrimary
                    className="flex items-center gap-1.5 !rounded-full bg-slate-500 !px-4 !py-1.5"
                    onClick={handleSaveOption}
                  >
                    Save
                  </ButtonPrimary>
                )}
              </div>
            </div>
            <VariantGroupTable />
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
                  onClick={() => {
                    const result = handleCreateBulkVariant(variantOptions);
                    setVariants(result);
                    setVariantIsSaved(false);
                  }}
                >
                  <ListIcon className="scale-125 text-xl" />
                  Bulk Add
                </ButtonPrimary>
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 sm:overflow-x-auto md:overflow-hidden">
              <table className="min-w-full table-fixed bg-white">
                <thead>
                  <tr className="bg-gray-100 text-xs uppercase leading-normal text-gray-600">
                    <th className="max-w-6 px-6 py-3 text-left font-medium">
                      IMAGE
                    </th>
                    <th className="text-left font-medium">OPTIONS</th>
                    <th className="py-3 text-left font-medium">QUANTITY</th>
                    <th className="py-3 text-left font-medium">PRICE</th>
                    <th className="px-6 py-3 text-right font-medium">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light text-gray-600">
                  {variants?.length > 0 &&
                    variants?.map((variant, index) => {
                      return (
                        <tr
                          className="border-b border-gray-200 hover:bg-gray-50"
                          key={index}
                        >
                          <td className="px-6 py-3 text-left font-medium">
                            <div
                              className="h-12 w-12 cursor-pointer overflow-hidden rounded-md"
                              onClick={() =>
                                handleEditSingleVariant(variant.id)
                              }
                            >
                              {typeof variant?.image === "string" ? (
                                <Image
                                  src={variant.image}
                                  alt="product image"
                                  width={100}
                                  height={100}
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Image
                                  src={
                                    typeof variant.image === "object" &&
                                    variant.imageURL
                                      ? variant.imageURL
                                      : noImage
                                  }
                                  alt="product image"
                                  width={100}
                                  height={100}
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                          </td>
                          <td className="py-3 text-left">
                            <div className="flex flex-wrap items-center justify-start gap-x-1 gap-y-1.5 rounded-md">
                              {variant?.options &&
                                Object.entries(variant?.options).map(
                                  ([key, value], i) => (
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
                              value={variant?.quantity || ""}
                              name="quantity"
                              autoComplete="off"
                              placeholder="Quantity"
                              className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                              onChange={(e) =>
                                handleInputChange(e, index, "quantity")
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="price"
                              value={variant?.price || ""}
                              autoComplete="off"
                              placeholder="Price"
                              className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                              onChange={(e) =>
                                handleInputChange(e, index, "price")
                              }
                            />
                          </td>
                          <td className="pr-6 text-right">
                            <Dropdown
                              menu={{
                                items: items.map((item) => ({
                                  ...item,
                                  onClick: () => item.onClick(variant.id),
                                })),
                              }}
                              trigger={["click"]}
                            >
                              <span className="cursor-pointer text-xl font-bold tracking-wider text-primary">
                                ...
                              </span>
                            </Dropdown>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {actionType === "edit" && (
        <div className="sticky bottom-0 left-0 right-0 z-[25] flex min-h-24 w-full items-center justify-end gap-6 bg-white shadow-shadowSm">
          <button
            className="text-[15px] font-bold tracking-wider"
            onClick={() => setOpenSlider(false)}
          >
            Cancel
          </button>
          <ButtonPrimary
            className="!rounded-md bg-primary !px-3.5 py-4"
            onClick={handleSaveVariant}
          >
            Save changes
          </ButtonPrimary>
        </div>
      )}
    </ModalWrapper>
  );
});
