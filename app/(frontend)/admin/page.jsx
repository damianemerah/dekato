"use client";

import React from "react";
import { Layout, Typography, Row, Col } from "antd";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const AdminDashboard = () => {
  return (
    <Layout>
      <Content style={{ padding: "24px" }}>
        <Row gutter={24}>
          <Col span={16}>
            <Title level={3}>Order details</Title>
            <Paragraph>
              Use to follow a normal section with a secondary section to create
              a 2/3 + 1/3 layout on detail pages (such as individual product or
              order pages). Can also be used on any page that needs to structure
              a lot of content. This layout stacks the columns on small screens.
            </Paragraph>
          </Col>
          <Col span={8}>
            <Title level={4}>Additional Information</Title>
            <Paragraph>Add tags to your order.</Paragraph>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
