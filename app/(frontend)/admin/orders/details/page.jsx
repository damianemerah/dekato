"use client";
import React, { useState } from "react";
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

const { Title, Text } = Typography;
const { Header, Content } = Layout;

function OrderDetails() {
  const menu = (
    <Menu>
      <Menu.Item key="1">Print packing slip</Menu.Item>
      <Menu.Item key="2" danger>
        Cancel fulfillment
      </Menu.Item>
    </Menu>
  );

  const orderItems = [
    {
      id: "145",
      name: "VANS | CLASSIC SLIP-ON (PERFORATED SUEDE)",
      sku: "9504957",
      qty: 1,
      price: "200",
      size: 9,
      color: "black",
      image:
        "https://burst.shopifycdn.com/photos/black-orange-stripes_373x@2x.jpg",
    },
    {
      id: "146",
      name: "Tucan scarf",
      sku: "0404957",
      qty: 1,
      price: "500",
      size: 9,
      color: "white",
      image: "https://burst.shopifycdn.com/photos/tucan-scarf_373x@2x.jpg",
    },
  ];

  return (
    <Layout>
      <Header style={{ background: "#fff", padding: "0 16px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Link href="/admin/orders">
              <Button icon={<LeftOutlined />} type="link">
                Products
              </Button>
            </Link>
            <Title
              level={4}
              style={{ display: "inline-block", margin: "0 16px" }}
            >
              #1033
            </Title>
            <Tag color="green">Paid</Tag>
            <Tag color="blue">Fulfilled</Tag>
          </Col>
          <Col>
            <Space>
              <Button>Restock</Button>
              <Button type="primary">Edit</Button>
              <Dropdown overlay={menu} trigger={["click"]}>
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
                <Dropdown overlay={menu} trigger={["click"]}>
                  <Button icon={<MoreOutlined />} />
                </Dropdown>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={orderItems}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar src={item.image} shape="square" size={64} />
                      }
                      title={item.name}
                      description={
                        <Space direction="vertical">
                          <Tag>
                            {item.size} / {item.color}
                          </Tag>
                          <Text type="secondary">SKU: {item.sku}</Text>
                        </Space>
                      }
                    />
                    <div>
                      <Text>
                        ${item.price} x {item.qty}
                      </Text>
                      <br />
                      <Text strong>${item.price * item.qty}</Text>
                    </div>
                  </List.Item>
                )}
              />
              <Divider />
              <Button type="primary" block>
                Fulfill items
              </Button>
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
                  <Text type="secondary">2 Items</Text>
                  <Text strong style={{ marginLeft: 8 }}>
                    $40
                  </Text>
                </Col>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Col>
                  <Text strong>Total</Text>
                </Col>
                <Col>
                  <Text strong>$40</Text>
                </Col>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Col>Paid by customer</Col>
                <Col>$40</Col>
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
              <Text>John Smith</Text>
              <br />
              <Text>4 orders</Text>
              <Divider />
              <Title level={5}>Contact Information</Title>
              <Text>john.smith@example.com</Text>
              <br />
              <Text>+234957304755</Text>
              <Divider />
              <Title level={5}>Shipping address</Title>
              <Text>
                Tyler Ware
                <br />
                3508 Pharetra. Av.
                <br />
                42621 Nantes
                <br />
                Paraguay
                <br />
                +59546811470
              </Text>
              <Divider />
              <Title level={5}>Billing address</Title>
              <Text type="secondary">Same as shipping address</Text>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default OrderDetails;
