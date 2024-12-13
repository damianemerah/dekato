"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Modal, message } from "antd";
import { useSWRConfig } from "swr";
import { ButtonSecondary } from "@/app/ui/button";
import { SmallSpinner } from "@/app/ui/spinner";
import useUserData from "@/app/hooks/useUserData";
import useAddressData from "@/app/hooks/useAddressData";
import { InputType } from "@/app/ui/inputType";
import { updateUserInfo, updatePassword } from "@/app/action/userAction";

export default function Overview() {
  const { data: session, update: updateSession } = useSession();
  const userId = session?.user?.id;
  const { userData: user, isLoading: userIsLoading } = useUserData(userId);
  const { addressData: address } = useAddressData(userId);
  const defaultAddress = address?.find((address) => address.isDefault);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { mutate } = useSWRConfig();

  const handleEditClick = useCallback(() => setShowEditModal(true), []);
  const handlePasswordClick = useCallback(() => setShowPasswordModal(true), []);
  const handleDeleteAccountClick = useCallback(
    () => setShowDeleteAccountModal(true),
    [],
  );
  const handleModalClose = useCallback(() => {
    setShowEditModal(false);
    setShowPasswordModal(false);
    setShowDeleteAccountModal(false);
  }, []);

  const handleUpdateUserInfo = useCallback(
    async (formData) => {
      setIsUpdating(true);
      try {
        formData.append("userId", userId);
        const updatedUser = await updateUserInfo(formData);
        mutate(`/api/user/${userId}`, updatedUser, false);
        handleModalClose();
        message.success("User information updated successfully");
      } catch (error) {
        console.error("Failed to update user info:", error);
        message.error("Failed to update user info");
      } finally {
        setIsUpdating(false);
      }
    },
    [userId, mutate, handleModalClose],
  );

  const handleUpdatePassword = useCallback(
    async (formData) => {
      setIsUpdating(true);
      try {
        formData.append("userId", userId);
        const updatedUser = await updatePassword(formData);
        mutate(`/api/user/${userId}`, updatedUser, false);
        handleModalClose();
        message.success("Password updated successfully");
        await updateSession({ passwordChanged: true });
      } catch (error) {
        console.error("Failed to update password:", error);
        message.error("Failed to update password");
      } finally {
        setIsUpdating(false);
      }
    },
    [userId, mutate, handleModalClose, updateSession],
  );

  const handleDeleteAccount = useCallback(async () => {
    message.info("Account deletion functionality to be implemented");
    handleModalClose();
  }, [handleModalClose]);

  if (userIsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <SmallSpinner className="!text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-12">
        <section className="space-y-6">
          <h2
            className={`border-b pb-2 font-oswald text-2xl font-semibold text-primary sm:text-3xl`}
          >
            Account Information
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-4">
              <h3
                className={`font-oswald text-xl font-medium uppercase text-gray-700`}
              >
                Contact Information
              </h3>
              <div className="rounded-lg bg-grayBg p-4">
                <p className="text-lg font-medium">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-gray-600">{user?.email}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleEditClick}
                >
                  Edit name
                </button>
                <button
                  className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handlePasswordClick}
                >
                  Change password
                </button>
                <button
                  className="text-red-500 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={handleDeleteAccountClick}
                >
                  Delete account
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <h3
                className={`font-oswald text-xl font-medium uppercase text-gray-700`}
              >
                Newsletter
              </h3>
              <div className="rounded-lg bg-grayBg p-4">
                <p>You are not subscribed to our newsletter.</p>
              </div>
              <Link href="/account/newsletter" className="inline-block">
                <ButtonSecondary className="border-2 border-primary bg-white font-oswald text-sm text-primary transition-colors duration-300 hover:bg-primary hover:text-white">
                  Edit subscription
                </ButtonSecondary>
              </Link>
            </div>
          </div>
        </section>
        <section className="space-y-6">
          <h2
            className={`border-b pb-2 font-oswald text-2xl font-semibold text-primary sm:text-3xl`}
          >
            Address Book
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {defaultAddress ? (
              <div className="space-y-4">
                <h3
                  className={`font-oswald text-xl font-medium uppercase text-gray-700`}
                >
                  Shipping Address
                </h3>
                <div className="rounded-lg bg-grayBg p-4">
                  <p className="mb-2 font-medium">
                    Your default shipping address:
                  </p>
                  <address className="not-italic">
                    <p>
                      {defaultAddress?.firstname} {defaultAddress?.lastname}
                    </p>
                    <p>{defaultAddress?.address}</p>
                    <p>
                      {defaultAddress?.city}
                      {defaultAddress?.state && defaultAddress?.city
                        ? ", "
                        : ""}
                      {defaultAddress?.state}
                      {(defaultAddress?.state || defaultAddress?.city) &&
                      defaultAddress?.postalCode
                        ? " "
                        : ""}
                      {defaultAddress?.postalCode}
                    </p>
                    <p>{defaultAddress?.phone}</p>
                  </address>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3
                  className={`font-oswald text-xl font-medium uppercase text-gray-700`}
                >
                  Shipping Address
                </h3>
                <p>No default shipping address found.</p>
                <ButtonSecondary>Add Address</ButtonSecondary>
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal
        open={showEditModal}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        className="edit-modal"
      >
        <div className="p-6">
          <h2 className={`mb-6 font-oswald text-xl font-semibold text-primary`}>
            Edit Name
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateUserInfo(new FormData(e.target));
            }}
            className="space-y-4"
          >
            <InputType
              name="firstname"
              label="First name"
              required={true}
              defaultValue={user?.firstname || ""}
            />
            <InputType
              name="lastname"
              label="Last name"
              required={true}
              defaultValue={user?.lastname || ""}
            />
            <ButtonSecondary
              type="submit"
              className="w-full"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <SmallSpinner className="!text-primary" />
              ) : (
                "Save Changes"
              )}
            </ButtonSecondary>
          </form>
        </div>
      </Modal>

      <Modal
        open={showPasswordModal}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        className="password-modal"
      >
        <div className="p-6">
          <h2 className={`mb-6 font-oswald text-xl font-semibold text-primary`}>
            Change Password
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdatePassword(new FormData(e.target));
            }}
            className="space-y-4"
          >
            <InputType
              name="currentPassword"
              label="Current Password"
              type="password"
              required={true}
            />
            <InputType
              name="password"
              label="New Password"
              type="password"
              required={true}
            />
            <InputType
              name="passwordConfirm"
              label="Confirm New Password"
              type="password"
              required={true}
            />
            <ButtonSecondary type="submit" className="w-full">
              Change Password
            </ButtonSecondary>
          </form>
        </div>
      </Modal>

      <Modal
        open={showDeleteAccountModal}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        className="delete-account-modal"
      >
        <div className="p-6">
          <h2 className={`mb-6 font-oswald text-xl font-semibold text-primary`}>
            Delete Account
          </h2>
          <p className="mb-4 text-red-600">
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <ButtonSecondary
            onClick={handleDeleteAccount}
            className="w-full"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <SmallSpinner className="!text-primary" />
            ) : (
              "Confirm Delete Account"
            )}
          </ButtonSecondary>
        </div>
      </Modal>
    </main>
  );
}
