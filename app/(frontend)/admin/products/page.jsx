"use client";

import React, { useState, memo, useEffect } from "react";
import { Button, Flex, Table, Dropdown, Space, message, Modal } from "antd";
import { DownOutlined, LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";
import { getAdminProduct, deleteProduct } from "@/app/action/productAction";
import { getAllCategories } from "@/app/action/categoryAction";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import noImage from "@/public/assets/no-image.webp";
import Link from "next/link";
import useConfirmModal from "@/app/ui/confirm-modal";

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
  const showConfirmModal = useConfirmModal();

  const {
    data: products,
    mutate,
    isLoading,
  } = useSWR("/admin/products", () => getAdminProduct(), {
    revalidateOnFocus: true,
  });

  const { data: categories } = useSWRImmutable(
    "/api/allCategories",
    getAllCategories,
    {
      revalidateOnFocus: false,
    },
  );

  const dataSource = products?.map((item) => ({
    key: item.id,
    image: item.image[0],
    name: item.name,
    status: item.status,
    productCount: item.quantity,
    category: item.category?.map((cat) => cat.name).join(", ") || "",
    action: <Action />,
  }));

  const handleDelete = async (id) => {
    const deleteAndUpdateProd = async () => {
      try {
        await deleteProduct(id);
        await mutate("/admin/products");
        message.success("Product deleted successfully");
      } catch (error) {
        message.error("Failed to delete product");
      }
    };
    try {
      showConfirmModal({
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

  const handleDeleteSelected = async () => {
    const deleteSelectedProducts = async () => {
      setLoading(true);
      try {
        await Promise.all(selectedRowKeys.map((id) => deleteProduct(id)));
        await mutate("/admin/products");
        setSelectedRowKeys([]);
        message.success("Selected products deleted successfully");
      } catch (error) {
        message.error("Failed to delete selected products");
      } finally {
        setLoading(false);
      }
    };

    showConfirmModal({
      title: "Are you sure you want to delete the selected products?",
      content: "This action cannot be undone",
      onOk() {
        deleteSelectedProducts();
      },
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (_, record) => {
        const imageSrc = record?.image ? record.image : noImage;
        return (
          <Image
            src={imageSrc}
            alt={record.name}
            width={50}
            height={50}
            loading="lazy"
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
      filters: [
        { text: "Active", value: "active" },
        { text: "Draft", value: "draft" },
        { text: "Archived", value: "archived" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Inventory",
      dataIndex: "productCount",
      sorter: (a, b) => a.productCount - b.productCount,
    },
    {
      title: "Category",
      dataIndex: "category",
      filters: categories?.map((item) => ({
        text: item?.name ? item.name : "",
        value: item?.name ? item.name : "",
      })),
      filterSearch: true,
      onFilter: (value, record) => {
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
      <Flex align="center" justify="space-between" gap="middle">
        <Flex align="center" gap="middle">
          <Button
            danger
            onClick={handleDeleteSelected}
            disabled={!hasSelected}
            loading={loading}
          >
            Delete Selected
          </Button>
          {hasSelected && (
            <span>{`Selected ${selectedRowKeys.length} items`}</span>
          )}
        </Flex>
        <Link href="/admin/products/new">
          <Button className="!bg-primary !text-white" loading={loading}>
            Add new product
          </Button>
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

export default memo(ProductsList);
