"use client";

import { useState, memo, useEffect } from "react";
import { Button, Flex, Table, Dropdown, Space } from "antd";
import { DownOutlined, LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { getAllCategories } from "@/app/action/categoryAction";
import image6 from "@/public/assets/no-image.webp";
import { filter } from "lodash";
import { record } from "zod";

const Action = memo(function Action({ slug }) {
  const items = [
    {
      label: (
        <Link
          rel="noopener noreferrer"
          href={`/admin/collections/${slug}`}
          className="!text-blue-500"
        >
          Edit
        </Link>
      ),
      key: "0",
    },

    {
      label: (
        <p
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => alert("delete")}
        >
          Delete
        </p>
      ),
      key: "1",
      danger: true,
    },

    {
      label: "Archive",
      key: "3",
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

const Collections = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: collections, isLoading } = useSWR(
    "/api/allCategories",
    getAllCategories,
  );

  const dataSource = collections?.map((item) => {
    return {
      key: item.id,
      image: item.image[0],
      name: item.name,
      productCount: item.productCount,
      parent: item?.parent ? item.parent.name : "",
      slug: item.slug,
      action: <Action slug={item.slug} />,
    };
  });

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (_, record) => {
        const imageSrc = record?.image ? record.image : image6;
        return (
          <Image
            src={imageSrc}
            alt={record.name}
            width={50}
            height={50}
            className="h-[50px] w-[50px] rounded-lg object-cover"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      filters: dataSource?.map((item) => ({
        text: item.name,
        value: item.name,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.name.includes(value),
    },
    {
      title: "Products",
      dataIndex: "productCount",
      sorter: (a, b) => a.productCount - b.productCount,
    },
    {
      title: "Parent Collection",
      dataIndex: "parent",
      filters: collections?.map((item, i) => ({
        text: item.name ? item.name : "",
        value: item.name ? item.name : "",
      })),
      filterSearch: true,
      onFilter: (value, record) => {
        return record?.parent.includes(value);
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        return <Action slug={record.slug} />;
      },
    },
  ];

  const start = () => {
    setLoading(true);
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
    <>
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
    </>
  );
};

export default memo(Collections);
