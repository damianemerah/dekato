"use client";
import React, { useState } from "react";
import {
  Layout,
  Typography,
  Space,
  Button,
  Card,
  List,
  Avatar,
  Popover,
  Menu,
  Badge,
  Row,
  Col,
  Input,
  Form,
  Checkbox,
  Tag,
  Divider,
  Alert,
} from "antd";
import {
  LeftOutlined,
  EditOutlined,
  MoreOutlined,
  CarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Header, Content } = Layout;

function Fulfillment() {
  const [popoverVisible, setPopoverVisible] = useState(false);

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
            <Button icon={<LeftOutlined />} type="link">
              Products
            </Button>
            <Title
              level={4}
              style={{ display: "inline-block", margin: "0 16px" }}
            >
              Fulfill item
            </Title>
          </Col>
          <Col>
            <Button onClick={() => alert("print packing slip")}>
              Print packing slip
            </Button>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Row gutter={24}>
          <Col span={16}>
            <Card
              title={
                <Space>
                  <Badge status="success" text="Fulfilled" />
                  <CarOutlined style={{ color: "#52c41a" }} />
                </Space>
              }
              extra={
                <Popover
                  content={menu}
                  trigger="click"
                  visible={popoverVisible}
                  onVisibleChange={setPopoverVisible}
                >
                  <Button icon={<MoreOutlined />} />
                </Popover>
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
                          <Tag color="blue">
                            {item.size} / {item.color}
                          </Tag>
                          <Text type="secondary">SKU: {item.sku}</Text>
                        </Space>
                      }
                    />
                    <div>
                      <Input
                        addonBefore="Qty"
                        defaultValue={item.qty}
                        style={{ width: "100px" }}
                      />
                    </div>
                  </List.Item>
                )}
              />
              <Divider />
              <Form layout="vertical">
                <Title level={5}>Tracking information</Title>
                <Alert
                  message="Add tracking to improve customer satisfaction. Orders with tracking let customers receive delivery updates and reduce support requests."
                  type="info"
                  showIcon
                  style={{ marginBottom: "16px" }}
                />
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Tracking number">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Shipping carrier">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
                <Form.Item>
                  <Checkbox defaultChecked>
                    Send shipment details to your customer now
                  </Checkbox>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Shipping address"
              extra={<Button icon={<EditOutlined />} type="text" />}
            >
              <Text>
                Tyler Ware <br />
                3508 Pharetra. Av.
                <br />
                42621 Nantes <br />
                Paraguay
                <br />
                +59546811470
              </Text>
            </Card>
            <Card style={{ marginTop: "24px" }} title="Summary">
              <Text type="secondary">
                Fulfilling from Dekato Shop
                <br />2 of 2 items
              </Text>
              <Divider />
              <Button type="primary" block>
                Fulfill items
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default Fulfillment;
