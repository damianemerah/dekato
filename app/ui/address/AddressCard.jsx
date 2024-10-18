"use client";

import { useState, useCallback } from "react";
import { ButtonPrimary } from "@/app/ui/button";
import { oswald } from "@/style/font"
import { InputType } from "@/app/ui/inputType";
import { Modal, message } from "antd";
import { updateUserAddress, createUserAddress } from "@/app/action/userAction";
import { mutate } from "swr";
import { SmallSpinner } from "@/app/ui/spinner";
import EditIcon from "@/public/assets/icons/edit.svg";
import useAddressData from "@/app/hooks/useAddressData";
import { useSession } from "next-auth/react";

export default function Address() {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  console.log(userId, "userId");
  const { addressData: addresses, isLoading: AddressIsLoading } =
    useAddressData(userId);

  const toggleForm = useCallback(() => {
    setShowForm((prev) => !prev);
    setEditingAddress(null);
  }, []);

  const handleUpdateAddress = useCallback(
    async (data, isDefault) => {
      setIsUpdating(true);
      try {
        if (isDefault && typeof isDefault === "boolean") {
          const formData = new FormData();
          formData.append("addressId", data);
          formData.append("isDefault", isDefault);
          formData.append("userId", userId);
          await updateUserAddress(formData);
          await mutate("/checkout-data");
          await mutate(`/api/user/${userId}`);
          await mutate(`/api/userAddress/${userId}`);
          message.success("Address updated successfully");

          return;
        }
        data.append("userId", userId);
        if (data.get("isDefault") === "on") {
          data.set("isDefault", "true");
        }
        await updateUserAddress(data);

        await mutate("/checkout-data");
        await mutate(`/api/user/${userId}`);
        await mutate(`/api/userAddress/${userId}`);
        message.success("Address updated successfully");
      } catch (error) {
        console.error("Error updating address:", error);
        message.error("Failed to update address. Please try again.");
      } finally {
        setIsUpdating(false);
        setShowForm(false);
        setEditingAddress(null);
      }
    },
    [userId],
  );

  const handleCreateAddress = useCallback(
    async (formData) => {
      formData.append("userId", userId);
      if (formData.get("isDefault") === "on") {
        formData.set("isDefault", true);
      }

      try {
        await createUserAddress(formData);

        await mutate("/checkout-data");
        await mutate(`/api/user/${userId}`);
        await mutate(`/api/userAddress/${userId}`);

        message.success("Address added successfully");
      } catch (error) {
        message.error("Failed to add address. Please try again.");
      } finally {
        setIsUpdating(false);
        setShowForm(false);
      }
    },
    [userId],
  );

  const handleModalClose = useCallback(() => {
    setShowForm(false);
    setEditingAddress(null);
  }, []);

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
          {editingAddress ? "Edit Address" : "Add New Address"}
        </h2>

        <form
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
              value={editingAddress?.firstname || ""}
            />
            <InputType
              name="lastname"
              label="Last name"
              required={true}
              value={editingAddress?.lastname || ""}
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
              value={editingAddress?.phone || ""}
            />
          </div>

          <InputType
            name="address"
            label="Delivery Address"
            required={true}
            value={editingAddress?.address || ""}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <InputType
              name="city"
              label="City"
              required={true}
              value={editingAddress?.city || ""}
            />
            <InputType
              name="state"
              label="State"
              required={true}
              value={editingAddress?.state || ""}
            />
          </div>
          <InputType
            name="postalCode"
            label="Postal code"
            required={true}
            value={editingAddress?.postalCode || ""}
          />

          <div className="text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                defaultChecked={editingAddress?.isDefault}
                className="mr-2 h-5 w-5 cursor-pointer appearance-none self-center rounded border border-gray-300 checked:border-primary checked:bg-primary checked:bg-contain checked:bg-center checked:bg-no-repeat focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
              {editingAddress ? "Update Address" : "Add Address"}
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
        <h2 className={`${oswald.className} text-2xl`}>My Addresses</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses?.map((address) => (
            <div
              key={address.id}
              className="relative flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all duration-300 hover:border-primary hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  checked={address.isDefault}
                  onChange={() => handleUpdateAddress(address.id, true)}
                  className="mr-2 h-5 w-5 cursor-pointer appearance-none self-center rounded-full border border-gray-300 checked:border-primary checked:bg-primary checked:bg-contain checked:bg-center checked:bg-no-repeat focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
                <div>
                  <p className="font-semibold tracking-wide text-primary">
                    {address.firstname} {address.lastname}
                  </p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  <p className="text-sm text-gray-600">{address.address}</p>
                  <p className="text-sm text-gray-600">{`${address.city ? address.city + ", " : ""}${
                    address.state ? address.state + ", " : ""
                  }${address.postalCode ? address.postalCode : ""}`}</p>
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
