'use client';

import { useState, useCallback, useTransition } from 'react';
import { Modal, message } from 'antd';
import { ButtonPrimary } from '@/app/components/button';
import {
  updateUserAddress,
  createUserAddress,
  getUserAddress,
} from '@/app/action/userAction';
import EditIcon from '@/public/assets/icons/edit.svg';
import { SmallSpinner } from '@/app/components/spinner';
import { Checkbox } from '@/app/components/ui/checkbox';
import { InputType } from '@/app/components/inputType';

export default function AddressManager({
  userId,
  addresses,
  changeAddress,
  setChangeAddress,
  onAddressUpdate,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleForm = useCallback(() => {
    setShowForm((prev) => !prev);
    setEditingAddress(null);
  }, []);

  const handleUpdateAddress = useCallback(
    (data, isDefault) => {
      setIsUpdating(true);
      startTransition(async () => {
        try {
          if (isDefault && typeof isDefault === 'boolean') {
            const formData = new FormData();
            formData.append('addressId', data);
            formData.append('isDefault', isDefault);
            formData.append('userId', userId);
            const result = await updateUserAddress(formData);
            if (result?.error) {
              setIsUpdating(false);
              message.error(result.message || 'Failed to update address');
              return;
            }

            // Fetch updated address data and pass it to parent
            const updatedData = await getUserAddress(userId);
            onAddressUpdate(updatedData);

            message.success('Address updated successfully');
            return;
          }

          data.append('userId', userId);
          if (data.get('isDefault') === 'on') {
            data.set('isDefault', 'true');
          }
          const result = await updateUserAddress(data);
          if (result?.error) {
            message.error(result.message || 'Failed to update address');
            return;
          }
          // Fetch updated address data and pass it to parent
          const updatedData = await getUserAddress(userId);
          onAddressUpdate(updatedData);

          message.success('Address updated successfully');
        } catch (error) {
          console.error('Error updating address:', error);
          message.error('Failed to update address. Please try again.');
        } finally {
          setIsUpdating(false);
          setChangeAddress(false);
          setEditingAddress(null);
        }
      });
    },
    [setChangeAddress, userId, onAddressUpdate]
  );

  const handleCreateAddress = useCallback(
    (formData) => {
      setIsUpdating(true);
      startTransition(async () => {
        try {
          formData.append('userId', userId);
          if (formData.get('isDefault') === 'on') {
            formData.set('isDefault', true);
          }

          const result = await createUserAddress(formData);
          if (result?.error) {
            setIsUpdating(false);
            message.error(result.message || 'Failed to add address');
            return;
          }

          // Fetch updated address data and pass it to parent
          const updatedData = await getUserAddress(userId);
          onAddressUpdate(updatedData);

          message.success('Address added successfully');
        } catch (error) {
          message.error('Failed to add address. Please try again.');
        } finally {
          setIsUpdating(false);
          setChangeAddress(false);
          setShowForm(false);
        }
      });
    },
    [userId, setChangeAddress, setShowForm, onAddressUpdate]
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
            {showForm ? 'Cancel' : 'Add New Address'}
          </ButtonPrimary>
        </div>

        {showForm && (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              if (editingAddress) {
                handleUpdateAddress(formData);
              } else {
                handleCreateAddress(formData);
              }
            }}
          >
            {editingAddress && (
              <input type="hidden" name="addressId" value={editingAddress.id} />
            )}
            <input type="hidden" name="userId" value={userId} />
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

            <div className="flex h-full items-center justify-center">
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
                disabled={isUpdating || isPending}
              >
                {isUpdating || isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <SmallSpinner className="h-5 w-5" />
                    <span>{editingAddress ? 'Updating...' : 'Adding...'}</span>
                  </div>
                ) : (
                  <span>
                    {editingAddress ? 'Update Address' : 'Add Address'}
                  </span>
                )}
              </ButtonPrimary>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
