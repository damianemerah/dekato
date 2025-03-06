//USED FILE

'use client';

import { usePathname } from 'next/navigation';
import Breadcrumbs from '@/app/components/breadcrumbs';
import {
  UserOutlined,
  ShoppingOutlined,
  HeartOutlined,
  HomeOutlined,
  CreditCardOutlined,
  MailOutlined,
} from '@ant-design/icons';

const links = [
  { href: '/account', label: 'Account Dashboard', icon: <UserOutlined /> },
  { href: '/account/orders', label: 'My Orders', icon: <ShoppingOutlined /> },
  { href: '/account/wishlist', label: 'My Wishlist', icon: <HeartOutlined /> },
  { href: '/account/address', label: 'Address Book', icon: <HomeOutlined /> },
  {
    href: '/account/payment',
    label: 'Payment Method',
    icon: <CreditCardOutlined />,
  },
  { href: '/account/newsletter', label: 'Newsletter', icon: <MailOutlined /> },
];

export default function AccountLayout({ children }) {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);

    // Base breadcrumbs starting with Home
    const breadcrumbs = [{ href: '/', label: 'Home' }];

    // Handle each path segment
    pathSegments.forEach((segment, index) => {
      // Skip if it's an ID in the orders path
      if (
        segment.match(/^[0-9a-fA-F]{24}$/) &&
        pathSegments[index - 1] === 'orders'
      ) {
        breadcrumbs.push({
          href: '#',
          label: 'Order Details',
          active: true,
        });
        return;
      }

      const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const link = links.find((link) => link.href === href);
      const isLast = index === pathSegments.length - 1;

      breadcrumbs.push({
        href: isLast ? '#' : href,
        label: link
          ? link.label
          : segment.charAt(0).toUpperCase() + segment.slice(1),
        active: isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="bg-grayBg">
      <div className="md:py-15 relative mx-auto min-h-screen max-w-4xl px-7 py-10 sm:px-8 sm:py-16 md:px-10">
        <div className="flex items-start pb-8">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
        {children}
      </div>
    </div>
  );
}
