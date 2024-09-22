import * as React from "react";
import Checkmark from "@/public/assets/icons/check.svg?url";
import Paystack from "@/public/assets/icons/paystack.svg";
import FacebookIcon from "@/public/assets/icons/Facebook.svg";
import InstagramIcon from "@/public/assets/icons/Instagram.svg";
import WhatsappIcon from "@/public/assets/icons/whatsapp.svg";
import { oswald, roboto } from "@/style/font";
import Logo from "./dekato-logo";
import { Button } from "./button";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Top Section */}
      <div className={`bg-neutral-300 py-10 text-black ${oswald.className}`}>
        <div className="mx-auto grid max-w-screen-lg items-center justify-center gap-6 px-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center space-x-2">
            <Checkmark width={26} height={26} />
            <p>Quality Assurance</p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkmark width={26} height={26} />
            <p>Free Shipping</p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkmark width={26} height={26} />
            <p>Secure Payment</p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkmark width={26} height={26} />
            <p>Customer Support</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-8 py-20">
        <div
          className={`${oswald.className} flex w-full flex-col justify-center space-y-10 uppercase sm:flex-col sm:space-y-10 md:flex-col md:space-y-10 lg:flex-row lg:space-x-20 lg:space-y-0`}
        >
          {/* Features */}
          <div className="flex flex-col space-y-7">
            <h3 className="font-semibold">Features</h3>
            <div className="footer_items">
              <a href="#" className="hover:text-white">
                Men
              </a>
              <a href="#" className="hover:text-white">
                Women
              </a>
              <a href="#" className="hover:text-white">
                Boys
              </a>
              <a href="#" className="hover:text-white">
                Girls
              </a>
              <a href="#" className="hover:text-white">
                New Arrvials
              </a>
              <a href="#" className="hover:text-white">
                Shoes
              </a>
              <a href="#" className="hover:text-white">
                Clothes
              </a>
              <a href="#" className="hover:text-white">
                Accessories
              </a>
            </div>
          </div>
          {/* Menu */}
          <div className="flex flex-col space-y-7">
            <h3 className="font-semibold">Menu</h3>
            <div className="footer_items">
              <a href="#" className="hover:text-white">
                About Us
              </a>
              <a href="#" className="font-thin hover:text-white">
                Contact us
              </a>
              <a href="#" className="hover:text-white">
                My Account
              </a>
              <a href="#" className="hover:text-white">
                Order history
              </a>
              <a href="#" className="hover:text-white">
                My wishlist
              </a>
              <a href="#" className="hover:text-white">
                Blog
              </a>
              <a href="#" className="hover:text-white">
                Login
              </a>
            </div>
          </div>
          {/* Contact Information */}
          <div className="flex flex-col space-y-7">
            <h3 className="font-semibold">Contact us</h3>
            <div className="footer_items">
              <div className="flex flex-col">
                <p className={`${oswald.className} text-white`}>Address</p>
                <p className="hover:text-white">
                  30A Oseni Street, Anthony Village <br />
                  Oposite GTB, Lagos
                </p>
              </div>
              <div className="flex flex-col">
                <p className={`${oswald.className} text-white`}>Phone</p>
                <p className="hover:text-white">(234) 802 3024 687</p>
                <p className="hover:text-white">(234) 806 4737 122</p>
              </div>
              <div className="flex flex-col">
                <p className={`${oswald.className} text-white`}>Email</p>
                <p className="hover:text-white">Mail@Dekato-outfit.com</p>
              </div>
              <div className="flex flex-col">
                <p className={`${oswald.className} text-white`}>
                  Working Days/Hours
                </p>
                <p className="hover:text-white">Mon - Sat / 8am - 8pm</p>
              </div>
            </div>
          </div>
          {/* Socials */}
          <div className="flex flex-col space-y-7">
            <div className="flex flex-col space-y-7">
              <h3 className="font-semibold">Follow Us</h3>
              <div className="footer_items">
                <div className="flex items-center space-x-4 hover:text-white">
                  <FacebookIcon width={21} height={21} />
                  <p>Facebook</p>
                </div>
                <div className="flex items-center space-x-4 hover:text-white">
                  <InstagramIcon width={21} height={21} />
                  <p>Instagram</p>
                </div>
                <div className="flex items-center space-x-4 hover:text-white">
                  <WhatsappIcon width={21} height={21} />
                  <p>Whatsapp</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start md:max-w-xs">
              <label
                htmlFor="newsletter"
                className="w-full text-center hover:text-white sm:text-left"
              >
                Subscribe to our newsletter
              </label>
              <input
                type="email"
                name="newsletter"
                id="newsletter"
                className="mt-2 block w-full border-2 border-white bg-transparent px-4 py-1.5 text-white placeholder:text-sm placeholder:text-white/90 focus:border-2 focus:border-white focus:outline-none"
                placeholder="Email Address"
              />

              <Button className="mt-[7px] w-full bg-white text-center text-black">
                Subscribe!
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Payment options */}
      <div className="flex items-center justify-center gap-2 px-8 py-6">
        <p className="text-xs italic text-white/70">Secured by</p>
        <Paystack width={123.48} height={22} />
      </div>
      {/* Copyright */}
      <div className="flex border-t border-gray-700 px-10 pb-8 pt-4 text-center text-sm text-neutral-400">
        <p className={`${roboto.className}`}>© 2024 dekato-outfit.com</p>
      </div>
    </footer>
  );
}
