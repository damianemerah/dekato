"use client";

// Static imports
import { Button, Row, Col, Skeleton, Layout, Typography, Card } from "antd";
import dynamic from "next/dynamic";
import Link from "next/link";
import useSWR from "swr";
import { getDashboardData } from "@/app/action/userAction";
import { formatToNaira } from "@/utils/getFunc";
import { Suspense } from "react";

const { Content } = Layout;
const { Title } = Typography;

// Dynamic component imports
const OrderTable = dynamic(() => import("./order-table"), {
  loading: () => <Skeleton active paragraph={{ rows: 5 }} />,
  ssr: false,
});

const Statistics = dynamic(() => import("./statistics"), {
  loading: () => (
    <Row gutter={[24, 24]}>
      {[...Array(4)].map((_, i) => (
        <Col key={i} xs={24} sm={12} lg={6}>
          <Card>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
        </Col>
      ))}
    </Row>
  ),
  ssr: false,
});

const OrderStatus = dynamic(() => import("./order-status"), {
  loading: () => (
    <Card>
      <Skeleton active paragraph={{ rows: 6 }} />
    </Card>
  ),
  ssr: false,
});

const NotificationList = dynamic(() => import("./notification-list"), {
  loading: () => (
    <Card>
      <Skeleton active avatar paragraph={{ rows: 4 }} />
    </Card>
  ),
  ssr: false,
});

const ProductStatistics = dynamic(() => import("./product-stat"), {
  loading: () => (
    <Card>
      <Skeleton active paragraph={{ rows: 4 }} />
    </Card>
  ),
  ssr: false,
});

const NewsletterStatistics = dynamic(() => import("./newsletter-stat"), {
  loading: () => (
    <Card>
      <Skeleton active paragraph={{ rows: 4 }} />
    </Card>
  ),
  ssr: false,
});

const AdminContent = ({ initialData }) => {
  const { data: dashboardData, isLoading } = useSWR(
    "/api/dashboard",
    getDashboardData,
    {
      refreshInterval: 30000,
      fallbackData: initialData,
    },
  );

  const recentOrders = dashboardData?.recentOrders?.map((order) => ({
    key: order._id,
    order: order.paymentRef,
    customer: `${order?.user?.firstname} ${order?.user?.lastname}`,
    total: formatToNaira(order.total),
    status: order.deliveryStatus,
  }));

  return (
    <Content className="px-3 py-12 sm:px-4">
      <Title level={2}>Dashboard</Title>
      <Suspense
        fallback={
          <Row gutter={[24, 24]}>
            {[...Array(4)].map((_, i) => (
              <Col key={i} xs={24} sm={12} lg={6}>
                <Card>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </Card>
              </Col>
            ))}
          </Row>
        }
      >
        <Statistics dashboardData={dashboardData} />
      </Suspense>

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col span={24} lg={16}>
          <Card
            title="Recent Orders"
            extra={
              <Link href="/admin/orders">
                <Button type="link">View All</Button>
              </Link>
            }
          >
            <Suspense fallback={<Skeleton active paragraph={{ rows: 5 }} />}>
              <OrderTable recentOrders={recentOrders} isLoading={isLoading} />
            </Suspense>
          </Card>
        </Col>
        <Col span={24} lg={8}>
          <Suspense fallback={<Skeleton active paragraph={{ rows: 6 }} />}>
            <OrderStatus dashboardData={dashboardData} />
          </Suspense>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col span={24} lg={12}>
          <Suspense fallback={<Skeleton active paragraph={{ rows: 4 }} />}>
            <ProductStatistics
              products={dashboardData?.products}
              collections={dashboardData?.collections}
            />
          </Suspense>
        </Col>
        <Col span={24} lg={12}>
          <Suspense fallback={<Skeleton active paragraph={{ rows: 4 }} />}>
            <NewsletterStatistics newsletter={dashboardData?.newsletter} />
          </Suspense>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Suspense
            fallback={<Skeleton active avatar paragraph={{ rows: 4 }} />}
          >
            <NotificationList
              notifications={dashboardData?.recentNotifications}
            />
          </Suspense>
        </Col>
      </Row>
    </Content>
  );
};

export default AdminContent;
