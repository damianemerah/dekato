'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Heart, CreditCard, User, Mail, Settings } from 'lucide-react';
import { cn } from '@/app/lib/utils';

const AccountNav = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/account/orders',
      label: 'Orders',
      icon: Package,
    },
    {
      href: '/account/wishlist',
      label: 'Wishlist',
      icon: Heart,
    },
    {
      href: '/account/payment',
      label: 'Payment',
      icon: CreditCard,
    },
    {
      href: '/account/address',
      label: 'Address',
      icon: User,
    },
    {
      href: '/account/newsletter',
      label: 'Newsletter',
      icon: Mail,
    },
    {
      href: '/account/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/account' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-2 rounded-md p-4 text-gray-700 transition-colors duration-300 hover:bg-primary hover:text-white',
              isActive && 'bg-primary text-white'
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="font-oswald text-sm uppercase">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default AccountNav;
