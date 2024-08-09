import { usePathname } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { oswald } from "@/style/font";

export default function AccountLayout({ children, title, breadcrumbs }) {
  const pathname = usePathname();

  console.log(pathname);

  const links = [
    {
      href: "/account",
      label: "Account Dashboard",
    },
    {
      href: "/account/orders",
      label: "My Orders",
    },
    {
      href: "/account/wishlist",
      label: "My Wishlist",
    },
    {
      href: "/account/address",
      label: "Address Book",
    },
    {
      href: "/account/payment",
      label: "Payment Method",
    },
    {
      href: "/account/newsletter",
      label: "Newsletter",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-3">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h1 className={`${oswald.className} mt-7 text-4xl antialiased`}>
        {title}
      </h1>
      <div className="mb-16 mt-5 w-[85%] border border-gray-300">
        <div className="grid grid-cols-14 gap-7 space-x-10 py-16">
          <ul
            className={`${oswald.className} col-span-3 col-start-2 flex shrink-0 flex-col space-y-1`}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`duration-400 before:duration-400 relative block px-4 py-3 tracking-wide transition-all before:transition-all hover:bg-gray-200 ${
                  pathname === link.href ? "bg-gray-200 font-semibold" : ""
                }`}
              >
                <li>{link.label}</li>
              </Link>
            ))}
          </ul>
          <div className="col-span-9 col-start-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
