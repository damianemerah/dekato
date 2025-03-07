'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/app/components/footer';
import NewsLetter from '../(client)/(home)/newsletter';
import Checkmark from '@/public/assets/icons/check.svg?url';

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();

  return (
    <>
      <div className="flex flex-1 flex-col">
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
      </div>
      {!pathname.startsWith('/admin') && <Footer />}
    </>
  );
};

export default memo(LayoutWrapper);
