import AddSingleVariant from "@/app/(frontend)/admin/ui/products/AddSingleVariant";
import VariantsSection from "@/app/(frontend)/admin/ui/products/ProductVariantForm";
import EditVariant from "@/app/(frontend)/admin/ui/products/EditVariant";
import Link from "next/link";
import { roboto } from "@/style/font";
import BackIcon from "@/public/assets/icons/arrow_back.svg";
import MediaUpload from "@/app/(frontend)/admin/ui/MediaUpload";
import { Switch, Space, DatePicker } from "antd";
import DropDown from "@/app/(frontend)/admin/ui/DropDown";
import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ProductForm = ({
  handleFormSubmit,
  isSwitchDisabled,
  nameRef,
  description,
  setDescription,
  submitBtnRef,
  prodLoading,
  showConfirm,
  selectedProduct,
  switchState,
  catList,
  selectedCatKeys,
  setSelectedCatKeys,
  openSlider1,
  setOpenSlider1,
  openSlider2,
  setOpenSlider2,
  handleEditSingleVariant,
  actionType,
  fileList,
  setFileList,
  defaultFileList,
  setDefaultFileList,
  priceRef,
  discountRef,
  quantityRef,
  collectionList,
  selectedCollectionKeys,
  setSelectedCollectionKeys,
}) => {
  const isCreateMode = actionType === "create";
  const [discountDuration, setDiscountDuration] = useState(null);

  useEffect(() => {
    if (selectedProduct?.discountDuration) {
      setDiscountDuration(dayjs(selectedProduct.discountDuration));
    }
  }, [selectedProduct?.discountDuration]);

  return (
    <div className="relative h-full">
      <div
        className={`${roboto.className} mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10`}
      >
        <div className="mb-6 flex items-center justify-between sm:mb-8 md:mb-10 lg:mb-12">
          <div className="flex items-center">
            <Link href="/admin/products">
              <BackIcon className="mr-2 cursor-pointer text-lg font-bold sm:mr-3 sm:text-xl md:mr-4" />
            </Link>
            <h3 className="text-lg font-medium sm:text-xl">Products</h3>
          </div>
          {!isCreateMode && (
            <Link href="/admin/products/new">
              <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                Add New Product
              </button>
            </Link>
          )}
        </div>
        <h2 className="mb-4 text-xl font-medium tracking-wide sm:mb-6 sm:text-2xl md:mb-8">
          {isCreateMode ? "Add Product" : "Edit Product"}
        </h2>
        <form
          action={handleFormSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div className="sm:col-span-2">
            <ProductDetails
              nameRef={nameRef}
              description={description}
              setDescription={setDescription}
              fileList={fileList}
              setFileList={setFileList}
              defaultFileList={defaultFileList}
              setDefaultFileList={setDefaultFileList}
              priceRef={priceRef}
              discountRef={discountRef}
              quantityRef={quantityRef}
              selectedProduct={selectedProduct}
              discountDuration={discountDuration}
              setDiscountDuration={setDiscountDuration}
            />
            <VariantsSection handleOpenSlider={() => setOpenSlider1(true)} />
          </div>
          <div>
            <ProductActions
              submitBtnRef={submitBtnRef}
              prodLoading={prodLoading}
              isSwitchDisabled={isSwitchDisabled}
              showConfirm={showConfirm}
              selectedProduct={selectedProduct}
              switchState={switchState}
              catList={catList}
              selectedCatKeys={selectedCatKeys}
              setSelectedCatKeys={setSelectedCatKeys}
              collectionList={collectionList}
              selectedCollectionKeys={selectedCollectionKeys}
              setSelectedCollectionKeys={setSelectedCollectionKeys}
            />
          </div>
        </form>
        <EditVariant
          openSlider={openSlider1}
          setOpenSlider={setOpenSlider1}
          handleOpenSlider2={() => setOpenSlider2(true)}
          handleEditSingleVariant={handleEditSingleVariant}
          actionType={actionType}
        />
        <AddSingleVariant
          openSlider={openSlider2}
          setOpenSlider={setOpenSlider2}
        />
      </div>
    </div>
  );
};

const ProductDetails = ({
  nameRef,
  description,
  setDescription,
  fileList,
  setFileList,
  defaultFileList,
  setDefaultFileList,
  priceRef,
  discountRef,
  quantityRef,
  discountDuration,
  setDiscountDuration,
  selectedProduct,
}) => (
  <>
    <FormSection>
      <FormField
        label="TITLE"
        name="name"
        type="text"
        inputRef={nameRef}
        placeholder="Short sleeve t-shirt"
        required
        defaultValue={selectedProduct?.name || ""}
      />
      <FormField
        label="DESCRIPTION"
        name="description"
        as={ReactQuill}
        theme="snow"
        value={description}
        onChange={setDescription}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, 4, false] }],
            ["bold", "italic", "underline", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["clean"],
            [{ color: [] }, { background: [] }],
          ],
          clipboard: { matchVisual: false },
          history: { delay: 1000, maxStack: 100 },
        }}
      />
    </FormSection>
    <FormSection className="mb-6 sm:p-6">
      <MediaUpload
        multiple={true}
        fileList={fileList}
        setFileList={setFileList}
        defaultFileList={defaultFileList}
        setDefaultFileList={setDefaultFileList}
      />
    </FormSection>
    <FormSection className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <FormField
        label="PRICE"
        name="price"
        type="number"
        inputRef={priceRef}
        placeholder="100"
        required
        defaultValue={selectedProduct?.price || undefined}
      />
      <FormField
        label="DISCOUNT (%)"
        name="discount"
        type="number"
        inputRef={discountRef}
        placeholder="0"
        min="0"
        max="100"
        defaultValue={selectedProduct?.discount || undefined}
      />
      <div>
        <label className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary">
          DISCOUNTED PRICE
        </label>
        <div
          className="block w-full cursor-not-allowed rounded-md px-3 py-3 text-sm shadow-shadowSm"
          title="Not editable"
        >
          {selectedProduct?.discountPrice || "N/A"}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary">
          DISCOUNT DURATION
        </label>
        <DatePicker
          className="block w-full rounded-md px-3 py-3 text-sm shadow-shadowSm"
          name="discountDuration"
          value={discountDuration}
          onChange={(value) => {
            setDiscountDuration(value);
          }}
          size="large"
        />
      </div>
    </FormSection>
    <FormSection className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <FormField
        label="INVENTORY"
        name="quantity"
        type="number"
        inputRef={quantityRef}
        placeholder="100"
        required
        defaultValue={selectedProduct?.quantity || undefined}
      />
      <div>
        <label className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary">
          SOLD
        </label>
        <div
          className="block w-full cursor-not-allowed rounded-md px-3 py-3 text-sm shadow-shadowSm"
          title="Not editable"
        >
          {selectedProduct?.sold || "N/A"}
        </div>
      </div>
    </FormSection>
  </>
);

