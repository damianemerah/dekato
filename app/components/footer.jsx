import Link from 'next/link';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import FbIcon from '@/public/assets/icons/facebook-share.svg';
import InstaIcon from '@/public/assets/icons/instagram-share.svg';
import { Separator } from '@/app/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import FeatureGrid from '@/app/components/feature-grid';
import NewsletterSection from '@/app/components/newsletter-section';
import { bizInfo } from '@/app/resources/contents';
import PaystackIcon from '@/public/assets/icons/paystack.svg';

const menuItems = [
  { title: 'Frequently Asked Questions', href: '/customer-service' },
  { title: 'About Us', href: '#' },
  { title: 'Contact us', href: '#' },
  { title: 'Terms of Sale', href: '#' },
  { title: 'Privacy Policy', href: '/privacy' },
  { title: 'Blog', href: '#' },
];

const socialLinks = [
  { icon: FbIcon, href: bizInfo.facebook, label: 'Facebook' },
  { icon: InstaIcon, href: bizInfo.instagram, label: 'Instagram' },
];

export default function Footer() {
  return (
    <>
      <FeatureGrid />
      <footer className="bg-primary text-white">
        <div className="container mx-auto px-4 py-12">
          {/* Main Footer Content */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Menu Section */}
            <div className="space-y-4">
              <h3 className="font-oswald text-lg font-semibold">Menu</h3>
              <nav className="flex flex-col space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="text-sm text-secondary transition-colors hover:text-white"
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
                  <p className="text-secondary">{bizInfo.address}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0" />
                  <div className="flex flex-col space-y-1">
                    {bizInfo.phones.map((phone) => (
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
                {/* <div className="flex items-start space-x-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0" />
                  <a
                    href={`mailto:${bizInfo.email}`}
                    className="transition-colors hover:text-white"
                  >
                    {bizInfo.email}
                  </a>
                </div> */}
                <div className="flex items-start space-x-3">
                  <Clock className="mt-1 h-4 w-4 shrink-0" />
                  <p className="text-secondary">{bizInfo.hours}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="font-oswald text-lg font-semibold">
                  About Dekato
                </h3>
                <p className="text-sm text-secondary">
                  {bizInfo.shortDescription}
                </p>
                <div className="flex flex-wrap gap-3">
                  <TooltipProvider>
                    {socialLinks.map(({ icon: Icon, href, label }) => (
                      <Tooltip key={label}>
                        <TooltipTrigger asChild>
                          <Link
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
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
            </div>{' '}
            <NewsletterSection />
          </div>

          <Separator className="my-8 bg-white/20" />

          {/* Payment Info & Copyright */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span>Secured by</span>
              <PaystackIcon className="h-6 w-20 text-white" />
            </div>
            <p className="text-center text-sm text-secondary">
              © {new Date().getFullYear()} dekato-outfit.com. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
