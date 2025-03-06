'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/store/store';
import useIsBelowThreshold from '@/app/hooks/useIsBelowThreshold';
import Footer from '@/app/components/footer';
import NewsLetter from '../(client)/(home)/newsletter';
import Checkmark from '@/public/assets/icons/check.svg?url';

const LayoutWrapper = ({ children }) => {
  const isBelowThreshold = useIsBelowThreshold();
  const { isSidebarOpen, lgScreenSidebar, isMobile, toggleSidebar } =
    useSidebarStore((state) => ({
      isSidebarOpen: state.isSidebarOpen,
      lgScreenSidebar: state.lgScreenSidebar,
      isMobile: state.isMobile,
      toggleSidebar: state.toggleSidebar,
    }));
  const pathname = usePathname();

  return (
    <>
      <main
        className={`${
          isSidebarOpen &&
          !pathname.startsWith('/admin') &&
          (lgScreenSidebar || isBelowThreshold)
            ? '[@media(min-width:1250px)]:w-[calc(100vw-280px)]'
            : ''
        } min-h-screen w-full transition-[width] duration-300 ease-in-out`}
      >
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 h-full w-full bg-black/50 transition-opacity duration-300"
            onClick={toggleSidebar}
          />
        )}
        {children}
        {pathname === '/' && (
          <>
            <NewsLetter />
            <div className="bg-neutral-300 py-6 text-primary sm:py-10">
              <div className="mx-auto grid max-w-screen-lg gap-4 px-4 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
                {[
                  'Quality Assurance',
                  'Free Shipping',
                  'Secure Payment',
                  'Customer Support',
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkmark width={26} height={26} />
                    <p className="text-sm md:text-base lg:text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
      {!pathname.startsWith('/admin') && <Footer />}
    </>
  );
};

export default memo(LayoutWrapper);