const ProductActions = ({
  isSwitchDisabled,
  submitBtnRef,
  prodLoading,
  showConfirm,
  selectedProduct,
  switchState,
  catList,
  selectedCatKeys,
  setSelectedCatKeys,
  collectionList,
  selectedCollectionKeys,
  setSelectedCollectionKeys,
}) => {
  return (
    <>
      <FormSection>
        <div className="flex w-full items-center justify-center">
          <button
            type="submit"
            className="grow-1 mr-4 flex-1 rounded-md bg-primary px-4 py-2.5 text-white sm:px-8 md:px-16"
            ref={submitBtnRef}
          >
            <Space>
              Save changes
              {prodLoading && <SmallSpinner className="!text-white" />}
            </Space>
          </button>
          <button
            className="text-xl font-bold tracking-wider text-primary"
            type="button"
          >
            ...
          </button>
        </div>
        <hr className="my-3 opacity-60" />
        <Switch
          loading={switchState}
          onClick={showConfirm}
          checked={selectedProduct?.status === "active" || false}
          disabled={isSwitchDisabled}
        />
      </FormSection>
      <FormSection>
        <h3 className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary">
          CATEGORY
        </h3>
        <DropDown
          options={catList}
          mode="tags"
          selectedKeys={selectedCatKeys}
          handleChange={(value) => setSelectedCatKeys(value)}
        />
      </FormSection>
      <FormSection>
        <h3 className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary">
          COLLECTION
        </h3>
        <DropDown
          options={collectionList}
          mode="tags"
          selectedKeys={selectedCollectionKeys}
          handleChange={(value) => setSelectedCollectionKeys(value)}
        />
      </FormSection>
    </>
  );
};

const FormSection = ({ children, className = "" }) => (
  <div className={`mb-4 rounded-lg bg-white p-4 shadow-shadowSm ${className}`}>
    {children}
  </div>
);

const FormField = ({
  label,
  name,
  as: Component = "input",
  inputRef,
  ...props
}) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary"
    >
      {label}
    </label>
    <Component
      id={name}
      name={name}
      ref={inputRef}
      autoComplete="off"
      className="block w-full rounded-md px-3 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline"
      {...props}
    />
  </div>
);

export default ProductForm;
