import { Tag } from "antd";
import dynamic from "next/dynamic";

const Table = dynamic(() => import("antd/lib/table"), { ssr: false });

const OrderTable = ({ recentOrders, isLoading }) => {
  const columns = [
    { title: "Receipt #", dataIndex: "order", key: "order" },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Total", dataIndex: "total", key: "total" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          pending: "gold",
          shipped: "blue",
          delivered: "green",
          cancelled: "red",
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={recentOrders}
      pagination={false}
      loading={isLoading}
      scroll={{ x: "max-content" }}
    />
  );
};

export default OrderTable;
