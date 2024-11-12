"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import {
  PlusOutlined,
  ExportOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { getAllOrders } from "@/app/action/orderAction";
import useSWR from "swr";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const { Title } = Typography;
const { Content } = Layout;

const Orders = React.memo(function Orders({ searchParams }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const router = useRouter();

  const page = useMemo(() => searchParams.page || 1, [searchParams]);

  const { data: orderData, isLoading } = useSWR(
    `/admin/orders?page=${page}`,
    () => getAllOrders({ page }),
    {
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (orderData) {
      setTotalCount(orderData.totalCount || 0);
      setLimit(orderData.limit || 10);
    }
  }, [orderData]);

  const orders = useMemo(
    () =>
      orderData?.orders?.map((item) => ({
        key: item.id,
        id: item.id,
        fulfillmentStatus: (
          <Tag
            color={
              item.status === "success"
                ? "green"
                : item.status === "failed"
                  ? "red"
                  : "orange"
            }
          >
            {item.status === "success"
              ? "Fulfilled"
              : item.status === "failed"
                ? "Failed"
                : "Pending"}
          </Tag>
        ),
        paymentStatus: (
          <Tag
            color={
              item.status === "success"
                ? "green"
                : item.status === "failed"
                  ? "red"
                  : "orange"
            }
          >
            {item.status === "success"
              ? "Paid"
              : item.status === "failed"
                ? "Failed"
                : "Pending"}
          </Tag>
        ),
        total: item.total,
        date: dayjs(item.createdAt).format("MMM D, YYYY HH:mm"),
        customer: item.user.firstname + " " + item.user.lastname,
        order: item.paymentRef,
      })) || [],
    [orderData],
  );

  const columns = useMemo(
    () => [
      {
        title: "Order",
        dataIndex: "order",
        key: "order",
        sorter: (a, b) => a.order.localeCompare(b.order),
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        sorter: (a, b) => new Date(a.date) - new Date(b.date),
      },
      {
        title: "Customer",
        dataIndex: "customer",
        key: "customer",
        sorter: (a, b) => a.customer.localeCompare(b.customer),
      },
      {
        title: "Total",
        dataIndex: "total",
        key: "total",
        align: "right",
        sorter: (a, b) => a.total - b.total,
      },
      {
        title: "Payment Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        filters: [
          { text: "Paid", value: "Paid" },
          { text: "Failed", value: "Failed" },
          { text: "Pending", value: "Pending" },
        ],
        onFilter: (value, record) =>
          record.paymentStatus.props.children === value,
      },
      {
        title: "Fulfillment Status",
        dataIndex: "fulfillmentStatus",
        key: "fulfillmentStatus",
        filters: [
          { text: "Fulfilled", value: "Fulfilled" },
          { text: "Failed", value: "Failed" },
          { text: "Pending", value: "Pending" },
        ],
        onFilter: (value, record) =>
          record.fulfillmentStatus.props.children === value,
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Link href={`/admin/orders/${record.key}`}>
            <Button type="link">View Details</Button>
          </Link>
        ),
      },
    ],
    [],
  );

  const onSelectChange = useCallback((newSelectedRowKeys) => {
    console.log(newSelectedRowKeys, "newSelectedRowKeys🔥🔥🔥");
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: onSelectChange,
    }),
    [selectedRowKeys, onSelectChange],
  );

  const handlePageChange = useCallback(
    (newPage) => {
      router.push(`/admin/orders?page=${newPage}`);
    },
    [router],
  );

  const hasSelected = selectedRowKeys.length > 0;

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
          <Row style={{ marginBottom: "16px" }}>
            <Col>
              {hasSelected && (
                <span>{`Selected ${selectedRowKeys.length} items`}</span>
              )}
            </Col>
          </Row>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={orders}
            pagination={{
              current: parseInt(page),
              pageSize: limit,
              showSizeChanger: false,
              total: totalCount,
              onChange: handlePageChange,
            }}
            loading={
              isLoading
                ? {
                    indicator: (
                      <LoadingOutlined spin className="!text-primary" />
                    ),
                    size: "large",
                  }
                : false
            }
            scroll={{ x: "max-content" }}
            className="overflow-x-auto sm:overflow-x-auto md:overflow-x-visible"
          />
        </Card>
      </Content>
    </Layout>
  );
});

export default Orders;
