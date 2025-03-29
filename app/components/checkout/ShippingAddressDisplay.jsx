'use client';

import PlusIcon from '@/public/assets/icons/add.svg';

export default function ShippingAddressDisplay({
  addressData,
  deliveryMethod,
  onChangeAddress,
}) {
  const defaultAddress = addressData?.find((add) => add.isDefault);

  if (defaultAddress && deliveryMethod === 'delivery') {
    return (
      <div className="flex items-center justify-between border border-primary px-6 py-4 text-sm">
        <div className="flex items-center gap-4">
          <div>
            <p className="mb-1 flex items-center gap-3">
              <span className="font-medium tracking-wide text-primary">
                {defaultAddress?.firstname} {defaultAddress?.lastname}
              </span>
              <span className="text-gray-600">{defaultAddress?.phone}</span>
            </p>
            <p className="text-gray-700">{defaultAddress?.address}</p>
            <p className="text-gray-700">
              {[
                defaultAddress?.city,
                defaultAddress?.state,
                defaultAddress?.country,
              ]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>
        <button
          onClick={onChangeAddress}
          className="border-b border-primary text-base leading-4 text-primary transition-opacity duration-200 hover:opacity-70"
          type="button"
        >
          Change
        </button>
      </div>
    );
  }

  return deliveryMethod === 'delivery' ? (
    <div className="flex items-center justify-center border border-dashed border-gray-300 py-6">
      <button
        onClick={onChangeAddress}
        className="flex items-center gap-2 border-b border-primary text-primary transition-opacity duration-200 hover:opacity-70"
        type="button"
      >
        <PlusIcon className="h-6 w-6 stroke-2" />
        <span>Add an address</span>
      </button>
    </div>
  ) : (
    <div className="flex items-center justify-between border border-primary px-6 py-4 text-sm">
      <div className="flex items-center gap-4">
        <div>
          <p className="mb-1 font-medium tracking-wide text-primary">
            Store pickup
          </p>
          <p className="text-gray-700">
            Please check your email for pickup details
          </p>
        </div>
      </div>
    </div>
  );
}
