"use client";

import { Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Link from "next/link";
import { memo } from "react";

const TableAction = memo(function TableAction({
  id,
  handleDelete,
  handleArchive,
}) {
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

export default memo(TableAction);
