"use client";

import React, { useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Button,
  message,
  List,
  Avatar,
  Progress,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  TagOutlined,
  EditOutlined,
  ShopOutlined,
  InboxOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { getDashboardData } from "@/app/action/userAction";
import useSWR from "swr";
import { formatToNaira } from "@/utils/getFunc";

const { Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
  const { data: dashboardData, isLoading } = useSWR(
    "/api/dashboard",
    getDashboardData,
    {
      revalidateOnFocus: true,
    },
  );

  const recentOrders = dashboardData?.recentOrders?.map((order) => ({
    key: order._id,
    order: order.receiptNumber,
    customer: `${order?.user?.firstname} ${order?.user?.lastname}`,
    total: formatToNaira(order.total),
    status: order.deliveryStatus,
  }));

  const columns = [
    { title: "Receipt #", dataIndex: "order", key: "order" },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Total", dataIndex: "total", key: "total" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          pending: "gold",
          shipped: "blue",
          delivered: "green",
          cancelled: "red",
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <Layout>
      <Content style={{ padding: "24px" }}>
        <Title level={2}>Dashboard</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Sales"
                value={formatToNaira(dashboardData?.totalSales)}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Orders"
                value={dashboardData?.totalOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Customers"
                value={dashboardData?.totalCustomers}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Products"
                value={dashboardData?.products?.total}
                prefix={<ShopOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>

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
              <Table
                columns={columns}
                dataSource={recentOrders}
                pagination={false}
                loading={isLoading}
              />
            </Card>
          </Col>
          <Col span={24} lg={8}>
            <Card title="Order Status Overview">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Statistic
                    title="Pending Orders"
                    value={dashboardData?.orderStatus?.pending}
                    valueStyle={{ color: "#faad14" }}
                  />
                  <Progress
                    percent={Math.round(
                      (dashboardData?.orderStatus?.pending /
                        dashboardData?.totalOrders) *
                        100,
                    )}
                    strokeColor="#faad14"
                  />
                </Col>
                <Col span={24}>
                  <Statistic
                    title="Shipped Orders"
                    value={dashboardData?.orderStatus?.shipped}
                    valueStyle={{ color: "#1890ff" }}
                  />
                  <Progress
                    percent={Math.round(
                      (dashboardData?.orderStatus?.shipped /
                        dashboardData?.totalOrders) *
                        100,
                    )}
                    strokeColor="#1890ff"
                  />
                </Col>
                <Col span={24}>
                  <Statistic
                    title="Delivered Orders"
                    value={dashboardData?.orderStatus?.delivered}
                    valueStyle={{ color: "#52c41a" }}
                  />
                  <Progress
                    percent={Math.round(
                      (dashboardData?.orderStatus?.delivered /
                        dashboardData?.totalOrders) *
                        100,
                    )}
                    strokeColor="#52c41a"
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
          <Col span={24} lg={12}>
            <Card title="Product Statistics">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Active Products"
                    value={dashboardData?.products?.active}
                    prefix={<InboxOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Out of Stock"
                    value={dashboardData?.products?.outOfStock}
                    prefix={<InboxOutlined />}
                    valueStyle={{ color: "#ff4d4f" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Discounted Products"
                    value={dashboardData?.products?.discounted}
                    prefix={<PercentageOutlined />}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Collections"
                    value={dashboardData?.collections?.total}
                    prefix={<TagOutlined />}
                    valueStyle={{ color: "#13c2c2" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24} lg={12}>
            <Card title="Recent Notifications">
              <List
                itemLayout="horizontal"
                dataSource={dashboardData?.recentNotifications}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<EditOutlined />}
                          style={{
                            backgroundColor:
                              item.type === "info"
                                ? "#1890ff"
                                : item.type === "warning"
                                  ? "#faad14"
                                  : "#ff4d4f",
                          }}
                        />
                      }
                      title={item.title}
                      description={item.message}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
