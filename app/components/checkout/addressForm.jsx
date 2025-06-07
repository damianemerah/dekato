'use client';

import { useState, memo, useCallback } from 'react';
import { Modal, message } from 'antd';
import { ButtonPrimary } from '../button';
import { updateUserAddress, createUserAddress } from '@/app/action/userAction';
import { useUserStore } from '@/app/store/store';
import EditIcon from '@/public/assets/icons/edit.svg';
import { SmallSpinner } from '@/app/components/spinner';
import { Checkbox } from '@/app/components/ui/checkbox';
import { InputType } from '@/app/components/inputType';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const AddressOption = ({ addresses, changeAddress, setChangeAddress }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const user = useUserStore((state) => state.user);

  const toggleForm = useCallback(() => {
    setShowForm((prev) => !prev);
    setEditingAddress(null);
  }, []);

  const handleUpdateAddress = useCallback(
    async (data, isDefault) => {
      setIsUpdating(true);
      try {
        if (isDefault && typeof isDefault === 'boolean') {
          const formData = new FormData();
          formData.append('addressId', data);
          formData.append('isDefault', isDefault);
          formData.append('userId', user.id);
          const result = await updateUserAddress(formData);
          if (result?.error) {
            message.error(result.message || 'Failed to update address');
            return;
          }

          message.success('Address updated successfully');

          return;
        }
        data.append('userId', user.id);
        if (data.get('isDefault') === 'on') {
          data.set('isDefault', 'true');
        }
        const result = await updateUserAddress(data);
        if (result?.error) {
          message.error(result.message || 'Failed to update address');
          return;
        }

        message.success('Address updated successfully');
      } catch (error) {
        console.error('Error updating address:', error);
        message.error('Failed to update address. Please try again.');
      } finally {
        setIsUpdating(false);
        setChangeAddress(false);
        setEditingAddress(null);
      }
    },
    [setChangeAddress, user?.id]
  );
  const handleCreateAddress = useCallback(
    async (formData) => {
      formData.append('userId', user.id);
      if (formData.get('isDefault') === 'on') {
        formData.set('isDefault', true);
      }

      try {
        const res = await createUserAddress(formData);

        if (res?.error) {
          message.error(res.message || 'Failed to add address');
          return;
        }

        message.success('Address added successfully');
      } catch (error) {
        message.error('Failed to add address. Please try again.');
      } finally {
        setIsUpdating(false);
        setChangeAddress(false);
        setShowForm(false);
      }
    },
    [user?.id, setChangeAddress, setShowForm]
  );

  const renderAddress = useCallback(
    (address, index) => (
      <div
        key={index}
        className="relative flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all duration-300 hover:border-primary hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <input
            type="radio"
            checked={address.isDefault}
            onChange={() => handleUpdateAddress(address.id, true)}
            className="relative mr-2 h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-300 before:absolute before:left-1/2 before:top-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-white checked:border-primary checked:bg-primary checked:before:content-[''] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
          <div>
            <p className="font-semibold tracking-wide text-primary">
              {address.firstname} {address.lastname}
            </p>
            <p className="text-sm text-gray-600">{address.phone}</p>
            <p className="text-sm text-gray-600">{address.address}</p>
            <p className="text-sm text-gray-600">{`${address.city ? address.city + ', ' : ''}${
              address.state ? address.state + ', ' : ''
            }${address.country ? address.country : ''}`}</p>
          </div>
        </div>
        {address.isDefault && (
          <span className="absolute right-2 top-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
            Default
          </span>
        )}
        <button
          className="absolute bottom-2 right-2 rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
          onClick={() => {
            setEditingAddress(address);
            setShowForm(true);
          }}
        >
          <EditIcon className="h-5 w-5" />
        </button>
      </div>
    ),
    [handleUpdateAddress]
  );

  return (
    <Modal
      open={changeAddress}
      onCancel={() => setChangeAddress(false)}
      footer={null}
      width={600}
      className="address-modal"
    >
      <div className="relative">
        <h2 className="mb-6 text-xl font-semibold text-primary">
          Choose Address
        </h2>

        <div className="max-h-[400px] overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses?.map(renderAddress)}
          </div>
        </div>

        <div className="mt-6">
          <ButtonPrimary
            onClick={toggleForm}
            className="w-full !bg-primary hover:opacity-90"
          >
            {showForm ? 'Canceled' : 'Add New Address'}
          </ButtonPrimary>
        </div>

        {showForm && (
          <form
            className="mt-6 space-y-4"
            action={editingAddress ? handleUpdateAddress : handleCreateAddress}
          >
            {editingAddress && (
              <input type="hidden" name="addressId" value={editingAddress.id} />
            )}
            <input type="hidden" name="userId" value={user.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <InputType
                name="firstname"
                label="First name"
                required={true}
                value={editingAddress?.firstname || ''}
              />
              <InputType
                name="lastname"
                label="Last name"
                required={true}
                value={editingAddress?.lastname || ''}
              />
            </div>

            {/* <div className="flex h-full items-center justify-center">
              <div className="relative flex min-h-14 min-w-11 items-center justify-center bg-gray-50 px-2 pb-2 pt-6">
                <label className="absolute left-1 right-1 top-0.5 text-nowrap px-1 text-xs text-gray-500">
                  prefix
                </label>
                <p className="inline-block h-full text-nowrap">+234</p>
              </div>

              <InputType
                name="phone"
                label="Phone number"
                required={true}
                type="tel"
                value={editingAddress?.phone || ''}
              />
            </div> */}

            <div className="flex h-full items-center justify-center">
              <div className="relative w-full">
                <label className="absolute left-2 top-0.5 z-10 bg-white px-1 text-xs text-gray-500">
                  Phone number
                </label>
                <PhoneInput
                  international
                  defaultCountry="NG"
                  value={phone}
                  onChange={setPhone}
                  name="phone"
                  className="react-phone-input w-full rounded-md border border-gray-300 px-3 py-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <InputType
              name="address"
              label="Delivery Address"
              required={true}
              value={editingAddress?.address || ''}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <InputType
                name="city"
                label="City"
                required={true}
                value={editingAddress?.city || ''}
              />
              <InputType
                name="state"
                label="State"
                required={true}
                value={editingAddress?.state || ''}
              />
            </div>
            <InputType
              name="postalCode"
              label="Postal code"
              required={true}
              value={editingAddress?.postalCode || ''}
            />

            <div className="text-sm">
              <label className="flex items-center">
                <Checkbox
                  name="isDefault"
                  defaultChecked={editingAddress?.isDefault}
                  className="mr-2 h-5 w-5 cursor-pointer"
                />
                Set as default shipping address
              </label>
            </div>

            <div>
              <ButtonPrimary
                type="submit"
                className="w-full bg-primary hover:opacity-90"
                disabled={isUpdating}
              >
                {editingAddress ? 'Update Address' : 'Add Address'}
              </ButtonPrimary>
            </div>
          </form>
        )}

        {isUpdating && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
            <SmallSpinner className="!text-white" />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default memo(AddressOption);
