"use client";

import { useState, memo, useEffect, useMemo, useCallback } from "react";
import {
  Button,
  Flex,
  Table,
  Dropdown,
  Space,
  message,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Select,
  Tag,
} from "antd";
import { DownOutlined, LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";
import {
  getAdminProduct,
  deleteProduct,
  updateProductDiscount,
  setProductStatus,
} from "@/app/action/productAction";
import { getAllCategories } from "@/app/action/categoryAction";
import { getSaleCollections } from "@/app/action/collectionAction";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import noImage from "@/public/assets/no-image.webp";
import Link from "next/link";
import useConfirmModal from "@/app/ui/confirm-modal";
import { useRouter } from "next/navigation";

const Action = memo(function Action({ id, handleDelete, handleArchive }) {
  const items = [
    {
      label: (
        <Link
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
      label: "Delete",
      key: "1",
      danger: true,
      onClick: () => handleDelete(id),
    },
    {
      label: "Archive",
      key: "2",
      onClick: () => handleArchive(id),
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

const ProductsList = memo(function ProductsList({ searchParams }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [limit, setLimit] = useState(2);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const showConfirmModal = useConfirmModal();

  const router = useRouter();

  const page = useMemo(() => searchParams.page || 1, [searchParams]);

  const {
    data: productData,
    mutate,
    isLoading,
  } = useSWR(`/admin/products?page=${page}`, () => getAdminProduct({ page }), {
    revalidateOnFocus: false,
    refreshInterval: 100000,
  });

  const { data: categoryData } = useSWRImmutable(
    "/api/allCategories",
    () => getAllCategories({ limit: 1000 }),
    {
      revalidateOnFocus: false,
    },
  );

  const { data: saleCollections } = useSWRImmutable(
    "/api/saleCollections",
    getSaleCollections,
    {
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (productData) {
      setTotalCount(productData.totalCount);
      setProducts(productData.data);
      setLimit(productData.limit);
    }
  }, [productData]);

  const dataSource = useMemo(
    () =>
      Array.isArray(products)
        ? products.map((item) => ({
            key: item.id,
            image: item.image[0],
            name: item.name,
            status: item.status,
            productCount: item.quantity,
            category: item.category?.map((cat) => cat.name).join(", ") || "",
            collection:
              item.campaign?.map((camp) => camp.name).join(", ") || "",
            discount: item.discount || 0,
            action: <Action />,
          }))
        : [],
    [products],
  );

  const handleDelete = useCallback(
    async (id) => {
      const deleteAndUpdateProd = async () => {
        try {
          await deleteProduct(id);
          await mutate();
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
    },
    [mutate, showConfirmModal],
  );

  const handleArchive = useCallback(
    async (id) => {
      try {
        await setProductStatus(id, "archived");
        await mutate();
        message.success("Product archived successfully");
      } catch (error) {
        message.error("Failed to archive product");
      }
    },
    [mutate],
  );

  const handleDeleteSelected = useCallback(async () => {
    const deleteSelectedProducts = async () => {
      setLoading(true);
      try {
        await Promise.all(selectedRowKeys.map((id) => deleteProduct(id)));
        await mutate();
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
  }, [selectedRowKeys, mutate, showConfirmModal]);

  const handleAddToSales = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalOk = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      for (const productId of selectedRowKeys) {
        await updateProductDiscount(
          productId,
          {
            discount: values.discount,
            discountDuration: values.discountDuration.toISOString(),
          },
          values.campaign,
        );
      }
      message.success("Products added to sales successfully");
      setIsModalOpen(false);
      form.resetFields();
      await mutate();
    } catch (error) {
      message.error("Failed to add products to sales");
    } finally {
      setLoading(false);
    }
  }, [form, selectedRowKeys, mutate]);

  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false);
    form.resetFields();
  }, [form]);

  const columns = useMemo(
    () => [
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
        title: "Inventory",
        dataIndex: "productCount",
        sorter: (a, b) => a.productCount - b.productCount,
      },
      {
        title: "Category",
        dataIndex: "category",
        filters:
          categoryData?.data?.map((item) => ({
            text: item?.name ? item.name : "",
            value: item?.name ? item.name : "",
          })) || [],
        filterSearch: true,
        onFilter: (value, record) => {
          return record?.category.includes(value);
        },
      },
      {
        title: "Collection",
        dataIndex: "collection",
        filters: Array.from(
          new Set(dataSource.map((item) => item.collection).filter(Boolean)),
        ).map((collection) => ({
          text: collection,
          value: collection,
        })),
        filterSearch: true,
        onFilter: (value, record) => record.collection.includes(value),
      },
      {
        title: "Discount",
        dataIndex: "discount",
        render: (discount) => `${discount}%`,
        sorter: (a, b) => a.discount - b.discount,
      },
      {
        title: "Status",
        dataIndex: "status",
        filters: [
          { text: "Active", value: "active" },
          { text: "Inactive", value: "inactive" },
          { text: "Archived", value: "archived" },
        ],
        defaultFilteredValue: ["active", "inactive"],
        onFilter: (value, record) => record.status === value,
        render: (status) => {
          let color = "green";
          if (status === "inactive") {
            color = "gold";
          } else if (status === "archived") {
            color = "red";
          } else if (status === "outofstock") {
            color = "gray";
          }
          return <Tag color={color}>{status.toUpperCase()}</Tag>;
        },
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (_, record) => {
          return (
            <Action
              id={record.key}
              handleDelete={handleDelete}
              handleArchive={handleArchive}
            />
          );
        },
      },
    ],
    [dataSource, categoryData, handleDelete, handleArchive],
  );

  const onSelectChange = useCallback((newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: onSelectChange,
    }),
    [selectedRowKeys, onSelectChange],
  );

  const hasSelected = selectedRowKeys.length > 0;

  const handlePageChange = useCallback(
    (page) => {
      router.push(`/admin/products?page=${page}`);
    },
    [router],
  );

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
            <>
              <span>{`Selected ${selectedRowKeys.length} items`}</span>
              <Button onClick={handleAddToSales}>Add to Sales</Button>
            </>
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
        pagination={{
          current: parseInt(page),
          pageSize: limit,
          showSizeChanger: false,
          total: totalCount,
          onChange: handlePageChange,
        }}
      />
      <Modal
        title="Add to Sales"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="discount"
            label="Discount Percentage"
            rules={[
              {
                required: true,
                message: "Please input the discount percentage!",
              },
            ]}
          >
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item
            name="discountDuration"
            label="Discount Duration"
            rules={[
              {
                required: true,
                message: "Please select the discount duration!",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="campaign"
            label="Sale Collection"
            rules={[
              {
                required: false,
                message: "Please select a sale collection!",
              },
            ]}
          >
            <Select placeholder="Select a sale collection" allowClear>
              {saleCollections?.map((collection) => (
                <Select.Option key={collection.id} value={collection.id}>
                  {collection.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
});

export default ProductsList;
