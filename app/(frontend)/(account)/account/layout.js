import Link from "next/link";
export default function AccountLayout({ children }) {
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
      label: "My Wish List",
    },
    {
      href: "/account/address",
      label: "Shipping Address",
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
    <div className="flex items-start px-28 bg-gray-100 gap-4 py-6">
      <ul className=" flex flex-col justify-start shrink-0 bg-white self-stretch rounded-lg min-w-[20%]">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="relative px-4 py-3 hover:before:content-[''] hover:before:w-1 hover:before:bg-slate-950 hover:before:h-full hover:before:absolute hover:before:top-0 hover:before:left-0 block hover:bg-gray-200 transition-all duration-400 before:transition-all before:duration-400"
          >
            <li>{link.label}</li>
          </Link>
        ))}
      </ul>
      <div className="flex-1">{children}</div>
    </div>
  );
}
