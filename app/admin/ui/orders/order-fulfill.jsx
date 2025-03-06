'use client';
import React, { useState, useEffect } from 'react';
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
  message,
} from 'antd';
import {
  LeftOutlined,
  EditOutlined,
  MoreOutlined,
  CarOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import useSWR from 'swr';
import { getOrderById, fulfillOrder } from '@/app/action/orderAction';
import { ModalSpinner, SmallSpinner } from '@/app/components/spinner';
import { formatToNaira } from '@/utils/getFunc';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

function Fulfillment({ id }) {
  const [quantities, setQuantities] = useState([]);
  const [tracking, setTracking] = useState('');
  const [trackingLink, setTrackingLink] = useState('');
  const [carrier, setCarrier] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const {
    data: order,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(`/admin/orders/${id}`, () => getOrderById(id), {
    revalidateOnFocus: false,
    onSuccess: (data) => {
      setTracking(data.tracking);
      setTrackingLink(data.trackingLink);
      setCarrier(data.carrier);
      setQuantities(data.product.map((item) => item.quantity));
    },
  });

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
  };

  const handleFulfill = async () => {
    try {
      await fulfillOrder(
        id,
        quantities,
        tracking,
        trackingLink,
        carrier,
        order?.shippingMethod
      );
      mutate(`/admin/orders/${id}`);
      message.success('Order fulfilled');
    } catch (error) {
      console.error('Error fulfilling order:', error);
      alert('Failed to fulfill order.');
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">Print packing slip</Menu.Item>
      <Menu.Item key="2" danger>
        Cancel fulfillment
      </Menu.Item>
    </Menu>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-20 w-full items-center justify-center">
        <SmallSpinner className="!text-primary" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <Layout>
      {isValidating && ModalSpinner}
      <Header style={{ background: '#fff', padding: '0 16px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Link href="/admin/orders">
              <Button icon={<LeftOutlined />} type="link">
                Orders
              </Button>
            </Link>
            <Title
              level={4}
              style={{ display: 'inline-block', margin: '0 16px' }}
            >
              Fulfill item
            </Title>
          </Col>
          <Col>
            <Button onClick={() => alert('print packing slip')}>
              Print packing slip
            </Button>
          </Col>
        </Row>
      </Header>
      <Content className="px-3 py-12 sm:px-4">
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <Badge
                    status={order?.isFulfilled ? 'success' : 'warning'}
                    text={order?.isFulfilled ? 'Fulfilled' : 'Fulfill'}
                  />
                  <CarOutlined style={{ color: '#52c41a' }} />
                </Space>
              }
              extra={
                <Popover
                  content={menu}
                  trigger="click"
                  open={popoverOpen}
                  onOpenChange={setPopoverOpen}
                >
                  <Button icon={<MoreOutlined />} />
                </Popover>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={order?.product}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={item.image}
                          shape="square"
                          size={{
                            xs: 40,
                            sm: 40,
                            md: 64,
                            lg: 64,
                            xl: 80,
                            xxl: 100,
                          }}
                        />
                      }
                      title={item.name}
                      description={
                        <Space direction="horizontal">
                          <Space direction="vertical">
                            {item.option && (
                              <Tag className="uppercase" color="blue">
                                {Object.values(item.option).join(' / ')}
                              </Tag>
                            )}
                            <Text type="secondary">
                              Fulfilled: {item.fulfilledItems || 0}
                            </Text>
                          </Space>
                          <div className="sm:hidden">
                            <Text strong>
                              {formatToNaira(item.price * item.quantity)}
                            </Text>
                            <br />
                            <Input
                              addonBefore="Qty"
                              defaultValue={item.quantity}
                              style={{ width: '100px' }}
                              onChange={(e) =>
                                handleQuantityChange(index, e.target.value)
                              }
                            />
                          </div>
                        </Space>
                      }
                    />
                    <div className="hidden sm:block">
                      <Text strong>
                        {formatToNaira(item.price * item.quantity)}
                      </Text>
                      <br />
                      <Input
                        addonBefore="Qty"
                        defaultValue={item.quantity}
                        style={{ width: '100px' }}
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
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
                  style={{ marginBottom: '16px' }}
                />
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Tracking number">
                      <Input
                        value={tracking}
                        onChange={(e) => setTracking(e.target.value)}
                        placeholder="Enter tracking number"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Shipping carrier">
                      <Input
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                        placeholder="Enter carrier name"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item label="Tracking link">
                      <Input
                        value={trackingLink}
                        onChange={(e) => setTrackingLink(e.target.value)}
                        placeholder="Enter tracking link"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
                <Form.Item>
                  <Checkbox defaultChecked>
                    Send shipment details to your customer now
                  </Checkbox>
                </Form.Item>
                <Button type="primary" block onClick={handleFulfill}>
                  Fulfill items
                </Button>
              </Form>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              title="Shipping address"
              extra={<Button icon={<EditOutlined />} type="text" />}
            >
              {order?.shippingMethod === 'delivery' ? (
                <Text>
                  {order?.address?.firstname} {order?.address?.lastname}
                  <br />
                  {order?.address?.address}
                  <br />
                  {order?.address?.city}, {order?.address?.state}{' '}
                  {order?.address?.postalCode}
                  <br />
                  {order?.address?.phone}
                </Text>
              ) : (
                <p>(Store pickup)</p>
              )}
            </Card>
            <Card style={{ marginTop: '24px' }} title="Summary">
              <Text type="secondary">
                Fulfilling from Dekato Shop
                <br />
                {order?.product?.reduce(
                  (acc, cur) => acc + (cur.fulfilledItems || 0),
                  0
                )}{' '}
                of {order?.totalItems} items
              </Text>
              <Divider />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default Fulfillment;
