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
import { formatToNaira } from "@/utils/getFunc";

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
              avatar={
                <Link href={`/admin/products/${item.productId}`}>
                  <Avatar src={item.image} shape="square" size={64} />
                </Link>
              }
              title={
                <Link href={`/admin/products/${item.productId}`}>
                  {item.name}
                </Link>
              }
              description={
                <Space direction="vertical">
                  {item.option && (
                    <Tag className="uppercase">
                      {Object.values(item.option).join(" / ")}
                    </Tag>
                  )}
                  <Text type="secondary">SKU: {item.productId}</Text>
                </Space>
              }
            />
            <div>
              <br />
              <Text strong>{formatToNaira(item.price * item.quantity)}</Text>
              {/* <Text>{formatToNaira(item.price * item.quantity)}</Text> */}
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
