import Image from "next/image";
import { oswald } from "@/style/font";
import { getOrderById } from "@/app/action/orderAction";

export default async function OrderDetail({ params }) {
  const order = await getOrderById(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 rounded-lg border-2 border-gray-300 bg-white p-8">
        <div className="mb-6 grid grid-cols-1 gap-6 border-b border-gray-200 pb-6 md:grid-cols-4">
          <div>
            <h3 className="font-oswald text-lg font-semibold">Order Status</h3>
            <p className="text-[#27AE60]">{order?.status || "Pending"}</p>
          </div>
          <div>
            <h3 className="font-oswald text-lg font-semibold">Order Number</h3>
            <p className="text-gray-600">{order?.paymentRef}</p>
          </div>
          <div>
            <h3 className="font-oswald text-lg font-semibold">Order Date</h3>
            <p className="text-gray-600">
              {new Date(order?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="font-oswald text-lg font-semibold">
              Delivery Status
            </h3>
            <p className="capitalize text-gray-600">
              {order?.deliveryStatus || "pending"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-4 font-oswald text-lg font-semibold">
            Shipping Details
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="font-medium">Shipping Method:</p>
              <p className="capitalize text-gray-600">
                {order?.shippingMethod}
              </p>
            </div>
            {order?.address && (
              <div>
                <p className="font-medium">Delivery Address:</p>
                <p className="text-gray-600">
                  {order?.address?.firstname} {order?.address?.lastname},{" "}
                  {order?.address?.address}, {order?.address?.city},{" "}
                  {order?.address?.state} {order?.address?.postalCode},{" "}
                  {order?.address?.phone}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-4 font-oswald text-lg font-semibold">
            Order Items
          </h3>
          <div className="space-y-4">
            {order?.product?.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-start justify-between border-b border-gray-200 pb-4 last:border-0 sm:flex-row sm:items-center"
              >
                <div className="flex items-start">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="mr-4 rounded-md object-cover"
                  />
                  <div>
                    <h4 className={`${oswald.className} font-semibold`}>
                      {item.name}
                    </h4>
                    {item.option && (
                      <p className="text-sm text-gray-500">
                        {Object.entries(item.option)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </p>
                    )}
                    <p className="mt-1">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="mt-4 text-right sm:mt-0">
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between">
            <h3 className="font-oswald text-xl font-semibold">Total</h3>
            <p className="text-xl font-semibold">${order?.total?.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
