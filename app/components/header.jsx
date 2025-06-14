'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  LogOut,
  Settings,
  Package,
} from 'lucide-react';
import useCartData from '@/app/hooks/useCartData';
import useWishlistData from '@/app/hooks/useWishlistData';
import { Button } from '@/app/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/app/components/ui/sheet';
import SearchBox from './search-box';
import { SidebarTrigger } from '@/app/components/ui/sidebar';
import { Separator } from '@/app/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export function Header() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const userId = user?.id;
  const { cartData: cart } = useCartData(userId);
  const { wishlistData } = useWishlistData(userId);
  const [isShaking, setIsShaking] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (cart?.totalItems === 0) return;
    const interval = setInterval(() => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000);
    }, 11000);

    return () => clearInterval(interval);
  }, [cart?.totalItems]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-black text-white">
      <div className="container mx-auto flex h-[--nav-height] items-center justify-between px-4">
        {/* Left section - SidebarTrigger and desktop categories */}
        <div className="flex items-center">
          <div className="mr-4 flex items-center gap-2">
            <SidebarTrigger className="text-white" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>

          <Link
            href="/"
            className="mr-8 font-oswald text-2xl font-bold tracking-wider text-white"
          >
            DEKATO
          </Link>

          <nav className="hidden lg:flex lg:space-x-2">
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

        {/* Right section - User actions */}
        <div className="flex items-center gap-6">
          {/* Search on mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="lg:hidden"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-screen w-full">
              <SearchBox setOpen={setOpen} open={open} />
            </SheetContent>
          </Sheet>

          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <User className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user?.firstname || user?.name?.split(' ')[0] || 'User'}
                    </span>
                    {user?.email && (
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin"
                    className={
                      pathname.startsWith('/admin') ? 'text-primary' : ''
                    }
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    className={pathname === '/account' ? 'text-primary' : ''}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>My Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account/orders"
                    className={
                      pathname === '/account/orders' ? 'text-primary' : ''
                    }
                  >
                    <Package className="mr-2 h-4 w-4" />
                    <span>Order History</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/signin" className="flex items-center space-x-1">
              <User className="h-5 w-5" />
              <span className="hidden text-sm font-medium md:inline">
                LOGIN
              </span>
            </Link>
          )}

          {/* Wishlist */}
          <Link href="/account/wishlist" className="relative hidden md:block">
            <Heart className="h-5 w-5" />
            {wishlistData?.count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {wishlistData.count}
              </span>
            )}
          </Link>

          {/* Shopping bag */}
          <Link
            href="/cart"
            className={`relative flex items-center ${isShaking ? 'animate-shake' : ''}`}
          >
            <ShoppingBag className={`h-5 w-5`} />
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
