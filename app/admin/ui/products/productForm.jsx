import AddSingleVariant from '@/app/admin/ui/products/AddSingleVariant';
import VariantsSection from '@/app/admin/ui/products/ProductVariantForm';
import EditVariant from '@/app/admin/ui/products/EditVariant';
import { useAdminStore } from '@/app/admin/store/adminStore';
import Link from 'next/link';
import BackIcon from '@/public/assets/icons/arrow_back.svg';
import MediaUpload from '@/app/admin/ui/MediaUpload';
import { Switch, Space, DatePicker, Select } from 'antd';
import DropDown from '@/app/admin/ui/DropDown';
import { SmallSpinner } from '@/app/components/spinner';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

const TiptapEditor = dynamic(() => import('@/app/components/text-editor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[120px] rounded-md border p-4">Loading editor...</div>
  ),
});

const ProductForm = ({
  tags,
  setTags,
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
  discountPriceRef,
  quantityRef,
  collectionList,
  selectedCollectionKeys,
  setSelectedCollectionKeys,
}) => {
  const isCreateMode = actionType === 'create';
  const [discountDuration, setDiscountDuration] = useState(null);
  const setProductImages = useAdminStore((state) => state.setProductImages);

  useEffect(() => {
    if (selectedProduct?.discountDuration) {
      setDiscountDuration(dayjs(selectedProduct.discountDuration));
    }
  }, [selectedProduct?.discountDuration]);

  useEffect(() => {
    if (selectedProduct?.image) {
      setProductImages(selectedProduct.image);
    }
  }, [selectedProduct?.image, setProductImages]);

  return (
    <div className="relative h-full">
      <div className="mx-auto px-3 py-12 font-roboto md:px-8">
        <div className="mb-6 flex items-center justify-between sm:mb-8 md:mb-10 lg:mb-12">
          <div className="flex items-center">
            <Link href="/admin/products">
              <BackIcon className="mr-2 cursor-pointer text-lg font-bold sm:mr-3 sm:text-xl md:mr-4" />
            </Link>
            <h3 className="text-lg font-medium sm:text-xl">Products</h3>
          </div>
          {!isCreateMode && (
            <Link href="/admin/products/new">
              <button className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/80">
                Add New Product
              </button>
            </Link>
          )}
        </div>
        <h2 className="mb-4 text-xl font-medium tracking-wide sm:mb-6 sm:text-2xl md:mb-8">
          {isCreateMode ? 'Add Product' : 'Edit Product'}
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
              discountPriceRef={discountPriceRef}
              quantityRef={quantityRef}
              selectedProduct={selectedProduct}
              discountDuration={discountDuration}
              setDiscountDuration={setDiscountDuration}
            />
            <VariantsSection handleOpenSlider={() => setOpenSlider1(true)} />
            <FormSection>
              <h3 className="text-xxs mb-1 block font-bold tracking-[0.12em] text-primary">
                TAGS
              </h3>
              <Select
                mode="tags"
                name="tags"
                style={{ width: '100%' }}
                placeholder="Add tags"
                className="w-full"
                value={tags}
                onChange={setTags}
              />
            </FormSection>
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
  discountPriceRef,
  quantityRef,
  discountDuration,
  setDiscountDuration,
  selectedProduct,
}) => {
  const calculateDiscountFromPrice = (price, discountPrice) => {
    if (!price || !discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const calculateDiscountPrice = (price, discount) => {
    if (!price || !discount) return undefined;
    return Math.round(price * (1 - discount / 100));
  };

  const handleDiscountBlur = () => {
    const price = parseFloat(priceRef.current?.value);
    const discount = parseFloat(discountRef.current?.value);
    console.log(price, discount, !isFinite(price));

    if (!isFinite(price)) {
      console.log('Price is required');
      discountRef.current.value = '';
      toast.error('Price is required');
      return;
    }

    if (price && discount) {
      const calculatedDiscountPrice = calculateDiscountPrice(price, discount);
      discountPriceRef.current.value = calculatedDiscountPrice;
    }
  };

  const handleDiscountPriceBlur = () => {
    const price = parseFloat(priceRef.current?.value);
    const discountPrice = parseFloat(discountPriceRef.current?.value);

    if (!isFinite(price)) {
      console.log('Price is required');
      discountPriceRef.current.value = '';
      toast.error('Price is required');
      return;
    }

    if (price && discountPrice) {
      const calculatedDiscount = calculateDiscountFromPrice(
        price,
        discountPrice
      );
      discountRef.current.value = calculatedDiscount;
    }
  };

  return (
    <>
      <FormSection>
        <FormField
          label="TITLE"
          name="name"
          type="text"
          inputRef={nameRef}
          placeholder="Short sleeve t-shirt"
          required
          defaultValue={selectedProduct?.name || ''}
        />
        <FormField
          label="DESCRIPTION"
          name="description"
          as={TiptapEditor}
          value={description}
          onChange={setDescription}
        />
      </FormSection>
      <FormSection className="mb-6 sm:p-6">
        <MediaUpload
          multiple={true}
          fileList={fileList}
          setFileList={setFileList}
          defaultFileList={defaultFileList}
          setDefaultFileList={setDefaultFileList}
          draggable={true}
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
          onBlur={handleDiscountBlur}
        />
        <FormField
          label="DISCOUNTED PRICE"
          name="discountPrice"
          type="number"
          inputRef={discountPriceRef}
          placeholder="0"
          defaultValue={selectedProduct?.discountPrice || undefined}
          onBlur={handleDiscountPriceBlur}
        />
        <div>
          <label className="text-xxs mb-1 block font-bold tracking-[0.12em] text-primary">
            DISCOUNT DURATION
          </label>
          <DatePicker
            className="shadow-shadowSm block w-full rounded-md px-3 py-3 text-sm"
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
          <label className="text-xxs mb-1 block font-bold tracking-[0.12em] text-blue-500">
            SOLD
          </label>
          <div
            className="shadow-shadowSm block w-full cursor-not-allowed rounded-md px-3 py-3 text-sm"
            title="Not editable"
          >
            {selectedProduct?.sold || 'N/A'}
          </div>
        </div>
      </FormSection>
    </>
  );
};

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
            className="grow-1 mr-4 flex-1 rounded-md bg-primary px-4 py-2.5 text-white hover:bg-primary/80 sm:px-8 md:px-16"
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
        <div className="flex items-center gap-2.5">
          <Switch
            loading={switchState}
            onClick={showConfirm}
            checked={selectedProduct?.status === 'active' || false}
            disabled={isSwitchDisabled}
          />
          {selectedProduct?.status && (
            <p className="uppercase">{selectedProduct.status}</p>
          )}
        </div>
      </FormSection>
      <FormSection>
        <h3 className="text-xxs mb-1 block font-bold tracking-[0.12em] text-primary">
          CATEGORY
        </h3>
        <DropDown
          options={catList}
          mode="multiple"
          selectedKeys={selectedCatKeys}
          handleChange={(value) => setSelectedCatKeys(value)}
        />
      </FormSection>
      <FormSection>
        <h3 className="text-xxs mb-1 block font-bold tracking-[0.12em] text-primary">
          COLLECTION
        </h3>
        <DropDown
          options={collectionList}
          mode="multiple"
          selectedKeys={selectedCollectionKeys}
          handleChange={(value) => setSelectedCollectionKeys(value)}
        />
      </FormSection>
    </>
  );
};

const FormSection = ({ children, className = '' }) => (
  <div className={`shadow-shadowSm mb-4 rounded-lg bg-white p-4 ${className}`}>
    {children}
  </div>
);

const FormField = ({
  label,
  name,
  as: Component = 'input',
  inputRef,
  ...props
}) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="text-xxs mb-1 block font-bold tracking-[0.12em] text-primary"
    >
      {label}
    </label>
    <Component
      id={name}
      name={name}
      ref={inputRef}
      autoComplete="off"
      className="shadow-shadowSm hover:border-grayOutline block w-full rounded-md px-3 py-3 text-sm hover:border"
      {...props}
    />
  </div>
);

export default ProductForm;
