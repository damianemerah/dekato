"use client";

import { useState, memo, useCallback } from "react";
import { Button, Flex, Table, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import useConfirmModal from "@/app/ui/confirm-modal";
import { deleteUser } from "@/app/action/userAction";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/app/ui/spinner";

const Action = dynamic(() => import("@/app/(frontend)/admin/ui/table-action"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

const CustomersList = ({ customers, isLoading, mutate }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const showConfirmModal = useConfirmModal();

  const handleDelete = useCallback(
    async (id) => {
      try {
        showConfirmModal({
          title: "Are you sure you want to delete this customer?",
          content: "This action cannot be undone",
          async onOk() {
            try {
              await deleteUser(id);
              await mutate();
              message.success("Customer deleted successfully");
            } catch (error) {
              message.error(error.message || "Failed to delete customer");
            }
          },
        });
      } catch (error) {
        message.error("Failed to delete customer");
      }
    },
    [showConfirmModal, mutate],
  );

  const dataSource = customers?.map((item) => ({
    key: item.id,
    customer: item.firstname + " " + item.lastname,
    email: item.email,
    orders: item?.orderCount,
    amountSpent: item?.totalSpent || "0",
    action: <Action id={item.id} onDelete={handleDelete} />,
  }));

  const columns = [
    {
      title: "Customer",
      dataIndex: "customer",
      sorter: (a, b) => a.customer.localeCompare(b.customer),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Orders",
      dataIndex: "orders",
      sorter: (a, b) => a.orders - b.orders,
    },
    {
      title: "Amount Spent",
      dataIndex: "amountSpent",
      sorter: (a, b) => a.amountSpent - b.amountSpent,
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const onSelectChange = useCallback((newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Flex gap="middle" vertical className="px-3 py-12 sm:px-4">
      <Flex align="center" justify="space-between" gap="middle">
        <Flex align="center" gap="middle">
          {hasSelected && (
            <span>{`Selected ${selectedRowKeys.length} items`}</span>
          )}
        </Flex>
        <Link href="/admin/customers/new">
          <Button className="!bg-primary !text-white">Add new customer</Button>
        </Link>
      </Flex>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource || []}
        loading={
          isLoading
            ? {
                indicator: <LoadingOutlined spin className="!text-primary" />,
                size: "large",
              }
            : false
        }
        scroll={{ x: "max-content" }}
        className="overflow-x-auto sm:overflow-x-auto md:overflow-x-visible"
      />
    </Flex>
  );
};

export default memo(CustomersList);
