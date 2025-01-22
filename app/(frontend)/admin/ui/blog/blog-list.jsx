"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  DatePicker,
  Typography,
  Tag,
  Dropdown,
  Modal,
  message,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { getAllBlogs, deleteBlog } from "@/app/action/blogAction";

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function BlogList({ searchParams }) {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10);

  const page = useMemo(() => searchParams.page || 1, [searchParams]);

  const {
    data: blogs,
    isLoading,
    mutate,
  } = useSWR(
    `/api/blogs?page=${page}&search=${searchText}&status=${status || ""}`,
    () => getAllBlogs({ page, limit, search: searchText, status }),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        console.log(data, "data🔥🔥🔥");
        setTotalCount(data.pagination.total);
      },
    },
  );

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this blog?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteBlog(id);
          message.success("Blog deleted successfully");
          mutate();
        } catch (error) {
          message.error(error.message || "Failed to delete blog");
        }
      },
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link
          href={`/admin/blogs/${record._id}`}
          className="text-blue-600 hover:underline"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (author) => author || "Unknown",
    },
    {
      title: "Published Date",
      dataIndex: "publishedAt",
      key: "publishedAt",
      render: (date, record) =>
        date ? new Date(date).toLocaleDateString() : "Not published",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "published" ? "green" : "orange"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: <Link href={`/admin/blogs/${record._id}`}>Edit</Link>,
              },
              {
                key: "delete",
                label: "Delete",
                danger: true,
                onClick: () => handleDelete(record._id),
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handlePageChange = (newPage) => {
    router.push(`/admin/blogs?page=${newPage}`);
  };

  return (
    <div className="px-3 py-12 sm:px-4">
      <div className="mb-6 flex items-center justify-between">
        <Title level={2}>Blogs Overview</Title>
        <Link href="/admin/blogs/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Create New Blog
          </Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap gap-4">
          <Input
            placeholder="Search blogs..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Filter by status"
            allowClear
            value={status}
            onChange={setStatus}
            style={{ width: 150 }}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
            ]}
          />
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            style={{ width: 250 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={blogs?.data}
          rowKey="id"
          pagination={{
            current: parseInt(page),
            pageSize: limit,
            total: totalCount,
            onChange: handlePageChange,
          }}
          loading={
            isLoading
              ? {
                  indicator: <LoadingOutlined spin className="!text-primary" />,
                  size: "large",
                }
              : false
          }
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}
