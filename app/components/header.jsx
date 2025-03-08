'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, ShoppingBag, User, Heart } from 'lucide-react';
import useUserData from '@/app/hooks/useUserData';
import useCartData from '@/app/hooks/useCartData';
import { Button } from '@/app/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/app/components/ui/sheet';
import { SearchBox } from './search-box';
import { SidebarTrigger } from '@/app/components/ui/sidebar';
import { Separator } from '@/app/components/ui/separator';

export function Header() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { userData: user } = useUserData(userId);
  const { cartData: cart } = useCartData(userId);
  const [isShaking, setIsShaking] = React.useState(false);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (cart?.totalItems === 0) return;
    const interval = setInterval(() => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000);
    }, 11000);

    return () => clearInterval(interval);
  }, [cart?.totalItems]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-black text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left section - SidebarTrigger and desktop categories */}
        <div className="flex items-center">
          <div className="mr-4 flex items-center gap-2">
            <SidebarTrigger className="text-white" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>

          <Link
            href="/"
            className="mr-8 text-2xl font-bold tracking-wider text-white"
          >
            DEKATO
          </Link>

          <nav className="hidden lg:flex lg:space-x-10">
            {['women', 'men'].map((category) => (
              <Link key={category} href={`/shop/${category}`} className="px-2">
                <span
                  className={`text-sm font-bold uppercase tracking-widest transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white ${
                    pathname.split('/')[1].toLowerCase() === category
                      ? 'border-b-2 border-white'
                      : ''
                  }`}
                >
                  {category}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Center section - Search on desktop */}
        <div className="hidden lg:block lg:flex-1 lg:px-16">
          <SearchBox className="mx-auto max-w-md" />
        </div>

        {/* Right section - Icons */}
        <div className="flex items-center space-x-6">
          {/* Mobile search trigger */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-auto bg-white py-4">
              <SearchBox className="w-full" />
            </SheetContent>
          </Sheet>

          {/* User account */}
          <Link
            href={user?.id ? '/account' : '/signin'}
            className="hidden md:flex md:items-center md:space-x-1"
          >
            <User className="h-5 w-5" />
            <span className="hidden text-sm font-medium md:inline">
              {user?.id ? user?.firstname : 'LOGIN'}
            </span>
          </Link>
          <Link href={user?.id ? '/account' : '/signin'} className="md:hidden">
            <User className="h-5 w-5" />
          </Link>

          {/* Wishlist */}
          <Link href="/wishlist" className="hidden md:block">
            <Heart className="h-5 w-5" />
          </Link>

          {/* Shopping bag */}
          <Link href="/cart" className="relative flex items-center">
            <ShoppingBag
              className={`h-5 w-5 ${isShaking ? 'animate-bounce' : ''}`}
            />
            {cart?.totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                {cart.totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
