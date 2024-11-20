"use client";

import { ButtonPrimary, ButtonSecondary } from "@/app/ui/button";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { message } from "antd";
import { SmallSpinner } from "@/app/ui/spinner";

import useConfirmModal from "@/app/ui/confirm-modal";

export function NewsletterContent({ initialData }) {
  console.log(initialData, "initialData🔥🔥");
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [subscription, setSubscription] = useState(initialData?.subscription);
  const [formData, setFormData] = useState({
    isSubscribed: initialData?.subscription?.status === "subscribed",
    gender: initialData?.subscription?.gender || "both",
  });

  if (subscription) console.log(subscription);

  const confirmModal = useConfirmModal();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          status: formData.isSubscribed ? "subscribed" : "unsubscribed",
          gender: formData.gender,
        }),
      });

      const data = await response.json();

      if (data.success) {
        message.success(data.message);

        setSubscription(data.subscription);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      message.error("Failed to update subscription preferences");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUnsubscribe() {
    confirmModal({
      title: "Unsubscribe from Newsletter",
      content: "Are you sure you want to unsubscribe from the newsletter?",
      async onOk() {
        setIsDeleting(true);
        try {
          const response = await fetch("/api/subscribe", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: session?.user?.email,
            }),
          });

          const data = await response.json();

          if (data.success) {
            message.success("Subscription deleted successfully");
            setSubscription(null);
            setFormData({
              isSubscribed: false,
              gender: "both",
            });
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.error("Error deleting subscription:", error);
          message.error("Failed to delete subscription");
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
            <input
              id="newsletter"
              name="newsletter"
              type="checkbox"
              checked={formData.isSubscribed}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isSubscribed: e.target.checked,
                }))
              }
              className="h-4 w-4 text-primary focus:ring-primary"
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
                  checked={formData.gender === "women"}
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
                  checked={formData.gender === "men"}
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
                  checked={formData.gender === "both"}
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
          disabled={isSubmitting}
          className="bg-primary"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <SmallSpinner className="!text-white" />
          ) : (
            "Save Changes"
          )}
        </ButtonPrimary>

        {subscription?.status === "subscribed" && (
          <ButtonSecondary
            type="button"
            onClick={handleUnsubscribe}
            disabled={isDeleting}
            aria-busy={isDeleting}
          >
            {isDeleting ? (
              <SmallSpinner className="!text-white" />
            ) : (
              "Unsubscribe"
            )}
          </ButtonSecondary>
        )}
      </div>
    </form>
  );
}
