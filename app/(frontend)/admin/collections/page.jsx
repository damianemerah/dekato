"use client";

import { useState, memo, useEffect } from "react";
import { Button, Flex, Table, Dropdown, Space, message, Modal } from "antd";
import {
  DownOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import useSWRImmutable from "swr/immutable";
import {
  getAllCollections,
  deleteCollection,
} from "@/app/action/collectionAction";
import image6 from "@/public/assets/no-image.webp";

const Action = memo(function Action({ slug, handleDelete }) {
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
        <p target="_blank" rel="noopener noreferrer" onClick={handleDelete}>
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

  const {
    data: collections,
    isLoading,
    mutate,
  } = useSWRImmutable("/api/allCollections", getAllCollections, {
    revalidateOnFocus: false,
    onSuccess: (data) => {
      console.log(data, "👇👇👇");
    },
  });

  const dataSource = collections?.map((item) => ({
    key: item.id,
    image: item.image[0],
    name: item.name,
    productCount: item.productCount,
    slug: item.slug,
    category: item.category?.name || "Uncategorized",
    action: <Action slug={item.slug} />,
  }));

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
            loading="lazy"
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
      title: "Category",
      dataIndex: "category",
      filters: [...new Set(dataSource?.map((item) => item.category))].map(
        (category) => ({
          text: category,
          value: category,
        }),
      ),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Products",
      dataIndex: "productCount",
      sorter: (a, b) => a.productCount - b.productCount,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <Action
            slug={record.slug}
            handleDelete={() => handleDelete(record.key)}
          />
        );
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
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const handleDelete = async (id) => {
    try {
      const collection = collections.find((collection) => collection.id === id);
      if (collection.productCount > 0) {
        message.warning(
          "Products in this collection. Move products to other collection",
          4,
        );
        return;
      }
      await deleteCollection(id);
      await mutate();
      message.success("Deleted");
    } catch (error) {
      message.error("Error");
    }
  };

  const handleDeleteSelected = () => {
    Modal.confirm({
      title: "Are you sure you want to delete these collections?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          setLoading(true);
          for (const id of selectedRowKeys) {
            const collection = collections.find(
              (collection) => collection.id === id,
            );
            if (collection.productCount > 0) {
              message.warning(
                `Cannot delete collection "${collection.name}". It contains products.`,
                4,
              );
            } else {
              await deleteCollection(id);
            }
          }
          await mutate();
          setSelectedRowKeys([]);
          message.success("Selected collections deleted");
        } catch (error) {
          message.error("Error deleting collections");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <>
      <Flex gap="middle" vertical className="p-6">
        <Flex align="center" justify="end" gap="middle">
          <Link href="/admin/collections/new">
            <Button
              className="!bg-primary !text-white"
              onClick={start}
              loading={loading}
            >
              Add new collection
            </Button>
          </Link>
          {hasSelected && (
            <Button danger onClick={handleDeleteSelected} loading={loading}>
              Delete Selected
            </Button>
          )}
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

export default Collections;
