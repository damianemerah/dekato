"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { oswald } from "@/style/font";
import {
  UserOutlined,
  ShoppingOutlined,
  HeartOutlined,
  HomeOutlined,
  CreditCardOutlined,
  MailOutlined,
} from "@ant-design/icons";

const links = [
  { href: "/account", label: "Account Dashboard", icon: <UserOutlined /> },
  { href: "/account/orders", label: "My Orders", icon: <ShoppingOutlined /> },
  { href: "/account/wishlist", label: "My Wishlist", icon: <HeartOutlined /> },
  { href: "/account/address", label: "Address Book", icon: <HomeOutlined /> },
  {
    href: "/account/payment",
    label: "Payment Method",
    icon: <CreditCardOutlined />,
  },
  { href: "/account/newsletter", label: "Newsletter", icon: <MailOutlined /> },
];

export default function AccountLayout({ children }) {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean);

    // Base breadcrumbs starting with Home
    const breadcrumbs = [{ href: "/", label: "Home" }];

    // Handle each path segment
    pathSegments.forEach((segment, index) => {
      // Skip if it's an ID in the orders path
      if (
        segment.match(/^[0-9a-fA-F]{24}$/) &&
        pathSegments[index - 1] === "orders"
      ) {
        breadcrumbs.push({
          href: "#",
          label: "Order Details",
          active: true,
        });
        return;
      }

      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const link = links.find((link) => link.href === href);
      const isLast = index === pathSegments.length - 1;

      breadcrumbs.push({
        href: isLast ? "#" : href,
        label: link
          ? link.label
          : segment.charAt(0).toUpperCase() + segment.slice(1),
        active: isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="bg-grayBg pb-16">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center justify-center">
        <div className="flex w-full items-start py-8">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
        {/* <h1 className={`${oswald.className} mt-7 text-4xl antialiased`}>
          {breadcrumbs[breadcrumbs.length - 1].label}
        </h1> */}
        <div className="flex w-full gap-7">
          <ul
            className={`${oswald.className} sticky top-16 flex flex-shrink-0 basis-1/4 flex-col space-y-1 self-start bg-white p-4`}
          >
            {links.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`duration-400 before:duration-400 relative flex items-center px-4 py-3 tracking-wide transition-all before:transition-all hover:bg-gray-200 ${
                  pathname === href ? "bg-gray-200 font-semibold" : ""
                }`}
              >
                <span className="mr-2">{icon}</span>
                <li>{label}</li>
              </Link>
            ))}
          </ul>
          <div className="basis-3/4 bg-white px-10 py-14">{children}</div>
        </div>
      </div>
    </div>
  );
}
