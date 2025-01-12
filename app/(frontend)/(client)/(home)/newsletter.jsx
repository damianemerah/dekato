"use client";

import { useState } from "react";
import { oswald } from "@/style/font";
import { Button } from "@/app/ui/button";

export default function Newsletter() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [formError, setFormError] = useState("");

  async function subscribeToNewsletter(formData) {
    setFormError("");
    const email = formData.get("newsletter");
    const gender = formData.get("gender");

    if (!email || !gender) {
      setFormError("Please fill in all required fields");
      return;
    }

    const res = await fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email, gender }),
    });

    const data = await res.json();

    if (data.success) {
      setIsSubscribed(true);
    }
  }
  return (
    <div className="bg-grayBg px-4 py-12 text-primary sm:px-8 sm:py-24">
      <div className="mx-auto max-w-xl px-4">
        <div className="flex flex-col items-center justify-center">
          <h2
            className={`text-center ${oswald.className} text-3xl font-bold leading-none tracking-tight md:text-4xl`}
            style={{
              wordSpacing: "0.05em",
            }}
          >
            join us & save 20% off + free shipping
          </h2>
          <p className="mb-5 mt-2.5 text-center text-[13px] text-gray-600">
            Join our newsletter and get monthly updates on new releases, promos
            and exclusive deals{" "}
            <span className="font-semibold">
              for all new G-Star newsletter subscribers
            </span>
          </p>

          {!isSubscribed ? (
            <form className="w-full" action={subscribeToNewsletter}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <p className="text-[13px] font-semibold">
                    Preferences <span className="text-red-500">*</span>
                  </p>
                  <div className="flex flex-col gap-6 sm:flex-row">
                    {[
                      { id: "men", label: "Men's fashion" },
                      { id: "women", label: "Women's fashion" },
                    ].map((option) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={option.id}
                          name="gender"
                          value={option.id}
                          className="h-5 w-5 accent-primary"
                          required
                        />
                        <label className="text-[13px]" htmlFor={option.id}>
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="newsletter"
                    className="text-[13px] font-semibold"
                  >
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <input
                      type="email"
                      name="newsletter"
                      id="newsletter"
                      className="flex-1 border border-gray-300 px-4 py-3 text-primary placeholder:text-gray-400"
                      placeholder="Enter your e-mail address"
                      required
                    />
                    <Button
                      className="w-full bg-neutral-800 px-8 py-3 text-center text-white hover:bg-neutral-700 sm:w-auto"
                      type="submit"
                    >
                      subscribe
                    </Button>
                  </div>

                  {formError && (
                    <p
                      className="text-sm text-red-500"
                      role="alert"
                      aria-live="polite"
                    >
                      {formError}
                    </p>
                  )}
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center" role="alert">
              <p className="text-lg font-semibold">Good to have you back!</p>
              <p className="text-sm">
                You&apos;ve been added to our mailing list again. You will now
                always enjoy free shipping.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
