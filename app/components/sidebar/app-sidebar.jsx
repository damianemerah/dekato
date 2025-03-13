'use client';

import { useSession } from 'next-auth/react';
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

  // Define sidebarItems here using the props
  const sidebarItems = [
    {
      label: 'NEW ARRIVALS',
      children:
        collections
          ?.filter((items) => items.slug.startsWith('new-arrival'))
          .map((collection) => ({
            label: categories?.find((cat) => cat.id === collection.category)
              ?.name,
            href: `/shop/${collection.path[0]}`,
          })) || [], // Add fallback empty array
    },
    ...(categories
      ?.filter((cat) => !cat.parent)
      .map((topCat) => ({
        label: topCat.name.toUpperCase(),
        href: `/shop/${topCat.path[0]}`,
        children:
          topCat?.children?.map((subCat) => ({
            label: subCat.name,
            href: `/shop/${subCat.path[0]}`,
          })) || [], // Add fallback empty array
      })) || []),
    {
      label: 'COLLECTIONS',
      children:
        collections
          ?.filter((item) => !item.slug.startsWith('new-arrival'))
          .map((collection) => ({
            label: collection.name,
            href: `/shop/${collection.path[0]}`,
          })) || [], // Add fallback empty array
    },
  ];

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
                <Link
                  href="/api/auth/signout"
                  className="flex items-center space-x-2 text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
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
