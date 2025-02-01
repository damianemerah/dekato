import dynamic from "next/dynamic";

const Row = dynamic(() => import("antd/lib/row"), { ssr: false });
const Col = dynamic(() => import("antd/lib/col"), { ssr: false });
const Card = dynamic(() => import("antd/lib/card"), { ssr: false });
const Statistic = dynamic(() => import("antd/lib/statistic"), { ssr: false });
const Progress = dynamic(() => import("antd/lib/progress"), { ssr: false });

const OrderStatus = ({ dashboardData }) => {
  return (
    <Card title="Order Status Overview">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Statistic
            title="Pending Orders"
            value={dashboardData?.orderStatus?.pending}
            valueStyle={{ color: "#faad14" }}
          />
          <Progress
            percent={Math.round(
              (dashboardData?.orderStatus?.pending /
                dashboardData?.totalOrders) *
                100,
            )}
            strokeColor="#faad14"
          />
        </Col>
        <Col span={24}>
          <Statistic
            title="Shipped Orders"
            value={dashboardData?.orderStatus?.shipped}
            valueStyle={{ color: "#1890ff" }}
          />
          <Progress
            percent={Math.round(
              (dashboardData?.orderStatus?.shipped /
                dashboardData?.totalOrders) *
                100,
            )}
            strokeColor="#1890ff"
          />
        </Col>
        <Col span={24}>
          <Statistic
            title="Delivered Orders"
            value={dashboardData?.orderStatus?.delivered}
            valueStyle={{ color: "#52c41a" }}
          />
          <Progress
            percent={Math.round(
              (dashboardData?.orderStatus?.delivered /
                dashboardData?.totalOrders) *
                100,
            )}
            strokeColor="#52c41a"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default OrderStatus;
