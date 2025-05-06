'use client';

import { ButtonPrimary, ButtonSecondary } from '@/app/components/button';
import { useSession } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { SmallSpinner } from '@/app/components/spinner';
import {
  updateSubscription,
  unsubscribeUser,
} from '@/app/action/subscriptionAction';
import useConfirmModal from '@/app/components/confirm-modal';
import { Checkbox } from '@/app/components/ui/checkbox';

export function NewsletterContent({ initialData }) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [subscription, setSubscription] = useState(initialData?.subscription);
  const [formData, setFormData] = useState({
    isSubscribed: initialData?.subscription?.status === 'subscribed',
    gender: initialData?.subscription?.gender || 'both',
  });

  const confirmModal = useConfirmModal();

  async function handleSubmit(e) {
    e.preventDefault();

    startTransition(async () => {
      try {
        const response = await updateSubscription(
          session?.user?.email,
          formData.isSubscribed ? 'subscribed' : 'unsubscribed',
          formData.gender
        );

        if (response.success) {
          toast.success(response.message);
          setSubscription(response.subscription);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error('Error updating subscription:', error);
        toast.error('Failed to update subscription preferences');
      }
    });
  }

  async function handleUnsubscribe() {
    confirmModal({
      title: 'Unsubscribe from Newsletter',
      content: 'Are you sure you want to unsubscribe from the newsletter?',
      async onOk() {
        setIsDeleting(true);
        try {
          const response = await unsubscribeUser(session?.user?.email);

          if (response.success) {
            toast.success('Successfully unsubscribed from newsletter');
            setSubscription(null);
            setFormData({
              isSubscribed: false,
              gender: 'both',
            });
          } else {
            throw new Error(response.message);
          }
        } catch (error) {
          console.error('Error unsubscribing:', error);
          toast.error('Failed to unsubscribe from newsletter');
        } finally {
          setIsDeleting(false);
        }
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="relative flex gap-x-3">
          <div className="flex h-6 items-center">
            <Checkbox
              id="newsletter"
              name="newsletter"
              checked={formData.isSubscribed}
              onCheckedChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isSubscribed: e,
                }))
              }
              className="mr-2 h-4 w-4 cursor-pointer"
              aria-label="Subscribe to newsletter"
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="newsletter" className="font-medium text-gray-900">
              Email Newsletter
            </label>
            <p className="text-gray-500">
              Receive updates about new products, sales, and exclusive offers
            </p>
          </div>
        </div>

        {formData.isSubscribed && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Preferences
            </label>
            <div
              className="space-y-2"
              role="radiogroup"
              aria-label="Newsletter preferences"
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="women"
                  name="gender"
                  value="women"
                  checked={formData.gender === 'women'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <label htmlFor="women">Women&apos;s fashion</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="men"
                  name="gender"
                  value="men"
                  checked={formData.gender === 'men'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <label htmlFor="men">Men&apos;s fashion</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="both"
                  name="gender"
                  value="both"
                  checked={formData.gender === 'both'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <label htmlFor="both">Both</label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <ButtonPrimary
          type="submit"
          disabled={isPending}
          className="bg-primary"
          aria-busy={isPending}
        >
          {isPending ? (
            <SmallSpinner className="!text-white" />
          ) : (
            'Save Changes'
          )}
        </ButtonPrimary>

        {subscription?.status === 'subscribed' && (
          <ButtonSecondary
            type="button"
            onClick={handleUnsubscribe}
            disabled={isDeleting}
            aria-busy={isDeleting}
          >
            {isDeleting ? (
              <SmallSpinner className="!text-white" />
            ) : (
              'Unsubscribe'
            )}
          </ButtonSecondary>
        )}
      </div>
    </form>
  );
}
