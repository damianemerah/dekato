'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { updateUserInfo, updatePassword } from '@/app/action/userAction';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useUserStore } from '@/app/store/store';

export default function AccountSettings({ initialUserData }) {
  const { data: session, update: updateSession } = useSession();
  const userId = session?.user?.id;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [visible, setVisible] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const handleEditClick = useCallback(() => setShowEditModal(true), []);
  const handlePasswordClick = useCallback(() => setShowPasswordModal(true), []);
  const handleDeleteAccountClick = useCallback(
    () => setShowDeleteAccountModal(true),
    []
  );

  const handleModalClose = useCallback(() => {
    setShowEditModal(false);
    setShowPasswordModal(false);
    setShowDeleteAccountModal(false);
  }, []);

  const handleUpdateUserInfo = useCallback(
    async (e) => {
      e.preventDefault();
      setIsUpdating(true);

      try {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('firstname', e.target.firstname.value);
        formData.append('lastname', e.target.lastname.value);

        const updatedUser = await updateUserInfo(formData);
        if (updatedUser?.error) {
          toast.error('Update failed', {
            description: updatedUser.message || 'Failed to update user info',
          });
          return;
        }
        handleModalClose();

        toast.success('Profile updated', {
          description:
            'Your profile information has been updated successfully.',
        });
      } catch (error) {
        console.error('Failed to update user info:', error);
        toast.error('Update failed', {
          description: 'There was a problem updating your profile.',
        });
      } finally {
        setIsUpdating(false);
      }
    },
    [userId, handleModalClose]
  );

  const handleUpdatePassword = useCallback(
    async (e) => {
      e.preventDefault();
      setIsUpdating(true);

      try {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('currentPassword', e.target.currentPassword.value);
        formData.append('password', e.target.password.value);
        formData.append('passwordConfirm', e.target.passwordConfirm.value);

        const updatedUser = await updatePassword(formData);
        if (updatedUser?.error) {
          toast.error('Update failed', {
            description: updatedUser.message || 'Failed to update password',
          });
          return;
        }
        handleModalClose();

        toast.success('Password updated', {
          description: 'Your password has been changed successfully.',
        });

        await updateSession({ passwordChanged: true });
        setUser(null);

        await signOut({ callbackUrl: '/signin' });
      } catch (error) {
        console.error('Failed to update password:', error);
        toast.error('Update failed', {
          description: 'There was a problem updating your password.',
        });
      } finally {
        setIsUpdating(false);
      }
    },
    [userId, handleModalClose, updateSession, setUser]
  );

  const handleDeleteAccount = useCallback(async () => {
    toast('Not implemented', {
      description: 'Account deletion functionality is not yet implemented.',
    });
    handleModalClose();
  }, [handleModalClose]);

  const handleLogout = useCallback(async () => {
    await signOut({ callbackUrl: '/signin' });
  }, []);

  return (
    <div className="mx-auto py-8">
      <div className="space-y-8">
        <section className="rounded-lg border bg-white p-4 shadow-sm md:p-8">
          <h2 className="mb-6 font-oswald text-2xl font-medium">
            Account Settings
          </h2>

          <div className="mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Profile Information</h3>
              <p className="text-gray-600">
                Update your account&apos;s profile information.
              </p>
            </div>

            <div className="mb-6 rounded-md bg-gray-50 p-4">
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1 block text-sm font-medium text-gray-700">
                    First Name
                  </Label>
                  <div className="text-gray-900">
                    {initialUserData?.firstname || 'Not set'}
                  </div>
                </div>
                <div>
                  <Label className="mb-1 block text-sm font-medium text-gray-700">
                    Last Name
                  </Label>
                  <div className="text-gray-900">
                    {initialUserData?.lastname || 'Not set'}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <Label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="text-gray-900">{initialUserData?.email}</div>
              </div>
              <Button
                variant="outline"
                onClick={handleEditClick}
                className="mt-2"
              >
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Security</h3>
              <p className="text-gray-600">
                Update your password and manage account security.
              </p>
            </div>

            <div className="space-y-4">
              <Button variant="outline" onClick={handlePasswordClick}>
                Change Password
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
              <p className="text-gray-600">Permanently delete your account.</p>
            </div>

            <div className="flex space-x-4">
              <Button variant="destructive" onClick={handleDeleteAccountClick}>
                Delete Account
              </Button>

              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-oswald text-xl text-primary">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateUserInfo}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="firstname">First name</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  defaultValue={initialUserData?.firstname || ''}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Last name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  defaultValue={initialUserData?.lastname || ''}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-oswald text-xl text-primary">
              Change Password
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdatePassword}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {visible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                {/* <Input id="password" name="password" type="password" required /> */}
                <div className="relative">
                  <Input
                    type={visible ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pr-10"
                    required
                    id="password"
                    name="password"
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {visible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="passwordConfirm">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type={visible ? 'text' : 'password'}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {visible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={showDeleteAccountModal}
        onOpenChange={setShowDeleteAccountModal}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-oswald text-xl text-red-600">
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Please type <strong>delete</strong> to confirm.
            </p>
            <Input className="mt-2" placeholder="delete" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
