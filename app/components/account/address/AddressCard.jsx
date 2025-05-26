'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ButtonPrimary } from '@/app/components/button';
import { InputType } from '@/app/components/inputType';
import { Modal, message } from 'antd';
import {
  updateUserAddress,
  createUserAddress,
  getUserAddress,
  deleteUserAddress,
} from '@/app/action/userAction';
import { SmallSpinner } from '@/app/components/spinner';
import { Checkbox } from '@/app/components/ui/checkbox';
import EditIcon from '@/public/assets/icons/edit.svg';
import { useSession } from 'next-auth/react';
import DeleteIcon from '@/public/assets/icons/remove.svg';

export default function Address({ initialAddressData }) {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (initialAddressData) {
      setAddresses(initialAddressData);
    }
  }, [initialAddressData]);

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
          formData.append('userId', userId);
          const result = await updateUserAddress(formData);
          if (result?.error) {
            message.error(result.message || 'Failed to update address');
            return;
          }
          message.success('Address updated successfully');

          // Update local state
          setAddresses((prev) =>
            prev.map((addr) => ({
              ...addr,
              isDefault: addr.id === data,
            }))
          );

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

        message.success('Address updated successfully');

        // Refresh data by reusing initialAddressData
        const updatedData = await getUserAddress(userId);
        setAddresses(updatedData);
      } catch (error) {
        console.error('Error updating address:', error);
        message.error('Failed to update address. Please try again.');
      } finally {
        setIsUpdating(false);
        setShowForm(false);
        setEditingAddress(null);
      }
    },
    [userId]
  );

  const handleCreateAddress = useCallback(
    async (formData) => {
      formData.append('userId', userId);
      if (formData.get('isDefault') === 'on') {
        formData.set('isDefault', true);
      }

      try {
        const result = await createUserAddress(formData);
        if (result?.error) {
          message.error(result.message || 'Failed to add address');
          return;
        }

        message.success('Address added successfully');

        // Refresh data
        const updatedData = await getUserAddress(userId);
        setAddresses(updatedData);

        // Reset form by clearing all input fields
        formRef.current.reset();
      } catch (error) {
        message.error('Failed to add address. Please try again.');
      } finally {
        setIsUpdating(false);
        setShowForm(false);
      }
    },
    [userId]
  );

  const handleModalClose = useCallback(() => {
    setShowForm(false);
    setEditingAddress(null);
  }, []);

  const handleDeleteAddress = useCallback(
    async (addressId) => {
      setIsUpdating(true);
      if (!userId) {
        message.error('User ID is required to delete address');
        return;
      }
      if (!addressId) {
        message.error('Address ID is required to delete address');
        return;
      }
      try {
        console.log('Deleting address with ID:', addressId);
        const result = await deleteUserAddress(addressId);
        if (result?.error) {
          message.error(result.message || 'Failed to delete address');
          return;
        }
        message.success('Address deleted successfully');

        setAddresses((prev) =>
          prev.filter((address) => address.id !== addressId)
        );
      } catch (error) {
        console.error('Error deleting address:', error);
        message.error('Failed to delete address. Please try again.');
      } finally {
        setIsUpdating(false);
      }
    },
    [userId]
  );

  const renderAddressForm = () => (
    <Modal
      open={showForm}
      onCancel={handleModalClose}
      footer={null}
      width={600}
      className="address-modal"
    >
      <div className="relative">
        <h2 className="mb-6 text-xl font-semibold text-primary">
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </h2>

        <form
          ref={formRef}
          className="space-y-4"
          action={editingAddress ? handleUpdateAddress : handleCreateAddress}
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
              disabled={isUpdating}
            >
              {editingAddress ? 'Update Address' : 'Add Address'}
            </ButtonPrimary>
          </div>
        </form>

        {isUpdating && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
            <SmallSpinner />
          </div>
        )}
      </div>
    </Modal>
  );

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="space-y-4 md:col-span-2">
        <h2 className="font-oswald text-xl font-medium uppercase text-gray-700">
          My Addresses
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses?.map((address) => (
            <div
              key={address.id}
              className="relative flex items-center justify-between border border-gray-200 p-4 transition-all duration-300 hover:border-primary hover:shadow-sm"
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
                  }${address.postalCode ? address.postalCode : ''}`}</p>
                </div>
              </div>
              {address.isDefault && (
                <span className="absolute right-2 top-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  Default
                </span>
              )}
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <button
                  className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
                  onClick={() => {
                    setEditingAddress(address);
                    setShowForm(true);
                  }}
                >
                  <EditIcon className="h-4 w-4" />
                </button>
                <button
                  className="font-base rounded-full bg-gray-100 p-2 transition-colors hover:bg-red-100 hover:text-red-500"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <DeleteIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center md:col-span-2">
        <ButtonPrimary onClick={toggleForm} className="bg-primary">
          Add New Address
        </ButtonPrimary>
      </div>
      {renderAddressForm()}
    </div>
  );
}
