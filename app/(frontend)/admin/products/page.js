"use client";

import React, { useState, memo } from "react";
import { Button, Flex, Table, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Image from "next/image";
import { getAdminProduct } from "@/app/action/productAction";
import { useProductStore } from "@/app/(frontend)/admin/store/adminStore";
import useSWR from "swr";
import Link from "next/link";

const columns = [
  {
    title: "Image",
    dataIndex: "image",
    render: (_, record) => (
      <Image
        src={record.image}
        alt={record.name}
        width={50}
        height={50}
        className="h-[50px] w-[50px] rounded-lg object-cover"
      />
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Inventory",
    dataIndex: "productCount",
  },
  {
    title: "Category",
    dataIndex: "category",
  },

  {
    title: "Action",
    dataIndex: "action",
    render: (_, record) => {
      console.log(record, "record");
      return <Action id={record.key} />;
    },
  },
];

const Action = memo(function Action({ id }) {
  const items = [
    {
      label: (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={`/admin/products/${id}`}
          className="!text-blue-500"
        >
          Edit
        </Link>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <p
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => alert("delete")}
          className="text-red-500"
        >
          Delete
        </p>
      ),
      key: "1",
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

  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);
  useSWR("/admin/products", () => getAdminProduct(), {
    onSuccess: (products) => {
      return setProducts(products);
    },
  });

  const dataSource = products.map((item) => ({
    key: item.id,
    image: item.image[0],
    name: item.name,
    status: item.status,
    productCount: item.quantity,
    category: item.cat.join(", "),
    action: <Action />,
  }));

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <Flex gap="middle" vertical className="p-6">
      <Flex align="center" gap="middle">
        <Button
          type="primary"
          onClick={start}
          disabled={!hasSelected}
          loading={loading}
        >
          Reload
        </Button>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
      </Flex>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource || []}
      />
    </Flex>
  );
};

export default memo(ProductsList);
