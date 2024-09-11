"use client";

import React, { useState, memo, useEffect } from "react";
import { Button, Flex, Table, Dropdown, Space, message, Modal } from "antd";
import { DownOutlined, LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";
import { getAdminProduct, deleteProduct } from "@/app/action/productAction";
import { getAllCategories } from "@/app/action/categoryAction";
import useSWR from "swr";
import image6 from "@/public/assets/no-image.webp";
import Link from "next/link";

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

  const {
    data: products,
    mutate,
    isLoading,
  } = useSWR("/admin/products", () => getAdminProduct(), {
    revalidateOnFocus: false,
  });

  const { data: collections } = useSWR("/api/allCategories", getAllCategories, {
    revalidateOnFocus: false,
  });

  const dataSource = products?.map((item) => ({
    key: item.id,
    image: item.image[0],
    name: item.name,
    status: item.status,
    productCount: item.quantity,
    category: item.cat.join(", "),
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
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Inventory",
      dataIndex: "productCount",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Category",
      dataIndex: "category",
      filters: collections?.map((item) => ({
        text: item?.name ? item.name : "",
        value: item?.name ? item.name : "",
      })),
      filterSearch: true,
      onFilter: (value, record) => {
        console.log(value, "value");
        return record?.category.includes(value);
      },
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
            Add new product
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
