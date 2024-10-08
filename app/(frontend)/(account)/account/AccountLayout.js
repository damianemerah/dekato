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
    return [
      { href: "/", label: "Home" },
      ...pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const link = links.find((link) => link.href === href);
        return {
          href,
          label: link
            ? link.label
            : segment.charAt(0).toUpperCase() + segment.slice(1),
          active: index === pathSegments.length - 1,
        };
      }),
    ];
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-3">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h1 className={`${oswald.className} mt-7 text-4xl antialiased`}>
        {breadcrumbs[breadcrumbs.length - 1].label}
      </h1>
      <div className="mb-16 mt-5 w-[85%] border border-gray-300">
        <div className="grid grid-cols-14 gap-7 space-x-10 py-16">
          <ul
            className={`${oswald.className} col-span-3 col-start-2 flex shrink-0 flex-col space-y-1`}
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
          <div className="col-span-9 col-start-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
