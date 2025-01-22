"use client";

import { useState, memo, useEffect, useMemo, useCallback } from "react";
import { Button, Flex, Table, message, Form, Tag } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";
import {
  getAdminProduct,
  deleteProduct,
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
import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/app/ui/spinner";

const DiscountModal = memo(
  dynamic(() => import("@/app/(frontend)/admin/ui/products/discount-model"), {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }),
);

const Action = memo(
  dynamic(() => import("@/app/(frontend)/admin/ui/table-action"), {
    ssr: false,
  }),
);

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
            action: (
              <Action
                id={item.id}
                handleDelete={handleDelete}
                handleArchive={handleArchive}
              />
            ),
          }))
        : [],
    [products, handleDelete, handleArchive],
  );

  const handleAddToSales = useCallback(() => {
    setIsModalOpen(true);
  }, []);

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
      },
    ],
    [dataSource, categoryData],
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
    <Flex gap="middle" vertical className="px-3 py-12 sm:px-4">
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
      <DiscountModal
        isOpen={isModalOpen}
        onClose={handleModalCancel}
        selectedProducts={selectedRowKeys}
        saleCollections={saleCollections}
        onSuccess={mutate}
        loading={loading}
        setLoading={setLoading}
      />
    </Flex>
  );
});

export default ProductsList;
