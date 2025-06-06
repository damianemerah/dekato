'use client';

import { useState, memo, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Flex,
  Table,
  Dropdown,
  Space,
  message,
  Modal,
  Tag,
} from 'antd';
import {
  DownOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import useSWRImmutable from 'swr/immutable';
import {
  getAllCollections,
  deleteCollection,
} from '@/app/action/collectionAction';
import noImage from '@/public/assets/no-image.webp';

const Action = memo(function Action({ id, handleDelete }) {
  const items = [
    {
      label: (
        <Link
          rel="noopener noreferrer"
          href={`/admin/collections/${id}`}
          className="!text-blue-500"
        >
          Edit
        </Link>
      ),
      key: '0',
    },
    {
      label: (
        <p target="_blank" rel="noopener noreferrer" onClick={handleDelete}>
          Delete
        </p>
      ),
      key: '1',
      danger: true,
    },
    {
      label: 'Archive',
      key: '3',
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

const CollectionList = ({ searchParams }) => {
  const page = useMemo(() => searchParams.page || 1, [searchParams]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(searchParams?.limit || 20);

  const router = useRouter();

  const {
    data: collections,
    isLoading,
    mutate,
  } = useSWRImmutable(
    `/api/allCollections?page=${page}`,
    () => getAllCollections({ page, limit }),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        setTotalCount(data.totalCount);
        setLimit(data.limit);
      },
    }
  );

  const dataSource = collections?.data?.map((item) => ({
    key: item.id,
    image: item.image[0],
    name: item.name,
    id: item.id,
    category: item.category?.name || 'Uncategorized',
    isSale: item.isSale,
    productCount: item.productCount,
    action: <Action id={item.id} />,
  }));

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
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
      title: 'Name',
      dataIndex: 'name',
      filters: dataSource?.map((item) => ({
        text: item.name,
        value: item.name,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.name.includes(value),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      filters: [...new Set(dataSource?.map((item) => item.category))].map(
        (category) => ({
          text: category,
          value: category,
        })
      ),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Sale',
      dataIndex: 'isSale',
      render: (isSale) => (
        <Tag color={isSale ? 'green' : 'default'}>
          {isSale ? 'Sale' : 'Regular'}
        </Tag>
      ),
      filters: [
        { text: 'Sale', value: true },
        { text: 'Regular', value: false },
      ],
      onFilter: (value, record) => record.isSale === value,
    },
    {
      title: 'Product Count',
      dataIndex: 'productCount',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => {
        return (
          <Action
            id={record.id}
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
      const collection = collections?.data?.find(
        (collection) => collection.id === id
      );
      if (collection.productCount > 0) {
        message.warning(
          'Products in this collection. Move products to other collection',
          4
        );
        return;
      }
      const result = await deleteCollection(id);

      if (result?.error) {
        message.error('Error deleting collection');
        return;
      }

      await mutate();
      message.success('Deleted');
    } catch (error) {
      message.error('Error');
    }
  };

  const handleDeleteSelected = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete these collections?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          setLoading(true);
          for (const id of selectedRowKeys) {
            const collection = collections?.data?.find(
              (collection) => collection.id === id
            );
            if (collection.productCount > 0) {
              message.warning(
                `Cannot delete collection "${collection.name}". It contains products.`,
                4
              );
            } else {
              const result = await deleteCollection(id);
              if (result?.error) {
                message.error(`Error deleting collection "${collection.name}"`);
                return;
              }
            }
          }
          await mutate();
          setSelectedRowKeys([]);
          message.success('Selected collections deleted');
        } catch (error) {
          message.error('Error deleting collections');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handlePageChange = (page) => {
    router.push(`/admin/collections?page=${page}`);
  };

  return (
    <Flex gap="middle" vertical className="px-3 py-12 sm:px-4">
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
        scroll={{ x: 'max-content' }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource || []}
        pagination={{
          current: parseInt(page),
          pageSize: limit,
          showSizeChanger: false,
          total: totalCount,
          onChange: handlePageChange,
        }}
        loading={
          isLoading
            ? {
                indicator: <LoadingOutlined spin className="!text-primary" />,
                size: 'large',
              }
            : false
        }
      />
    </Flex>
  );
};

export default CollectionList;
