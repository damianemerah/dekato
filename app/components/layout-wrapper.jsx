'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/app/components/footer';
import PromoBar from '@/app/components/promo-bar';

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full w-full flex-col bg-background">
      <PromoBar />
      <div className="flex-1">
        <div className="w-full">{children}</div>
      </div>
      {!pathname.startsWith('/admin') && <Footer />}
    </div>
  );
};

export default memo(LayoutWrapper);
