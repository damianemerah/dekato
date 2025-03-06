import { formatToNaira } from '@/app/utils/getFunc';

// Static imports
import { Space } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  ShopOutlined,
} from '@ant-design/icons';

// Dynamic imports
import dynamic from 'next/dynamic';

const Row = dynamic(() => import('antd/lib/row'), { ssr: false });
const Col = dynamic(() => import('antd/lib/col'), { ssr: false });
const Card = dynamic(() => import('antd/lib/card'), { ssr: false });
const Statistic = dynamic(() => import('antd/lib/statistic'), { ssr: false });

const Statistics = ({ dashboardData }) => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Sales"
            value={formatToNaira(dashboardData?.totalSales)}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Orders"
            value={dashboardData?.totalOrders}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Customers"
            value={dashboardData?.totalCustomers}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Products"
            value={dashboardData?.products?.total}
            prefix={<ShopOutlined />}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Statistics;
