"use client";

import { useState, useMemo, memo, useCallback } from "react";
import { Button, Flex, Table, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import useConfirmModal from "@/app/ui/confirm-modal";
import { deleteUser, getAllUsers } from "@/app/action/userAction";
import useSWR from "swr";
import { useRouter } from "next/navigation";
const CustomersList = ({ searchParams, data }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [limit] = useState(searchParams?.limit || 20);
  const page = useMemo(() => searchParams.page || 1, [searchParams]);
  const [totalCount, setTotalCount] = useState(
    data?.pagination?.totalCount || 0,
  );

  const router = useRouter();

  const showConfirmModal = useConfirmModal();

  const { data: userData, isLoading } = useSWR(
    `/api/users?page=${page}`,
    () => getAllUsers({ page, limit }),
    {
      revalidateOnFocus: false,
      fallbackData: data,
      keepPreviousData: true,
      onSuccess: (data) => {
        setTotalCount(data.pagination.totalCount);
      },
    },
  );

  const handlePageChange = useCallback(
    (page) => {
      router.push(`/admin/customers?page=${page}`);
    },
    [router],
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        showConfirmModal({
          title: "Are you sure you want to delete this customer?",
          content: "This action cannot be undone",
          async onOk() {
            try {
              await deleteUser(id);
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
    [showConfirmModal],
  );

  const dataSource = useMemo(() => {
    return userData?.data?.map((item) => ({
      key: item.id,
      customer: item.firstname + " " + item.lastname,
      email: item.email,
      orders: item?.orderCount,
      amountSpent: item?.amountSpent,
      action:
        item?.active && item?.role !== "admin" ? (
          <Button onClick={() => handleDelete(item.id)}>Deactivate</Button>
        ) : null,
    }));
  }, [userData?.data, handleDelete]);

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
        pagination={{
          current: parseInt(page),
          pageSize: limit,
          showSizeChanger: false,
          total: totalCount,
          onChange: handlePageChange,
        }}
        loading={
          isLoading && {
            indicator: <LoadingOutlined spin className="!text-primary" />,
            size: "large",
          }
        }
        scroll={{ x: "max-content" }}
        className="overflow-x-auto sm:overflow-x-auto md:overflow-x-visible"
      />
    </Flex>
  );
};

export default memo(CustomersList);
