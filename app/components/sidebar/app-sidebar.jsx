'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GalleryVerticalEnd,
  Minus,
  Plus,
  Instagram,
  Facebook,
  User,
  ShoppingBag,
  ArrowLeftRight,
  LogIn,
  LogOut,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from '@/app/components/ui/sidebar';

import { upperFirstLetter } from '@/app/lib/utils';

export default function AppSidebar({ categories, collections, ...props }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Add debugging console log in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '[Sidebar] New Arrivals Collections:',
      collections
        ?.filter((c) => c.slug.startsWith('new-arrival'))
        .map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          category: c.category,
          categoryName:
            typeof c.category === 'object'
              ? c.category.name
              : categories?.find((cat) => cat.id === c.category)?.name,
        }))
    );
  }

  // Use React.useMemo to memoize sidebarItems calculation
  const sidebarItems = React.useMemo(
    () => [
      {
        label: 'NEW ARRIVALS',
        children:
          collections
            ?.filter((items) => items.slug.startsWith('new-arrival'))
            .map((collection) => {
              // Handle both cases: when category is an object or when it's an ID
              let categoryName;
              let categorySlug;

              if (
                typeof collection.category === 'object' &&
                collection.category !== null
              ) {
                // Category is already an object with name property
                categoryName = collection.category.name;
                categorySlug = collection.category.slug;
              } else {
                // Category is an ID, need to look it up
                const category = categories?.find(
                  (cat) => cat.id === collection.category
                );
                categoryName = category?.name;
                categorySlug = category?.slug;
              }

              // Fallback to collection name or generic label if category name not found
              categoryName = categoryName || collection.name || 'New Item';

              // Build the correct URL format: /shop/{category-slug}/new-arrivals
              const href = categorySlug
                ? `/shop/${categorySlug}/new-arrivals`
                : `/shop/${collection.slug}`; // Fallback if category slug not found

              return {
                label: categoryName,
                href: href,
              };
            }) || [],
      },
      ...(categories
        ?.filter((cat) => !cat.parent)
        .map((topCat) => ({
          label: topCat.name.toUpperCase(),
          href: `/shop/${topCat.path?.[0] || topCat.slug}`,
          children:
            topCat?.children?.map((subCat) => ({
              label: subCat.name,
              href: `/shop/${subCat.path?.[0] || subCat.slug}`,
            })) || [],
        })) || []),
      {
        label: 'COLLECTIONS',
        children:
          collections
            ?.filter((item) => !item.slug.startsWith('new-arrival'))
            .map((collection) => {
              // Get the collection name - either directly or from the category object
              let displayName = collection.name;

              // If no name but we have a category object, use that
              if (
                !displayName &&
                typeof collection.category === 'object' &&
                collection.category?.name
              ) {
                displayName = collection.category.name;
              }

              return {
                label: displayName || 'Collection Item',
                href: `/shop/${collection.path?.[0] || collection.slug}`,
              };
            }) || [],
      },
    ],
    [categories, collections]
  );

  return (
    <Sidebar {...props} className="sidebar-with-header">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="divide-y divide-gray-200 font-oswald">
            {sidebarItems.map((item, index) => (
              <Collapsible
                key={item.label}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem className="py-3">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="font-black tracking-wider text-primary">
                      {item.label}{' '}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.children?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children.map((item, index) => (
                          <SidebarMenuSubItem key={index}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === item.href}
                              className="font-bold tracking-wider text-primary"
                            >
                              <Link href={item.href}>
                                {upperFirstLetter(item.label)}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Social Media Icons */}
      <div className="mt-8 flex items-center justify-center space-x-4 px-4">
        <a
          href="https://instagram.com/dekatooutfit"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-2 text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <Instagram className="h-5 w-5" />
        </a>
        <a
          href="https://facebook.com/dekatooutfit"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-2 text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <Facebook className="h-5 w-5" />
        </a>
      </div>
      {/* Footer */}
      <SidebarFooter className="border-t border-border px-4 py-4">
        <SidebarMenu>
          {/* Account Shortcuts */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/account" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>My Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/account/orders"
                className="flex items-center space-x-2"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Order History</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/returns" className="flex items-center space-x-2">
                <ArrowLeftRight className="h-4 w-4" />
                <span>Return Policy</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}

          <SidebarSeparator className="my-2" />

          {/* Conditional Login/Logout */}
          {session ? (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button
                  onClick={() => signOut({ callbackUrl: '/signin' })}
                  className="flex w-full items-center space-x-2 text-left text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/signin"
                  className="flex items-center space-x-2 text-green-600"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
