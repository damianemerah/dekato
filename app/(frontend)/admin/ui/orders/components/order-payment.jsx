"use client";
import { Card, Space, Row, Col, Typography, Divider } from "antd";
import { DollarOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function OrderPayment({ order }) {
  return (
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
  );
}
