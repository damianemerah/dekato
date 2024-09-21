"use client";

import { useState, memo, useEffect } from "react";
import {
  Button,
  Flex,
  Table,
  Dropdown,
  Space,
  Checkbox,
  InputNumber,
  message,
} from "antd";
import { DownOutlined, LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import useSWRImmutable from "swr/immutable";
import {
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "@/app/action/categoryAction";
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
  const [pinOrders, setPinOrders] = useState({}); // Track pinOrder and isChecked
  const [changedRows, setChangedRows] = useState({}); // Track which rows have been changed

  const {
    data: collections,
    isLoading,
    mutate,
  } = useSWRImmutable("/api/allCategories", getAllCategories, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (!collections) return;
    const pins = collections.reduce((acc, c) => {
      acc[c.id] = {
        pinOrder: c.pinOrder, // Set default pin order
        isChecked: !!c.pinned, // Track whether it's pinned
      };
      return acc;
    }, {});

    setPinOrders(pins);
  }, [collections]);

  // Handle pin checkbox changes
  const handlePinChange = (key, isChecked) => {
    setPinOrders((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        isChecked, // Track checkbox state
      },
    }));

    // Mark the row as changed
    setChangedRows((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  // Handle pin order number input changes
  const handlePinOrderChange = (key, value) => {
    setPinOrders((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        pinOrder: value, // Track pin order value
      },
    }));

    // Mark the row as changed
    setChangedRows((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  // Handle form submission
  const submitForm = async (key) => {
    const { pinOrder, isChecked } = pinOrders[key];

    // Prepare the form data for submission
    const formData = new FormData();
    formData.append("id", key);
    formData.append("pinOrder", pinOrder);
    formData.append("pinned", isChecked);

    try {
      // Call the updateCategory API with form data
      await updateCategory(formData);
      // Reset the change state for this row after successful submission
      setChangedRows((prev) => ({
        ...prev,
        [key]: false,
      }));
      message.info("Updated"); // Ensure this is reached
    } catch (error) {
    }
  };

  const cancelChanges = (key) => {
    // Reset pin order and checked state for this row
    setPinOrders((prev) => ({
      ...prev,
      [key]: collections.find((item) => item.id === key)
        ? {
            pinOrder: collections.find((item) => item.id === key).pinOrder,
            isChecked: !!collections.find((item) => item.id === key).pinned,
          }
        : undefined,
    }));
    setChangedRows((prev) => ({
      ...prev,
      [key]: false, // Reset the change state
    }));
  };

  const dataSource = collections?.map((item) => ({
    key: item.id,
    image: item.image[0],
    name: item.name,
    productCount: item.productCount,
    parent: item?.parent ? item.parent.name : "",
    slug: item.slug,
    action: <Action slug={item.slug} />,
    pinOrder: pinOrders[item.id]?.pinOrder,
    isChecked: pinOrders[item.id]?.isChecked,
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
      filters: collections?.map((item) => ({
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
        return (
          <Action
            slug={record.slug}
            handleDelete={() => handleDelete(record.key)}
          />
        );
      },
    },
    {
      title: "Pin",
      dataIndex: "pin",
      sorter: (a, b) => a.pinOrder - b.pinOrder,
      render: (_, record) => (
        <Flex gap="small" align="center">
          <Checkbox
            checked={record.isChecked}
            onChange={(e) => handlePinChange(record.key, e.target.checked)}
          />
          <InputNumber
            min={1}
            disabled={!pinOrders[record.key]?.isChecked}
            value={record?.pinOrder}
            onChange={(value) => handlePinOrderChange(record.key, value)}
          />
          {changedRows[record.key] && (
            <Flex className="flex-col">
              <Button
                className="!text-blue-500"
                type="text"
                onClick={() => submitForm(record.key)}
              >
                Submit
              </Button>
              <Button type="text" onClick={() => cancelChanges(record.key)}>
                Cancel
              </Button>
            </Flex>
          )}
        </Flex>
      ),
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
      const category = collections.find((category) => category.id === id);
      if (category.productCount > 0) {
        message.warning(
          "Products in this collection. Move products to other collection",
          4,
        );
        return;
      }
      await deleteCategory(id);
      await mutate();
      message.success("Deleted");
    } catch (error) {
      message.error("Error");
    }
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
