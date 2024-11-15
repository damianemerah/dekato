"use client";
import {
  Card,
  Space,
  Button,
  List,
  Avatar,
  Dropdown,
  Typography,
  Tag,
  Divider,
} from "antd";
import { CheckCircleOutlined, MoreOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

export default function OrderProducts({ order, menu }) {
  return (
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
              avatar={<Avatar src={item.image} shape="square" size={64} />}
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
      <Link href={`/admin/orders/${order.id}/fulfill`} passHref>
        <Button type="primary" block>
          Fulfill items
        </Button>
      </Link>
    </Card>
  );
}
