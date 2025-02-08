"use client";
import { Card, Typography, Button, Divider } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function CustomerInfo({ order }) {
  return (
    <>
      <Card
        title="Note from customer"
        extra={<Button type="link" icon={<EditOutlined />} />}
      >
        <Text type="secondary">No notes from customer</Text>
      </Card>
      <Card style={{ marginTop: 24 }} title="Customer">
        <Text>{`${order?.user?.firstname} ${order?.user?.lastname}`}</Text>
        <br />
        <Text>Order count: {order?.user?.orderCount}</Text>
        <Divider />
        <Title level={5}>Contact Information</Title>
        <Text>{order?.user?.email}</Text>
        <br />
        <Text>{order.address?.phone || "No phone provided"}</Text>
        <Divider />
        <Title level={5}>Shipping Method</Title>
        <Text className="capitalize">{order.shippingMethod}</Text>
        {order.shippingMethod === "delivery" && (
          <>
            <Divider />
            <Title level={5}>Shipping address</Title>
            <Text>
              {order?.address?.firstname} {order?.address?.lastname}
              <br />
              {order?.address?.address}
              <br />
              {order?.address?.city}, {order?.address?.state}{" "}
              {order?.address?.postalCode}
              <br />
              {order?.address?.phone}
            </Text>
          </>
        )}
      </Card>
    </>
  );
}
