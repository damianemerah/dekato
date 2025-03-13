'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/app/components/footer';
import FeatureGrid from '@/app/components/feature-grid';
import NewsletterSection from '@/app/components/newsletter-section';
import PromoBar from '@/app/components/promo-bar';

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full w-full flex-col bg-background">
      <PromoBar />
      <div className="flex-1">
        <div className="w-full">{children}</div>

        {pathname === '/' && (
          <>
            <NewsletterSection />
            <FeatureGrid />
          </>
        )}
      </div>
      {!pathname.startsWith('/admin') && <Footer />}
    </div>
  );
};

export default memo(LayoutWrapper);
