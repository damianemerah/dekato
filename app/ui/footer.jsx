"use client";

import * as React from "react";
import Checkmark from "@/public/assets/icons/check.svg?url";
import Paystack from "@/public/assets/icons/paystack.svg";
import FacebookIcon from "@/public/assets/icons/Facebook.svg";
import InstagramIcon from "@/public/assets/icons/Instagram.svg";
import WhatsappIcon from "@/public/assets/icons/whatsapp.svg";
import TiktokIcon from "@/public/assets/icons/tiktok.svg";
import { oswald, roboto } from "@/style/font";
import { Button } from "./button";
import Link from "next/link";

export default function Footer() {
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [formError, setFormError] = React.useState("");

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
    <footer className="bg-primary text-white">
      <div className="bg-grayBg px-4 py-12 text-primary sm:px-8 sm:py-24">
        <div className="mx-auto max-w-xl px-4">
          <div className="flex flex-col items-center justify-center">
            <h2
              className="text-center font-oswald text-3xl font-bold leading-none tracking-tight md:text-4xl"
              style={{
                wordSpacing: "0.05em",
              }}
            >
              join us & save 20% off + free shipping
            </h2>
            <p className="mb-5 mt-2.5 text-center text-[13px] text-gray-600">
              Join our newsletter and get monthly updates on new releases,
              promos and exclusive deals{" "}
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
                        <div
                          key={option.id}
                          className="flex items-center gap-2"
                        >
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
      <div className="bg-neutral-300 py-6 text-primary sm:py-10">
        <div className="mx-auto grid max-w-screen-lg gap-4 px-4 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
          {[
            "Quality Assurance",
            "Free Shipping",
            "Secure Payment",
            "Customer Support",
          ].map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkmark width={26} height={26} />
              <p className="text-sm md:text-base lg:text-lg">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-10 pt-12 sm:px-8 sm:pt-20">
        <div className="flex flex-col justify-center gap-8 md:flex-row md:gap-28">
          <div className="flex flex-col gap-7">
            <h3 className="text-sm font-semibold md:text-base">Menu</h3>
            <nav className="flex flex-col gap-4 font-roboto text-sm font-medium leading-6 text-neutral-400">
              {[
                {
                  href: "/customer-service",
                  text: "Frequently Asked Questions",
                },
                { href: "#", text: "About Us" },
                { href: "#", text: "Contact us" },
                { href: "#", text: "Terms of Sale" },
                { href: "#", text: "Blog" },
              ].map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  className="text-sm hover:text-white"
                >
                  {link.text}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-7">
            <h3 className="text-sm font-semibold md:text-base">Contact us</h3>
            <address
              className={`${roboto.className} flex flex-col gap-4 text-sm font-medium not-italic leading-6 text-neutral-400`}
            >
              <div>
                <p className="font-oswald text-sm text-white">Address</p>
                <p className="text-sm hover:text-white">
                  30A Oseni Street, Anthony Village <br />
                  Opposite GTB, Lagos
                </p>
              </div>
              <div>
                <p className="font-oswald text-sm text-white">Phone</p>
                <p className="text-sm hover:text-white">(234) 802 3024 687</p>
                <p className="text-sm hover:text-white">(234) 806 4737 122</p>
              </div>
              <div>
                <p className="font-oswald text-sm text-white">Email</p>
                <a
                  href="mailto:Mail@Dekato-outfit.com"
                  className="text-sm hover:text-white"
                >
                  Mail@Dekato-outfit.com
                </a>
              </div>
              <div>
                <p className="font-oswald text-sm text-white">
                  Working Days/Hours
                </p>
                <p className="text-sm hover:text-white">
                  Mon - Sat / 8am - 8pm
                </p>
              </div>
            </address>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 px-8 py-6">
        {[FacebookIcon, InstagramIcon, WhatsappIcon, TiktokIcon].map(
          (Icon, index) => (
            <a
              key={index}
              href="#"
              className="rounded-full bg-secondary p-2 transition-colors hover:bg-neutral-400"
            >
              <Icon width={21} height={21} className="text-white" />
            </a>
          ),
        )}
      </div>

      <div className="flex items-center justify-center gap-2 px-8 py-6">
        <p className="text-xs italic text-white/70">Secured by</p>
        <Paystack width={123.48} height={22} />
      </div>

      <div className="flex justify-center border-t border-gray-700 px-4 py-4 text-center text-sm text-neutral-400 sm:px-10">
        <p className={roboto.className}>© 2024 dekato-outfit.com</p>
      </div>
    </footer>
  );
}
