'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/app/components/footer';
import { useSidebar } from '@/app/components/ui/sidebar';
import FeatureGrid from '@/app/components/feature-grid';
import NewsletterSection from '@/app/components/newsletter-section';

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  const { open, isMobile } = useSidebar();

  return (
    <>
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
          open && !isMobile ? 'max-w-[calc(100vw-var(--sidebar-width))]' : ''
        }`}
      >
        {children}

        {pathname === '/' && (
          <>
            <NewsletterSection />
            <FeatureGrid />
          </>
        )}
      </div>
      {!pathname.startsWith('/admin') && <Footer />}
    </>
  );
};

export default memo(LayoutWrapper);
