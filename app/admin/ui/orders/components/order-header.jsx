"use client";
import { Row, Col, Button, Tag, Space, Dropdown } from "antd";
import { LeftOutlined, MoreOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Typography } from "antd";

const { Title } = Typography;

export default function OrderHeader({ order, menu }) {
  return (
    <Row justify="space-between" align="middle">
      <Col>
        <Link href="/admin/orders">
          <Button icon={<LeftOutlined />} type="link">
            Orders
          </Button>
        </Link>
        <Title level={4} style={{ display: "inline-block", margin: "0 16px" }}>
          #{order.paymentRef}
        </Title>
        <Tag color="green">Paid</Tag>
        <Tag color="blue">Fulfilled</Tag>
      </Col>
      <Col>
        <Space>
          <Button>
            <Link href={"/admin/products"}>Restock</Link>
          </Button>
          <Button type="primary">Edit</Button>
          <Dropdown menu={menu} trigger={["click"]}>
            <Button icon={<MoreOutlined />}>More actions</Button>
          </Dropdown>
        </Space>
      </Col>
    </Row>
  );
}
