"use client";

import { roboto, oswald } from "@/style/font";
import Paystack from "@/public/assets/icons/paystack.svg";
import FacebookIcon from "@/public/assets/icons/Facebook.svg";
import InstagramIcon from "@/public/assets/icons/Instagram.svg";
import WhatsappIcon from "@/public/assets/icons/whatsapp.svg";
import TiktokIcon from "@/public/assets/icons/tiktok.svg";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={`${roboto.className} bg-primary text-white`}>
      <div className="px-4 pb-10 pt-12 sm:px-8 sm:pt-20">
        <div className="flex flex-col justify-center gap-8 md:flex-row md:gap-28">
          <div className="flex flex-col gap-7">
            <h3 className="font-oswald text-sm font-semibold md:text-base">
              Menu
            </h3>
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
            <h3 className="font-oswald text-sm font-semibold md:text-base">
              Contact us
            </h3>
            <address className="flex flex-col gap-4 font-roboto text-sm font-medium not-italic leading-6 text-neutral-400">
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
        <p className="font-roboto">© 2024 dekato-outfit.com</p>
      </div>
    </footer>
  );
}
