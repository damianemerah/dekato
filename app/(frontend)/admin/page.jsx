"use client";

import React, { useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  List,
  Avatar,
} from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  TagOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data for active discounts
  const [activeDiscounts, setActiveDiscounts] = useState([
    { key: "1", name: "Summer Sale", discount: "20%", endDate: "2023-08-31" },
    { key: "2", name: "New Customer", discount: "10%", endDate: "2023-12-31" },
  ]);

  // Mock data for recent orders
  const recentOrders = [
    {
      key: "1",
      order: "#1020",
      customer: "John Doe",
      total: "$969.44",
      status: "Paid",
    },
    {
      key: "2",
      order: "#1019",
      customer: "Jane Smith",
      total: "$701.19",
      status: "Processing",
    },
  ];

  // Mock data for recent admin activities
  const recentAdminActivities = [
    {
      admin: "Alice Johnson",
      action: "Added new product",
      item: "Summer T-Shirt",
      time: "2 hours ago",
    },
    {
      admin: "Bob Smith",
      action: "Updated inventory",
      item: "Denim Jeans",
      time: "4 hours ago",
    },
    {
      admin: "Carol Williams",
      action: "Modified discount",
      item: "Winter Sale",
      time: "Yesterday",
    },
  ];

  const columns = [
    { title: "Order", dataIndex: "order", key: "order" },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Total", dataIndex: "total", key: "total" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Paid" ? "green" : "blue"}>{status}</Tag>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        setIsModalVisible(false);
        // Here you would typically update the discounts in your backend
        // For this example, we'll just update the local state
        setActiveDiscounts([
          ...activeDiscounts,
          {
            key: String(activeDiscounts.length + 1),
            name: values.name,
            discount: values.discount + "%",
            endDate: values.endDate.format("YYYY-MM-DD"),
          },
        ]);
        message.success("Discount added successfully");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout>
      <Content style={{ padding: "24px" }}>
        <Title level={2}>Dashboard</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Sales"
                value={112893}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Orders"
                value={1528}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Customers"
                value={3120}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Discounts"
                value={activeDiscounts.length}
                prefix={<TagOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
          <Col span={24} lg={12}>
            <Card
              title="Recent Orders"
              extra={
                <Link href="/admin/orders">
                  <Button type="link">View All</Button>
                </Link>
              }
            >
              <Table
                columns={columns}
                dataSource={recentOrders}
                pagination={false}
              />
            </Card>
          </Col>
          <Col span={24} lg={12}>
            <Card
              title="Active Discounts"
              extra={
                <Link href="/admin/collections">
                  <Button type="link">View All</Button>
                </Link>
              }
            >
              <Table
                dataSource={activeDiscounts}
                columns={[
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Discount", dataIndex: "discount", key: "discount" },
                  { title: "End Date", dataIndex: "endDate", key: "endDate" },
                ]}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
          <Col span={24}>
            <Card title="Recent Admin Activities">
              <List
                itemLayout="horizontal"
                dataSource={recentAdminActivities}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<EditOutlined />} />}
                      title={`${item.admin} ${item.action}`}
                      description={`${item.item} - ${item.time}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        <Modal
          title="Manage Discounts"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical" name="discount_form">
            <Form.Item
              name="name"
              label="Discount Name"
              rules={[
                { required: true, message: "Please input the discount name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="discount"
              label="Discount Percentage"
              rules={[
                {
                  required: true,
                  message: "Please input the discount percentage!",
                },
              ]}
            >
              <Input type="number" min={0} max={100} />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[
                { required: true, message: "Please select the end date!" },
              ]}
            >
              <DatePicker />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
