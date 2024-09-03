"use client";

import React, { useState, memo, useEffect } from "react";
import { Button, Flex, Table, Dropdown, Space, message, Modal } from "antd";
import { DownOutlined, LoadingOutlined } from "@ant-design/icons";
import { deleteProduct } from "@/app/action/productAction";
import { getAllCategories } from "@/app/action/categoryAction";
import useSWR from "swr";
import Link from "next/link";
import { getAllUsers } from "@/app/action/userAction";

const { confirm } = Modal;

const Action = memo(function Action({ id, handleDelete }) {
  const items = [
    {
      label: (
        <Link
          rel="noopener noreferrer"
          href={`/admin/products/${id}`}
          className="!text-blue-500"
        >
          View / Edit
        </Link>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: "Delete",
      key: "1",
      danger: true,
      onClick: () => handleDelete(id),
    },
    {
      label: "Achive",
      key: "2",
    },
  ];
  return (
    <Dropdown
      menu={{
        items,
      }}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          Action
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
});

const ProductsList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: collections } = useSWR("/api/allCategories", getAllCategories);

  const { data: users, isLoading } = useSWR("/api/users", getAllUsers);

  useEffect(() => {
    if (users) {
      console.log(users, "usersMap");
    }
  }, [users]);

  const dataSource = users?.map((item) => ({
    key: item.id,
    customer: item.firstname + " " + item.lastname,
    email: item.email,
    location: item?.address?.find((add) => add.isDefault)?.address,
    orders: item?.orderCount,
    amountSpent: "1000",
    action: <Action />,
  }));

  const handleDelete = async (id) => {
    const deleteAndUpdateProd = () => {
      new Promise(async (resolve, reject) => {
        try {
          await deleteProduct(id);
          mutate("/admin/products");
          message.success("Product deleted successfully");
          resolve();
        } catch (error) {
          message.error("Failed to delete product");
          reject();
        }
      });
    };
    try {
      confirm({
        title: "Are you sure you want to delete this product?",
        content: "This action cannot be undone",
        onOk() {
          deleteAndUpdateProd();
        },
      });
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "customer",
      filters: dataSource
        ?.filter((item) => item.name)
        .map((item) => ({
          text: item.name,
          value: item.name,
        })),
      filterSearch: true,
      onFilter: (value, record) => record.name.includes(value),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Location",
      dataIndex: "location",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Orders",
      dataIndex: "orders",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Amount Spent",
      dataIndex: "amountSpent",
      sorter: (a, b) => a.price - b.price,
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        return <Action id={record.key} handleDelete={handleDelete} />;
      },
    },
  ];

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Flex gap="middle" vertical className="p-6">
      <Flex align="center" justify="end" gap="middle">
        <Link href="/admin/products/new">
          <Button
            className="!bg-primary !text-white"
            onClick={start}
            loading={loading}
          >
            Add new customer
          </Button>
        </Link>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
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
      />
    </Flex>
  );
};

export default memo(ProductsList);
