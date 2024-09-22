"use client";

import React from "react";
import {
  Table,
  Card,
  Typography,
  Tag,
  Space,
  Button,
  Layout,
  Row,
  Col,
} from "antd";
import { PlusOutlined, ExportOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title } = Typography;
const { Content } = Layout;

function Orders() {
  const orders = [
    {
      key: "1020",
      order: "#1020",
      date: "Jul 20 at 4:34pm",
      customer: "Jaydon Stanton",
      total: "$969.44",
      paymentStatus: <Tag color="green">Paid</Tag>,
      fulfillmentStatus: <Tag color="red">Unfulfilled</Tag>,
    },
    {
      key: "1019",
      order: "#1019",
      date: "Jul 20 at 3:46pm",
      customer: "Ruben Westerfelt",
      total: "$701.19",
      paymentStatus: <Tag color="orange">Partially paid</Tag>,
      fulfillmentStatus: <Tag color="red">Unfulfilled</Tag>,
    },
    {
      key: "1018",
      order: "#1018",
      date: "Jul 20 at 3.44pm",
      customer: "Leo Carder",
      total: "$798.24",
      paymentStatus: <Tag color="green">Paid</Tag>,
      fulfillmentStatus: <Tag color="red">Unfulfilled</Tag>,
    },
  ];

  const columns = [
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "right",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Fulfillment Status",
      dataIndex: "fulfillmentStatus",
      key: "fulfillmentStatus",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link href={`/admin/orders/details/${record.key}`}>
          <Button type="link">View Details</Button>
        </Link>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows,
      );
    },
  };

  return (
    <Layout>
      <Content style={{ padding: "24px" }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "16px" }}
        >
          <Col>
            <Title level={2}>Orders</Title>
          </Col>
          <Col>
            <Space>
              <Button icon={<ExportOutlined />}>Export</Button>
              <Button type="primary" icon={<PlusOutlined />}>
                Create order
              </Button>
            </Space>
          </Col>
        </Row>
        <Card>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={orders}
            pagination={{
              total: orders.length,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </Card>
      </Content>
    </Layout>
  );
}

export default Orders;
