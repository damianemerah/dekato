"use client";

import { Layout, Typography, Skeleton } from "antd";
import { getAllUsers } from "@/app/action/userAction";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const { Content } = Layout;
const { Title } = Typography;

const CustomersList = dynamic(() => import("./customers-list"), {
  loading: () => <Skeleton active paragraph={{ rows: 5 }} />,
  ssr: false,
});

function CustomersContent({ initialData }) {
  const { data: customers, isLoading, mutate } = useSWR("/api/users", getAllUsers, {
    revalidateOnFocus: true,
    refreshInterval: 30000,
    fallbackData: initialData,
  });

  return (
    <Content style={{ padding: "24px" }}>
      <Title level={2}>Customers</Title>
      <Suspense fallback={<Skeleton active paragraph={{ rows: 5 }} />}>
        <CustomersList
          customers={customers}
          isLoading={isLoading}
          mutate={mutate}
        />
      </Suspense>
    </Content>
  );
}

export default CustomersContent;
