'use client';

import { useState, useEffect } from 'react';
import { Checkbox } from '@/app/components/ui/checkbox';
import CheckoutProgress from '@/app/components/checkout-progress';
import { useUserStore } from '@/app/store/store';

// Import our new decomposed components
import DeliveryMethodSelector from '@/app/components/checkout/DeliveryMethodSelector';
import ShippingAddressDisplay from '@/app/components/checkout/ShippingAddressDisplay';
import AddressManager from '@/app/components/checkout/AddressManager';
import PaymentMethodSelector from '@/app/components/checkout/PaymentMethodSelector';
import CartSummary from '@/app/components/checkout/CartSummary';
import CheckoutButton from '@/app/components/checkout/CheckoutButton';
import { ButtonPrimary } from '@/app/components/button';

export default function CheckoutClientLayout({
  initialCheckoutData,
  initialAddressData,
  initialPaymentMethods,
  userId,
  userEmail,
}) {
  const [changeAddress, setChangeAddress] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [checkoutData, setCheckoutData] = useState(initialCheckoutData);
  const [addressData, setAddressData] = useState(initialAddressData || []);
  const [paymentMethods, setPaymentMethods] = useState(
    initialPaymentMethods || []
  );
  const [saveCard, setSaveCard] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  const { deliveryMethod, setDeliveryMethod } = useUserStore();

  // Update local state when props change (e.g., after server actions)
  useEffect(() => {
    setCheckoutData(initialCheckoutData);
    setAddressData(initialAddressData || []);
    setPaymentMethods(initialPaymentMethods || []);
  }, [initialCheckoutData, initialAddressData, initialPaymentMethods]);

  // Set default payment method when available
  useEffect(() => {
    if (paymentMethods?.length > 0) {
      const defaultPaymentMethod = paymentMethods.find(
        (method) => method.isDefault
      );
      if (defaultPaymentMethod) {
        setSelectedPaymentMethod(defaultPaymentMethod.id);
      }
    }
  }, [paymentMethods]);

  const selectedAddress = addressData?.find((add) => add.isDefault);

  return (
    <div className="bg-grayBg">
      <div className="mx-auto max-w-[942px]">
        <CheckoutProgress />
        <div className="mx-auto flex flex-col gap-8 md:flex-row">
          {/* Left Section */}
          <div className="w-full md:w-2/3">
            {/* Delivery Method */}
            <section className="mb-8 bg-white px-6 py-8 shadow-sm">
              <DeliveryMethodSelector
                method={deliveryMethod}
                onMethodChange={setDeliveryMethod}
              />

              <h2 className="mb-6 mt-10 font-oswald text-xl font-bold tracking-wide text-primary">
                Shipping address
              </h2>

              <ShippingAddressDisplay
                addressData={addressData}
                deliveryMethod={deliveryMethod}
                onChangeAddress={() => setChangeAddress(true)}
              />

              {deliveryMethod === 'delivery' && (
                <AddressManager
                  userId={userId}
                  addresses={addressData}
                  changeAddress={changeAddress}
                  setChangeAddress={setChangeAddress}
                  onAddressUpdate={setAddressData}
                />
              )}

              {paymentMethods?.length > 0 && (
                <PaymentMethodSelector
                  paymentMethods={paymentMethods}
                  selectedPaymentMethodId={selectedPaymentMethod}
                  onPaymentMethodSelect={setSelectedPaymentMethod}
                  userId={userId}
                  onPaymentMethodsUpdate={setPaymentMethods}
                  setIsUpdatingPayment={setIsUpdatingPayment}
                />
              )}
            </section>
          </div>

          {/* Right Section - Cart Summary */}
          <div className="w-full md:w-1/3">
            <section className="mb-8 bg-white px-6 py-8 shadow-sm">
              <CartSummary checkoutData={checkoutData} />
              {!selectedPaymentMethod && (
                <div className="mt-4">
                  <label className="flex items-center">
                    <Checkbox
                      name="saveCard"
                      checked={saveCard}
                      onCheckedChange={setSaveCard}
                      className="mr-2 h-5 w-5 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">
                      Save card for future purchases
                    </span>
                  </label>
                </div>
              )}
              <div className="mt-6">
                <CheckoutButton
                  userId={userId}
                  isUpdatingPayment={isUpdatingPayment}
                  userEmail={userEmail}
                  checkoutData={checkoutData}
                  deliveryMethod={deliveryMethod}
                  selectedAddress={selectedAddress}
                  selectedPaymentMethodId={selectedPaymentMethod}
                  saveCard={!selectedPaymentMethod && saveCard}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
