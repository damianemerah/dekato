"use client";

import { useState, memo, useCallback } from "react";
import { Modal, message } from "antd";
import styles from "@/app/ui/inputStyle.module.css";
import { ButtonPrimary } from "../button";
import { updateUserAddress, createUserAddress } from "@/app/action/userAction";
import { useUserStore } from "@/store/store";
import { mutate } from "swr";
import EditIcon from "@/public/assets/icons/edit.svg";
import { SmallSpinner } from "@/app/ui/spinner";
import { InputType } from "@/app/ui/inputType";

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
        if (isDefault && typeof isDefault === "boolean") {
          const formData = new FormData();
          formData.append("addressId", data);
          formData.append("isDefault", isDefault);
          formData.append("userId", user.id);
          await updateUserAddress(formData);
          await mutate("/checkout-data");
          await mutate(`/api/user/${user.id}`);

          message.success("Address updated successfully");

          return;
        }
        data.append("userId", user.id);
        if (data.get("isDefault") === "on") {
          data.set("isDefault", "true");
        }
        await updateUserAddress(data);

        await mutate("/checkout-data");
        await mutate(`/api/user/${user.id}`);

        message.success("Address updated successfully");
      } catch (error) {
        console.error("Error updating address:", error);
        message.error("Failed to update address. Please try again.");
      } finally {
        setIsUpdating(false);
        setChangeAddress(false);
        setEditingAddress(null);
      }
    },
    [setChangeAddress, user?.id],
  );
  const handleCreateAddress = useCallback(
    async (formData) => {
      formData.append("userId", user.id);
      if (formData.get("isDefault") === "on") {
        formData.set("isDefault", true);
      }

      try {
        const res = await createUserAddress(formData);

        await mutate("/checkout-data");
        await mutate(`/api/user/${user.id}`);
        message.success("Address added successfully");
      } catch (error) {
        message.error("Failed to add address. Please try again.");
      } finally {
        setIsUpdating(false);
        setChangeAddress(false);
        setShowForm(false);
      }
    },
    [user?.id, setChangeAddress, setShowForm],
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
            className="mr-2 h-5 w-5 cursor-pointer appearance-none self-center rounded-full border border-gray-300 checked:border-primary checked:bg-primary checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-contain checked:bg-center checked:bg-no-repeat focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
          <div>
            <p className="font-semibold tracking-wide text-primary">
              {address.firstname} {address.lastname}
            </p>
            <p className="text-sm text-gray-600">{address.phone}</p>
            <p className="text-sm text-gray-600">{address.address}</p>
            <p className="text-sm text-gray-600">{`${address.city ? address.city + ", " : ""}${
              address.state ? address.state + ", " : ""
            }${address.country ? address.country : ""}`}</p>
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
    [handleUpdateAddress],
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
            {showForm ? "Cancel" : "Add New Address"}
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
                  className="mr-2 h-5 w-5 cursor-pointer appearance-none self-center rounded border border-gray-300 checked:border-primary checked:bg-primary checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-contain checked:bg-center checked:bg-no-repeat focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
        )}

        {isUpdating && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
            <SmallSpinner />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default memo(AddressOption);
