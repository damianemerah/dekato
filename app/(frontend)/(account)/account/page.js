"use client";

import { useState, useCallback } from "react";
import { ButtonSecondary } from "@/app/ui/button";
import { SmallSpinner } from "@/app/ui/spinner";
import { oswald } from "@/style/font";
import useUserData from "@/app/ui/useUserData";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Modal, message } from "antd";
import { InputType } from "@/app/ui/inputType";
import {
  updateUserInfo,
  sendPasswordResetToken,
  updatePassword,
} from "@/app/action/userAction";
import { useSWRConfig } from "swr";

export default function Overview() {
  const { data: session, update: updateSession } = useSession();
  const userId = session?.user?.id;
  const {
    userData: user,
    isLoading: userIsLoading,
    isValidating,
  } = useUserData(userId);
  const defaultAddress = user?.address?.find((address) => address.isDefault);
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

  const handleForgetPassword = useCallback(
    async (formData) => {
      setIsUpdating(true);
      try {
        await sendPasswordResetToken(formData);
        handleModalClose();
        message.success("Password reset link sent to your email");
      } catch (error) {
        console.error("Failed to send password reset token:", error);
        message.error("Failed to send password reset token");
      } finally {
        setIsUpdating(false);
      }
    },
    [handleModalClose],
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

        // Update session and sign out
        await updateSession({ passwordChanged: true });
        signOut({ callbackUrl: "/signin" });
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
    // Implement account deletion logic here
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
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      {isValidating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <SmallSpinner className="!text-primary" />
        </div>
      )}
      <div className="space-y-12">
        <section className="space-y-6">
          <h2
            className={`${oswald.className} border-b pb-2 text-3xl font-semibold text-primary`}
          >
            Account Information
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3
                className={`${oswald.className} text-xl font-medium uppercase text-gray-700`}
              >
                Contact Information
              </h3>
              <div className="rounded-md bg-gray-50 p-4 shadow-sm">
                <p className="text-lg font-medium">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-gray-600">{user?.email}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <ButtonSecondary onClick={handleEditClick}>
                  Edit Name
                </ButtonSecondary>
                <ButtonSecondary onClick={handlePasswordClick}>
                  Change Password
                </ButtonSecondary>
                <ButtonSecondary
                  onClick={handleDeleteAccountClick}
                  className="text-red-500"
                >
                  Delete Account
                </ButtonSecondary>
              </div>
            </div>
            <div className="space-y-4">
              <h3
                className={`${oswald.className} text-xl font-medium uppercase text-gray-700`}
              >
                Newsletter
              </h3>
              <div className="rounded-md bg-gray-50 p-4 shadow-sm">
                <p>You are not subscribed to our newsletter.</p>
              </div>
              <Link href="/account/newsletter" className="block">
                <ButtonSecondary className="w-full">
                  Edit Subscription
                </ButtonSecondary>
              </Link>
            </div>
          </div>
        </section>
        <section className="space-y-6">
          <h2
            className={`${oswald.className} border-b pb-2 text-3xl font-semibold text-primary`}
          >
            Address Book
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3
                className={`${oswald.className} text-xl font-medium uppercase text-gray-700`}
              >
                Shipping Address
              </h3>
              <div className="rounded-md bg-gray-50 p-4 shadow-sm">
                <p className="mb-2 font-medium">
                  Your default shipping address:
                </p>
                <address className="not-italic">
                  <p>
                    {defaultAddress?.firstname} {defaultAddress?.lastname}
                  </p>
                  <p>{defaultAddress?.address}</p>
                  <p>
                    {defaultAddress?.city}, {defaultAddress?.state}{" "}
                    {defaultAddress?.postalCode}
                  </p>
                  <p>{defaultAddress?.phone}</p>
                </address>
              </div>
            </div>
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
        <div className="relative">
          <h2 className="mb-6 text-xl font-semibold text-primary">Edit Name</h2>
          <form action={handleUpdateUserInfo} className="mt-6 space-y-4">
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
        <div className="relative">
          <h2 className="mb-6 text-xl font-semibold text-primary">
            Change Password
          </h2>
          <form action={handleUpdatePassword} className="mt-6 space-y-4">
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
        <div className="relative">
          <h2 className="mb-6 text-xl font-semibold text-primary">
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
    </div>
  );
}
