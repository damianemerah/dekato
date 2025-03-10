'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import useUserData from '@/app/hooks/useUserData';
import useAddressData from '@/app/hooks/useAddressData';
import useOrders from '@/app/hooks/useOrders';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Overview() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { userData: user, isLoading: userIsLoading } = useUserData(userId);
  const { addressData: address } = useAddressData(userId);
  const defaultAddress = address?.find((address) => address.isDefault);
  const { orders, isLoading: ordersLoading } = useOrders(userId, 3);

  if (userIsLoading || ordersLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-oswald text-xl">
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="mb-2 font-medium">Personal Information</h3>
            <div className="rounded-md bg-gray-50 p-4">
              <p className="mb-1 font-medium">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-4">
                <Link href="/account/settings">
                  <Button variant="outline" size="sm">
                    Manage Account Settings
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {defaultAddress && (
            <div className="mb-6">
              <h3 className="mb-2 font-medium">Default Shipping Address</h3>
              <div className="rounded-md bg-gray-50 p-4">
                <p className="mb-1 font-medium">{defaultAddress.name}</p>
                <p className="text-gray-600">{defaultAddress.street}</p>
                <p className="text-gray-600">
                  {defaultAddress.city}, {defaultAddress.state}{' '}
                  {defaultAddress.zip}
                </p>
                <p className="text-gray-600">{defaultAddress.country}</p>
                <div className="mt-4">
                  <Link href="/account/address">
                    <Button variant="outline" size="sm">
                      Manage Addresses
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-oswald text-xl">Recent Orders</CardTitle>
          <Link href="/account/orders">
            <Button variant="outline" size="sm">
              View All Orders
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {orders?.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-md border p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 flex-shrink-0">
                      <Image
                        src={
                          order.product?.[0]?.image ||
                          '/placeholder.svg?height=80&width=80'
                        }
                        alt={order.product?.[0]?.name || 'Product image'}
                        width={80}
                        height={80}
                        className="h-full w-full rounded-md object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <p className="font-medium">Order #{order.paymentRef}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total}</p>
                        <p className="text-sm text-gray-600">{order.status}</p>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="mt-2 inline-block text-sm text-primary hover:underline"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No orders found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
