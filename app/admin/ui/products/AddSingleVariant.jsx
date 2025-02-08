import { memo, useCallback, useState, useEffect, useRef } from "react";
import MediaUpload from "@/app/admin/ui/MediaUpload";
import { getBase64 } from "../../utils/utils";
import { useAdminStore } from "@/app/admin/store/adminStore";
import DeleteIcon from "@/public/assets/icons/remove.svg";
import { ButtonPrimary } from "@/app/ui/button";
import { v4 as uuidv4 } from "uuid";
import ModalWrapper from "./ModalWrapper";
import { message, Modal } from "antd";
import DropDown from "../DropDown";
import { omit, endsWith, filter, keys } from "lodash";
import Image from "next/image";

export default memo(function AddSingleVariant({ setOpenSlider, openSlider }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const variantOptions = useAdminStore((state) => state.variantOptions);

  const editVariantWithId = useAdminStore((state) => state.editVariantWithId);
  const variants = useAdminStore((state) => state.variants || []);
  const setEditVariantWithId = useAdminStore(
    (state) => state.setEditVariantWithId,
  );

  const updateVariant = useAdminStore((state) => state.updateVariant);
  const addVariant = useAdminStore((state) => state.addVariant);
  const productImages = useAdminStore((state) => state.productImages || []);

  useEffect(() => {
    //clear inputs when modal is closed
    if (!openSlider) {
      setEditVariantWithId(null);
      setQuantity(0);
      setPrice("");
      setSelectedVariant(null);
      setFileList([]);
      setDefaultFileList([]);
    }
  }, [openSlider, setEditVariantWithId]);

  useEffect(() => {
    if (!openSlider) return;
    if (variantOptions) {
      const groupList = variantOptions
        .map((option) => {
          return {
            name: option.name,
            options: option.values.map((value) => ({
              label: value,
              value: uuidv4(),
            })),
            ...option,
          };
        })
        .map((item) => {
          const selectedId = item?.options?.find((option) => {
            return selectedVariant?.options?.[item.name] === option.label;
          })?.value;
          return {
            ...item,
            selected: selectedId || "",
          };
        });

      setGroupList(groupList);
    }

    if (editVariantWithId) {
      const variant = variants.find((v) => v.id === editVariantWithId);

      if (variant) {
        setQuantity(variant.quantity || 0);
        setPrice(variant.price || "");
        variant.image
          ? setDefaultFileList(variant.image)
          : setDefaultFileList([]);
      }
    }
  }, [
    variantOptions,
    selectedVariant,
    openSlider,
    variants,
    editVariantWithId,
  ]);

  useEffect(() => {
    //set selected option when editing a variant
    if (variants && editVariantWithId) {
      const selectedOpt = variants.find(
        (variant) => variant.id === editVariantWithId,
      );

      const selectedVariantImg =
        selectedOpt?.image && typeof selectedOpt?.image === "string"
          ? [
              {
                uid: 1,
                name: "image.png",
                status: "done",
                url: selectedOpt.image,
              },
            ]
          : typeof selectedOpt?.image === "object"
            ? [selectedOpt.image]
            : [];

      setDefaultFileList(selectedVariantImg);
      setSelectedVariant(selectedOpt);
    }
  }, [variants, editVariantWithId]);

  const handleSaveSingleVariant = useCallback(async () => {
    const options = groupList.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.name]: curr.options.find((opt) => opt.value === curr.selected)
          ?.label,
        [`${curr.name}_label`]: curr.labelId || null,
        labelName: curr.labelName || null,
      };
    }, {});

    const optionsWithoutLabels = omit(options, [
      ...filter(keys(options), (key) => endsWith(key, "_label")),
      "labelName",
    ]);

    const optionIds = omit(
      options,
      filter(keys(options), (key) => !endsWith(key, "_label")),
    );

    const isDuplicate = variants.some(
      (variant) =>
        JSON.stringify(variant.options)?.toLowerCase() ===
        JSON.stringify(optionsWithoutLabels)?.toLowerCase(),
    );

    const imageURL = fileList[0]?.originFileObj
      ? await getBase64(fileList[0]?.originFileObj)
      : fileList[0]?.url || undefined;

    if (editVariantWithId) {
      updateVariant(editVariantWithId, {
        options: isDuplicate ? selectedVariant.options : optionsWithoutLabels,
        ...optionIds,
        quantity,
        price,
        image:
          fileList?.length && typeof fileList[0]?.url === "string"
            ? fileList[0].url
            : fileList[0]?.originFileObj instanceof Blob
              ? fileList[0]
              : undefined,
        imageURL,
      });
    } else {
      if (isDuplicate) {
        setOpenSlider(false);
        message.info("Variant already exists.");
        return;
      }

      const id = uuidv4();
      addVariant({
        id,
        options: optionsWithoutLabels,
        ...optionIds,
        quantity,
        price,
        image: fileList?.length ? fileList[0] : undefined,
        imageURL,
      });
    }

    setOpenSlider(false);
    setEditVariantWithId(null);
    setFileList([]);
    setDefaultFileList([]);
  }, [
    setOpenSlider,
    addVariant,
    editVariantWithId,
    updateVariant,
    variants,
    fileList,
    setEditVariantWithId,
    selectedVariant,
    groupList,
    quantity,
    price,
  ]);

  const handleInputChange = useCallback(
    (val, field) => {
      if (isNaN(val) || val < 0) {
        message.info("Please enter a valid number.");
        return;
      }
      if (field === "quantity") {
        setQuantity(val);
      } else if (field === "price") {
        setPrice(val);
      }
      if (editVariantWithId) {
        updateVariant(editVariantWithId, { [field]: val });
      }
    },
    [updateVariant, editVariantWithId],
  );

  const handleSelectExistingImage = (imageUrl) => {
    setFileList([
      {
        uid: uuidv4(),
        name: "image.png",
        status: "done",
        url: imageUrl,
      },
    ]);
    setIsImageModalOpen(false);
  };

  // if (variants.length === 0) {
  //   return (
  //     <ModalWrapper setOpenSlider={setOpenSlider} openSlider={openSlider}>
  //       <div>No variants options found</div>
  //     </ModalWrapper>
  //   );
  // }

  return (
    <ModalWrapper setOpenSlider={setOpenSlider} openSlider={openSlider}>
      <div className="flex min-h-24 items-center justify-between px-6">
        <h2 className="text-xl font-medium text-primary">Edit Variants</h2>
        <div className="cursor-pointer rounded-md p-1 text-xl hover:bg-grayBg">
          <DeleteIcon onClick={() => setOpenSlider(false)} />
        </div>
      </div>
      <div className="h-full bg-grayBg p-6">
        <h2 className="mb-4 text-lg font-medium text-primary">
          Select options for product variants
        </h2>
        <div className="mb-6 flex w-full flex-col gap-4 sm:flex-row md:flex-row">
          {groupList.map((group) => (
            <DropDown
              key={group.name}
              options={group.options}
              placeholder={group.name}
              selectedKeys={group.selected}
              handleChange={(value) => {
                const updatedGroupList = groupList.map((item) => {
                  if (item.name === group.name) {
                    return {
                      ...item,
                      selected: value,
                    };
                  }
                  return item;
                });
                setGroupList(updatedGroupList);
              }}
            />
          ))}
        </div>
        <div className="mb-6 flex items-center justify-center gap-4 rounded-lg p-6 shadow-shadowSm">
          <button
            className="mt-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            onClick={() => setIsImageModalOpen(true)}
            aria-label="Choose from existing product images"
          >
            Choose from existing images
          </button>
          <MediaUpload
            multiple={false}
            fileList={fileList}
            setFileList={setFileList}
            defaultFileList={defaultFileList}
            setDefaultFileList={setDefaultFileList}
          />
        </div>
        <div className="flex flex-col items-center gap-4 py-2 sm:flex-row md:flex-row">
          <div className="flex w-full flex-col items-start gap-1.5">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              autoComplete="off"
              placeholder="Enter quantity"
              value={quantity}
              className="block w-full rounded-md bg-white px-3 py-4 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
              onChange={(e) => handleInputChange(e.target.value, "quantity")}
            />
          </div>
          <div className="flex w-full flex-col items-start gap-1.5">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              autoComplete="off"
              placeholder="Enter price"
              value={price}
              className="block w-full rounded-md bg-white px-3 py-4 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
              onChange={(e) => handleInputChange(e.target.value, "price")}
            />
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 right-0 mr-5 flex w-full items-center justify-end gap-6 bg-white px-6 py-6">
        <button
          className="text-[15px] font-bold tracking-wider"
          onClick={() => setOpenSlider(false)}
        >
          Cancel
        </button>
        <ButtonPrimary
          className="!rounded-md bg-primary !px-3.5 py-4 text-base font-bold tracking-wide"
          onClick={() => handleSaveSingleVariant()}
        >
          Add variant
        </ButtonPrimary>
      </div>

      <Modal
        title="Select Product Image"
        open={isImageModalOpen}
        onCancel={() => setIsImageModalOpen(false)}
        footer={null}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {productImages.map((imageUrl, index) => (
            <div
              key={index}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border hover:border-primary"
              onClick={() => handleSelectExistingImage(imageUrl)}
            >
              <Image
                src={imageUrl}
                alt={`Product ${index + 1}`}
                fill
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </Modal>
    </ModalWrapper>
  );
});
