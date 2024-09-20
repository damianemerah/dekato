import { memo, useCallback, useState, useEffect, useRef } from "react";
import MediaUpload from "@/app/(frontend)/admin/ui/MediaUpload";
import { getBase64 } from "../../utils/utils";
import { useAdminStore } from "@/app/(frontend)/admin/store/adminStore";
import DeleteIcon from "@/public/assets/icons/remove.svg";
import { ButtonPrimary } from "@/app/ui/button";
import { v4 as uuidv4 } from "uuid";
import ModalWrapper from "./ModalWrapper";
import { message } from "antd";
import DropDown from "../DropDown2";

export default memo(function AddSingleVariant({ setOpenSlider, openSlider }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [fileList, setFileList] = useState([]);

  const variantOptions = useAdminStore((state) => state.variantOptions);
  const inputQuantityRef = useRef(null);
  const inputPriceRef = useRef(null);

  const editVariantWithId = useAdminStore((state) => state.editVariantWithId);
  const variants = useAdminStore((state) => state.variants || []);
  const setVariants = useAdminStore((state) => state.setVariants);
  const setEditVariantWithId = useAdminStore(
    (state) => state.setEditVariantWithId,
  );

  const updateVariant = useAdminStore((state) => state.updateVariant);
  const addVariant = useAdminStore((state) => state.addVariant);

  useEffect(() => {
    //clear inputs when modal is closed
    if (!openSlider) {
      setEditVariantWithId(null);
      const radios = document.querySelectorAll("input[type='radio']");
      radios.forEach((radio) => {
        return (radio.checked = false);
      });
      inputQuantityRef.current.value = "";
      inputPriceRef.current.value = "";

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
              // value: option.name + value,
              value: uuidv4(),
            })),
          };
        })
        .map((item) => {
          const selectedId = item.options.find((option) => {
            return selectedVariant?.options[item.name] === option.label;
          })?.value;
          return {
            ...item,
            selected: selectedId || "",
          };
        });

      setGroupList(groupList);

      setGroupList(groupList);
    }
  }, [variantOptions, selectedVariant, openSlider]);

  useEffect(() => {
    //set selected option when editing a variant
    if (variants && editVariantWithId) {
      const selectedOpt = variants.find(
        (variant) => variant.id === editVariantWithId,
      );

      let url;

      if (selectedOpt?.imageURL) {
        url = selectedOpt.imageURL;
      } else if (selectedOpt?.image && typeof selectedOpt?.image === "string") {
        url = selectedOpt.image;
      }

      const selectedVariantImg = selectedOpt?.image
        ? [
            {
              uid: 1,
              name: "image.png",
              status: "done",
              url,
            },
          ]
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
      };
    }, {});

    let isDuplicate = false;

    if (
      variants.some(
        (variant) =>
          JSON.stringify(variant.options).toLowerCase() ===
          JSON.stringify(options).toLowerCase(),
      )
    ) {
      isDuplicate = true;
    }

    let imageURL;

    // New logic: Use defaultFileList if fileList is empty
    if (fileList.length === 0 && defaultFileList.length > 0) {
      imageURL = defaultFileList[0]?.url; // Use existing image URL
    } else if (typeof fileList[0]?.url === "string") {
      imageURL = fileList[0].url;
    } else if (fileList?.length && fileList[0]?.originFileObj instanceof Blob) {
      imageURL = await getBase64(fileList[0].originFileObj);
    }

    if (editVariantWithId) {
      const variant = variants.find(
        (variant) => variant.id === editVariantWithId,
      );

      updateVariant(editVariantWithId, {
        options: isDuplicate ? variant.options : options,
        quantity: inputQuantityRef.current.value,
        price: inputPriceRef.current.value,
        image:
          fileList?.length && fileList[0]?.originFileObj instanceof Blob
            ? fileList[0]
            : fileList[0] && fileList[0].url
              ? fileList[0].url
              : null,
        imageURL,
      });
    } else {
      if (
        variants.some(
          (variant) =>
            JSON.stringify(variant.options) === JSON.stringify(options),
        )
      ) {
        setOpenSlider(false);
        message.info("Variant already exists.");
        return;
      }

      const id = uuidv4();
      const imageURL =
        fileList?.length && (await getBase64(fileList[0].originFileObj));
      addVariant({
        id,
        options,
        quantity: inputQuantityRef.current.value,
        price: inputPriceRef.current.value,
        image: fileList?.length ? fileList[0] : null,
        imageURL,
      });
    }

    if (fileList.length === 0 && defaultFileList.length === 0) {
      const updatedVariants = variants.map((variant) => {
        if (variant.id === editVariantWithId) {
          return {
            ...variant,
            imageURL: null,
            image: null,
          };
        }
        return variant;
      });

      setVariants(updatedVariants);
    }

    setOpenSlider(false);
    setEditVariantWithId(null);
    setFileList([]); // Ensure both lists are cleared
    setDefaultFileList([]); // Ensure both lists are cleared
  }, [
    setOpenSlider,
    addVariant,
    editVariantWithId,
    updateVariant,
    variants,
    fileList,
    setEditVariantWithId,
    groupList,
    defaultFileList,
    setVariants,
  ]);

  const handleInputChange = useCallback(
    (id, val, field) => {
      if (isNaN(val) || val < 0) {
        message.info("Please enter a valid number.");
        return;
      }
      updateVariant(id, { [field]: val });
    },
    [updateVariant],
  );

  return (
    <ModalWrapper setOpenSlider={setOpenSlider} openSlider={openSlider}>
      <div className="flex min-h-24 items-center justify-between px-6">
        <h1 className="text-xl font-medium text-primary">Edit Variants</h1>
        <div className="cursor-pointer rounded-md p-1 text-xl hover:bg-grayBg">
          <DeleteIcon onClick={() => setOpenSlider(false)} />
        </div>
      </div>
      <div className="h-full bg-grayBg p-6">
        <h2 className="font- mb-4 text-2xl text-primary">
          Select options for product variants
        </h2>
        <div className="mb-6 flex w-full flex-col gap-4 sm:flex-row md:flex-row">
          {groupList.map((group) => (
            <DropDown
              key={group.name}
              options={group.options}
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

        <div className="mb-6 rounded-lg p-6 shadow-shadowSm">
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
              ref={inputQuantityRef}
              type="number"
              name="quantity"
              id="quantity"
              autoComplete="off"
              placeholder="Enter quantity"
              value={
                variants?.find((variant) => variant.id === editVariantWithId)
                  ?.quantity || ""
              }
              className="block w-full rounded-md bg-white px-3 py-4 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
              onChange={(e) =>
                handleInputChange(editVariantWithId, e.target.value, "quantity")
              }
            />
          </div>
          <div className="flex w-full flex-col items-start gap-1.5">
            <label htmlFor="price">Price</label>
            <input
              ref={inputPriceRef}
              type="number"
              name="price"
              id="price"
              autoComplete="off"
              placeholder="Enter price"
              value={
                variants?.find((variant) => variant.id === editVariantWithId)
                  ?.price || ""
              }
              className="block w-full rounded-md bg-white px-3 py-4 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
              onChange={(e) =>
                handleInputChange(editVariantWithId, e.target.value, "price")
              }
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
          className="!rounded-md !px-3.5 py-4 text-base font-bold tracking-wide"
          onClick={() => handleSaveSingleVariant()}
        >
          Add variant
        </ButtonPrimary>
      </div>
    </ModalWrapper>
  );
});
