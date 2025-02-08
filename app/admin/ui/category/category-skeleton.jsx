"use client";

import { Table } from "antd";
import { Skeleton } from "antd";
import { memo } from "react";

export const CategorySkeleton = memo(function CategorySkeleton() {
  const columns = [
    { title: "Image", dataIndex: "image", width: 100 },
    { title: "Name", dataIndex: "name" },
    { title: "Products", dataIndex: "products" },
    { title: "Parent Category", dataIndex: "parent" },
    { title: "Action", dataIndex: "action" },
    { title: "Pin", dataIndex: "pin" },
  ];

  const data = Array(5)
    .fill()
    .map((_, index) => ({
      key: index,
      image: (
        <div className="h-[50px] w-[50px] overflow-hidden rounded-lg">
          <Skeleton.Image active style={{ width: 50, height: 50 }} />
        </div>
      ),
      name: <Skeleton.Input active size="small" style={{ width: 120 }} />,
      products: <Skeleton.Input active size="small" style={{ width: 50 }} />,
      parent: <Skeleton.Input active size="small" style={{ width: 120 }} />,
      action: <Skeleton.Button active size="small" />,
      pin: (
        <div className="flex items-center gap-2">
          <Skeleton.Button active size="small" style={{ width: 20 }} />
          <Skeleton.Input active size="small" style={{ width: 60 }} />
        </div>
      ),
    }));

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Skeleton.Button active style={{ width: 150 }} />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
      />
    </>
  );
});
