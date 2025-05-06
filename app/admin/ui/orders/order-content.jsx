'use client';
import React, { useMemo } from 'react';
import { Layout, Row, Col } from 'antd';
import useSWR from 'swr';
import { getOrderById } from '@/app/action/orderAction';
import { SmallSpinner } from '@/app/components/spinner';
import dynamic from 'next/dynamic';

const OrderHeader = dynamic(() => import('./components/order-header'), {
  loading: () => (
    <div className="flex h-16 w-full animate-pulse items-center justify-between bg-gray-100 px-4">
      <div className="h-6 w-48 rounded bg-gray-200" />
      <div className="h-8 w-24 rounded bg-gray-200" />
    </div>
  ),
  ssr: false,
});

const OrderProducts = dynamic(() => import('./components/order-products'), {
  loading: () => (
    <div className="animate-pulse rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-32 rounded bg-gray-200" />
        <div className="h-8 w-8 rounded bg-gray-200" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="mb-4 flex items-center space-x-4">
          <div className="h-16 w-16 rounded bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
          </div>
          <div className="h-8 w-16 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  ),
  ssr: false,
});

const OrderPayment = dynamic(() => import('./components/order-payment'), {
  loading: () => (
    <div className="mt-6 animate-pulse rounded-lg border p-4">
      <div className="mb-4 flex items-center space-x-2">
        <div className="h-5 w-5 rounded-full bg-gray-200" />
        <div className="h-5 w-16 rounded bg-gray-200" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="mb-4 flex justify-between">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-4 w-16 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  ),
  ssr: false,
});

const CustomerInfo = dynamic(() => import('./components/customer-info'), {
  loading: () => (
    <div className="animate-pulse space-y-6">
      <div className="rounded-lg border p-4">
        <div className="mb-4 flex justify-between">
          <div className="h-5 w-32 rounded bg-gray-200" />
          <div className="h-8 w-8 rounded bg-gray-200" />
        </div>
        <div className="h-4 w-48 rounded bg-gray-200" />
      </div>
      <div className="space-y-4 rounded-lg border p-4">
        <div className="h-5 w-24 rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-48 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  ),
  ssr: false,
});
const { Header, Content } = Layout;

const OrderDetails = React.memo(function OrderDetails({ params }) {
  const { id } = params;

  const { data: order, isLoading } = useSWR(
    `/admin/orders/${id}`,
    () => getOrderById(id),
    {
      revalidateOnFocus: false,
    }
  );

  const menu = useMemo(
    () => ({
      items: [
        {
          key: '1',
          label: 'Print packing slip',
        },
        {
          key: '2',
          label: 'Cancel fulfillment',
          danger: true,
        },
      ],
    }),
    []
  );

  if (isLoading) {
    return (
      <div className="flex min-h-20 w-full items-center justify-center">
        <SmallSpinner className="!text-primary" />
      </div>
    );
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <>
      <Header style={{ background: '#fff', padding: '0 16px' }}>
        <OrderHeader order={order} menu={menu} />
      </Header>
      <Content className="px-3 py-12 sm:px-4">
        <Row gutter={24}>
          <Col span={16}>
            <OrderProducts order={order} menu={menu} />
            <OrderPayment order={order} />
          </Col>
          <Col span={8}>
            <CustomerInfo order={order} />
          </Col>
        </Row>
      </Content>
    </>
  );
});

export default OrderDetails;
