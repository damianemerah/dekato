"use client";

import { useState, memo, useMemo } from "react";
import {
  Button,
  Flex,
  Table,
  Dropdown,
  Space,
  Checkbox,
  InputNumber,
  message,
  Modal,
} from "antd";
import {
  DownOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import {
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "@/app/action/categoryAction";
import noImage from "@/public/assets/no-image.webp";
import { useRouter } from "next/navigation";

const Action = memo(function Action({ id, handleDelete }) {
  const items = [
    {
      label: (
        <Link
          rel="noopener noreferrer"
          href={`/admin/categories/${id}`}
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

const Categories = ({ searchParams }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pinOrders, setPinOrders] = useState({});
  const [changedRows, setChangedRows] = useState({});
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);

  const router = useRouter();

  const page = useMemo(() => searchParams.page || 1, [searchParams]);

  const {
    data: categoryData,
    isLoading,
    mutate,
  } = useSWR(
    `/api/allCategories?page=${page}`,
    () => getAllCategories({ page }),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data && Array.isArray(data.data)) {
          setCategories(data.data);
          setTotalCount(data.totalCount);
          setLimit(data.limit);

          // Set up pin orders
          const pins = data.data.reduce((acc, c) => {
            acc[c.id] = {
              pinOrder: c.pinOrder,
              isChecked: !!c.pinned,
            };
            return acc;
          }, {});
          setPinOrders(pins);
        }
      },
    },
  );

  const handlePinChange = (key, isChecked) => {
    const category = categories.find((cat) => cat.id === key);
    if (
      category.name.toLowerCase() === "men" ||
      category.name.toLowerCase() === "women"
    ) {
      message.error("Cannot pin 'men' or 'women' categories");
      return;
    }

    const parentCategory = categories.find(
      (cat) => cat.id === category.parent?.id,
    );
    const pinnedCount = categories.filter(
      (cat) => cat.parent?.id === category.parent?.id && cat.pinned,
    ).length;

    // Check if the category is already pinned
    const isAlreadyPinned = category.pinned;

    if (isChecked && pinnedCount >= 5 && !isAlreadyPinned) {
      message.error(
        `Cannot pin more than 5 categories under ${parentCategory?.name || "parent category"}`,
      );
      return;
    }

    setPinOrders((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        isChecked,
      },
    }));
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
        pinOrder: value,
      },
    }));
    setChangedRows((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  // Handle form submission
  const submitForm = async (key) => {
    const { pinOrder, isChecked } = pinOrders[key];
    const formData = new FormData();
    formData.append("id", key);
    formData.append("pinOrder", pinOrder);
    formData.append("pinned", isChecked);

    try {
      await updateCategory(formData);
      setChangedRows((prev) => ({
        ...prev,
        [key]: false,
      }));
      message.info("Updated");
    } catch (error) {}
  };

  const cancelChanges = (key) => {
    setPinOrders((prev) => ({
      ...prev,
      [key]: categories.find((item) => item.id === key)
        ? {
            pinOrder: categories.find((item) => item.id === key).pinOrder,
            isChecked: !!categories.find((item) => item.id === key).pinned,
          }
        : undefined,
    }));
    setChangedRows((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  const dataSource = Array.isArray(categories)
    ? categories.map((item) => ({
        key: item.id,
        image: item.image[0],
        name: item.name,
        productCount: item.productCount,
        parent: item?.parent ? item.parent.name : "",
        id: item.id,
        action: <Action id={item.id} />,
        pinOrder: pinOrders[item.id]?.pinOrder || undefined,
        isChecked: pinOrders[item.id]?.isChecked,
      }))
    : [];

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
      title: "Parent Category",
      dataIndex: "parent",
      filters: Array.isArray(categories)
        ? categories.map((item) => ({
            text: item.name ? item.name : "",
            value: item.name ? item.name : "",
          }))
        : [],
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
            id={record.id}
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
      const category = categories.find((category) => category.id === id);
      if (category.productCount > 0) {
        message.warning(
          "Products in this category. Move products to other category",
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

  const handleDeleteSelected = () => {
    Modal.confirm({
      title: "Are you sure you want to delete these categories?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          setLoading(true);
          for (const id of selectedRowKeys) {
            const category = categories.find((category) => category.id === id);
            if (category.productCount > 0) {
              message.warning(
                `Cannot delete category "${category.name}". It contains products.`,
                4,
              );
            } else {
              await deleteCategory(id);
            }
          }
          await mutate();
          setSelectedRowKeys([]);
          message.success("Selected categories deleted");
        } catch (error) {
          message.error("Error deleting categories");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handlePageChange = (page) => {
    router.push(`/admin/categories?page=${page}`);
  };

  return (
    <>
      <Flex gap="middle" vertical className="p-6">
        <Flex align="center" justify="end" gap="middle">
          <Link href="/admin/categories/new">
            <Button
              className="!bg-primary !text-white"
              onClick={start}
              loading={loading}
            >
              Add new category
            </Button>
          </Link>
          {hasSelected && (
            <Button danger onClick={handleDeleteSelected} loading={loading}>
              Delete Selected
            </Button>
          )}
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
        </Flex>
        <div className="overflow-x-auto">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource || []}
            loading={
              isLoading
                ? {
                    indicator: (
                      <LoadingOutlined spin className="!text-primary" />
                    ),
                    size: "large",
                  }
                : false
            }
            pagination={{
              current: parseInt(page),
              pageSize: limit,
              showSizeChanger: false,
              total: totalCount,
              onChange: handlePageChange,
            }}
            scroll={{ x: "max-content" }}
          />
        </div>
      </Flex>
    </>
  );
};

export default memo(Categories);
