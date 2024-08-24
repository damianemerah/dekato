"use client";

import React, { useState, memo } from "react";
import { Button, Flex, Table, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useCategoryStore } from "@/app/(frontend)/admin/store/adminStore";
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
    title: "Products",
    dataIndex: "productCount",
  },
  {
    title: "Parent Collection",
    dataIndex: "parent",
  },
  {
    title: "Action",
    dataIndex: "action",
    render: (_, record) => {
      console.log(record, "record");
      return <Action slug={record.slug} />;
    },
  },
];

const Action = memo(function Action({ slug }) {
  const items = [
    {
      label: (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={`/admin/collections/${slug}`}
        >
          Edit
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "3rd menu item（disabled）",
      key: "3",
      disabled: true,
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
          Hover me
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
});

const Collections = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const collections = useCategoryStore((state) => state.allCategories);

  const dataSource = collections.map((item) => {
    return {
      key: item.id,
      image: item.image[0],
      name: item.name,
      productCount: item.productCount,
      parent: item.parent,
      slug: item.slug,
      action: <Action slug={item.slug} />,
    };
  });

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

export default Collections;
