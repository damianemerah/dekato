"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  TwitterIcon as TikTok,
  Phone,
  Mail,
  Clock,
  MapPin,
} from "lucide-react";
import { Separator } from "@/app/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import Image from "next/image";

const menuItems = [
  { title: "Frequently Asked Questions", href: "/customer-service" },
  { title: "About Us", href: "#" },
  { title: "Contact us", href: "#" },
  { title: "Terms of Sale", href: "#" },
  { title: "Blog", href: "#" },
];

const contactInfo = {
  address: "30A Oseni Street, Anthony Village, Opposite GTB, Lagos",
  phones: ["(234) 802 3024 687", "(234) 806 4737 122"],
  email: "Mail@Dekato-outfit.com",
  hours: "Mon - Sat / 8am - 8pm",
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: TikTok, href: "#", label: "TikTok" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Menu Section */}
          <div className="space-y-4">
            <h3 className="font-oswald text-lg font-semibold">Menu</h3>
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-oswald text-lg font-semibold">Contact Us</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0" />
                <p>{contactInfo.address}</p>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="mt-1 h-4 w-4 shrink-0" />
                <div className="flex flex-col space-y-1">
                  {contactInfo.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone}`}
                      className="transition-colors hover:text-white"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="mt-1 h-4 w-4 shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="transition-colors hover:text-white"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="mt-1 h-4 w-4 shrink-0" />
                <p>{contactInfo.hours}</p>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="font-oswald text-lg font-semibold">About Dekato</h3>
            <p className="text-sm text-gray-300">
              Dekato is a premier fashion destination offering curated
              collections of high-quality clothing and accessories for the
              modern fashion enthusiast.
            </p>
            <div className="flex flex-wrap gap-3">
              <TooltipProvider>
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <Link
                        href={href}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on {label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        {/* Payment Info & Copyright */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>Secured by</span>
            <Image
              src="/assets/icons/paystack.svg"
              alt="Paystack"
              className="h-6"
              width={100}
              height={100}
            />
          </div>
          <p className="text-center text-sm text-gray-300">
            © {new Date().getFullYear()} dekato-outfit.com. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
