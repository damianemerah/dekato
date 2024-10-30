"use client";
import React, { useState, useMemo } from "react";
import {
  Layout,
  Typography,
  Space,
  Button,
  Tag,
  Card,
  List,
  Avatar,
  Popover,
  Menu,
  Dropdown,
  Row,
  Col,
  Divider,
} from "antd";
import {
  LeftOutlined,
  EditOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import useSWR from "swr";
import { getOrderById } from "@/app/action/orderAction";
import { SmallSpinner } from "@/app/ui/spinner";

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const OrderDetails = React.memo(function OrderDetails({ params }) {
  const { id } = params;

  const { data: order, isLoading } = useSWR(
    `/admin/orders/${id}`,
    () => getOrderById(id),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        console.log(data);
      },
    },
  );

  const menu = useMemo(
    () => (
      <Menu
        items={[
          {
            key: "1",
            label: "Print packing slip",
          },
          {
            key: "2",
            label: "Cancel fulfillment",
            danger: true,
          },
        ]}
      />
    ),
    [],
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
    <Layout>
      <Header style={{ background: "#fff", padding: "0 16px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Link href="/admin/orders">
              <Button icon={<LeftOutlined />} type="link">
                Orders
              </Button>
            </Link>
            <Title
              level={4}
              style={{ display: "inline-block", margin: "0 16px" }}
            >
              #{order.receiptNumber}
            </Title>
            <Tag color="green">Paid</Tag>
            <Tag color="blue">Fulfilled</Tag>
          </Col>
          <Col>
            <Space>
              <Button>Restock</Button>
              <Button type="primary">Edit</Button>
              <Dropdown menu={menu} trigger={["click"]}>
                <Button icon={<MoreOutlined />}>More actions</Button>
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Row gutter={24}>
          <Col span={16}>
            <Card
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                  <Text strong>Fulfilled</Text>
                </Space>
              }
              extra={
                <Dropdown menu={menu} trigger={["click"]}>
                  <Button icon={<MoreOutlined />} />
                </Dropdown>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={order.product}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar src={item.image} shape="square" size={64} />
                      }
                      title={item.name}
                      description={
                        <Space direction="vertical">
                          {item.option && (
                            <Tag>
                              {item.option.color} / {item.option.length}
                            </Tag>
                          )}
                          <Text type="secondary">SKU: {item.productId}</Text>
                        </Space>
                      }
                    />
                    <div>
                      <Text>
                        ${item.price} x {item.quantity}
                      </Text>
                      <br />
                      <Text strong>${item.price * item.quantity}</Text>
                    </div>
                  </List.Item>
                )}
              />
              <Divider />
              <Link
                href="/admin/orders/[id]/fulfill"
                as={`/admin/orders/${order.id}/fulfill`}
                passHref
              >
                <Button type="primary" block>
                  Fulfill items
                </Button>
              </Link>
            </Card>
            <Card
              style={{ marginTop: 24 }}
              title={
                <Space>
                  <DollarOutlined style={{ color: "#52c41a" }} />
                  <Text strong>Paid</Text>
                </Space>
              }
            >
              <Row justify="space-between">
                <Col>Subtotal</Col>
                <Col>
                  <Text type="secondary">{order.product.length} Items</Text>
                  <Text strong style={{ marginLeft: 8 }}>
                    ${order.total}
                  </Text>
                </Col>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Col>
                  <Text strong>Total</Text>
                </Col>
                <Col>
                  <Text strong>${order.total}</Text>
                </Col>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Col>Paid by customer</Col>
                <Col>${order.total}</Col>
              </Row>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Note from customer"
              extra={<Button type="link" icon={<EditOutlined />} />}
            >
              <Text type="secondary">No notes from customer</Text>
            </Card>
            <Card style={{ marginTop: 24 }} title="Customer">
              <Text>{`${order.user.firstname} ${order.user.lastname}`}</Text>
              <br />
              <Text>{order.user.orderCount.length} orders</Text>
              <Divider />
              <Title level={5}>Contact Information</Title>
              <Text>{order.user.email}</Text>
              <br />
              <Text>{order.address?.phone || "No phone provided"}</Text>
              <Divider />
              <Title level={5}>Shipping Method</Title>
              <Text>{order.shippingMethod}</Text>
              {order.shippingMethod === "delivery" && (
                <>
                  <Divider />
                  <Title level={5}>Shipping address</Title>
                  <Text>
                    {order.address.firstname} {order.address.lastname}
                    <br />
                    {order.address.address}
                    <br />
                    {order.address.city}, {order.address.state}{" "}
                    {order.address.postalCode}
                    <br />
                    {order.address.phone}
                  </Text>
                </>
              )}
              <Divider />
              <Title level={5}>Billing address</Title>
              <Text type="secondary">Same as shipping address</Text>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
});

export default OrderDetails;
