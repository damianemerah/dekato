export default function AccountLayout({ children }) {
  return (
    <div className="flex-1 flex items-start shrink-0 px-28 bg-gray-100">
      <div className="p-6 w-60 basis-1/4 shrink-0 grow-0">
        <h3 className="text-lg font-bold mb-4">Account</h3>
        <ul className=" flex flex-col gap-4">
          <li>Overview</li>
          <li>Wishlist</li>
          <li>Orders</li>
          <li>Payment</li>
          <li>Settings</li>
          <li>Address</li>
        </ul>
      </div>
      <div className="flex-1 min-w-full bg-red-100 w-full">{children}</div>
    </div>
  );
}
