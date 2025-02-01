"use client";
import { Card, Space, Row, Col, Typography, Divider } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import { formatToNaira } from "@/utils/getFunc";

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
          <Text strong>{formatToNaira(order.total)}</Text>
        </Col>
      </Row>
      <Divider />
      <Row justify="space-between">
        <Col>Paid by customer</Col>
        <Col>{formatToNaira(order.total)}</Col>
      </Row>
    </Card>
  );
}
