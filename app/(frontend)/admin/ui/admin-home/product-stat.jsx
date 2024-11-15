import { Row, Col } from "antd";
import dynamic from "next/dynamic";

const Card = dynamic(() => import("antd/lib/card"), { ssr: false });
const Statistic = dynamic(() => import("antd/lib/statistic"), { ssr: false });

const TagOutlined = dynamic(() => import("@ant-design/icons/TagOutlined"), {
  ssr: false,
});
const InboxOutlined = dynamic(() => import("@ant-design/icons/InboxOutlined"), {
  ssr: false,
});
const PercentageOutlined = dynamic(
  () => import("@ant-design/icons/PercentageOutlined"),
  { ssr: false },
);

const ProductStatistics = ({ products, collections }) => {
  return (
    <Card title="Product Statistics">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="Active Products"
            value={products?.active}
            prefix={<InboxOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Out of Stock"
            value={products?.outOfStock}
            prefix={<InboxOutlined />}
            valueStyle={{ color: "#ff4d4f" }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Discounted Products"
            value={products?.discounted}
            prefix={<PercentageOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Collections"
            value={collections?.total}
            prefix={<TagOutlined />}
            valueStyle={{ color: "#13c2c2" }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ProductStatistics;
