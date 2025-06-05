'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Minus, Plus } from 'lucide-react';
import FbIcon from '@/public/assets/icons/facebook-share.svg';
import InstaIcon from '@/public/assets/icons/instagram-share.svg';

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
} from '@/app/components/ui/sidebar';
import { bizInfo, inlineURL } from '@/app/resources/contents';
import { upperFirstLetter } from '@/app/lib/utils';

export default function AppSidebar({ categories, collections, ...props }) {
  const pathname = usePathname();
  const [openMenuIndex, setOpenMenuIndex] = React.useState(1);

  // Use React.useMemo to memoize sidebarItems calculation

  const sidebarItems = React.useMemo(
    () => [
      {
        // Route example: /shop/new-arrivals
        label: 'NEW ARRIVALS',
        children:
          collections
            ?.filter((items) => items.slug.startsWith('new-arrival'))
            .map((collection) => {
              let categoryName;

              if (
                typeof collection.category === 'object' &&
                collection.category !== null
              ) {
                categoryName = collection.category.name;
              } else {
                const category = categories?.find(
                  (cat) => cat.id === collection.category
                );
                categoryName = category?.name;
              }

              categoryName = categoryName || collection.name || 'New Item';

              const href = `/shop/${collection.path[0]}`;

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
      //hot coded
      ...inlineURL,
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

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <Sidebar {...props} className="sidebar-with-header">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="divide-y divide-gray-200 font-oswald">
            {sidebarItems.map((item, index) => (
              <Collapsible
                key={item.label}
                open={openMenuIndex === index}
                onOpenChange={(isOpen) => {
                  setOpenMenuIndex(isOpen ? index : null);
                }}
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
                              className="font-bold tracking-wider text-primary/80"
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
          href={bizInfo.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-2 text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <InstaIcon className="h-5 w-5" />
        </a>
        <a
          href={bizInfo.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-2 text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <FbIcon className="h-5 w-5" />
        </a>
      </div>

      <SidebarFooter className="border-t border-border px-4 py-4">
        <div className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Dekato
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
