import dynamic from "next/dynamic";
import { MailOutlined } from "@ant-design/icons";

const Card = dynamic(() => import("antd/lib/card"), { ssr: false });
const Statistic = dynamic(() => import("antd/lib/statistic"), { ssr: false });
const Row = dynamic(() => import("antd/lib/row"), { ssr: false });
const Col = dynamic(() => import("antd/lib/col"), { ssr: false });
const Progress = dynamic(() => import("antd/lib/progress"), { ssr: false });

const NewsletterStatistics = ({ newsletter }) => {
  const totalSubscribers = newsletter?.total || 0;
  const getPercentage = (value) => {
    return totalSubscribers > 0
      ? Math.round((value / totalSubscribers) * 100)
      : 0;
  };

  return (
    <Card title="Newsletter Statistics">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="Total Subscribers"
            value={newsletter?.total}
            prefix={<MailOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Active Subscribers"
            value={newsletter?.active}
            prefix={<MailOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col span={24}>
          <h4 className="mb-2 text-sm font-medium">Preferences Distribution</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Men&apos;s Fashion</span>
                <span>{newsletter?.preferences?.men || 0}</span>
              </div>
              <Progress
                percent={getPercentage(newsletter?.preferences?.men)}
                strokeColor="#1890ff"
                showInfo={false}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Women&apos;s Fashion</span>
                <span>{newsletter?.preferences?.women || 0}</span>
              </div>
              <Progress
                percent={getPercentage(newsletter?.preferences?.women)}
                strokeColor="#722ed1"
                showInfo={false}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Both</span>
                <span>{newsletter?.preferences?.both || 0}</span>
              </div>
              <Progress
                percent={getPercentage(newsletter?.preferences?.both)}
                strokeColor="#13c2c2"
                showInfo={false}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default NewsletterStatistics;
