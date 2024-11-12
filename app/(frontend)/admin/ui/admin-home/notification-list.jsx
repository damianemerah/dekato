import { Avatar, List } from "antd";
import { EditOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

const Card = dynamic(() => import("antd/lib/card"), { ssr: false });

const NotificationList = ({ notifications }) => {
  return (
    <Card title="Recent Notifications">
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={<EditOutlined />}
                  style={{
                    backgroundColor:
                      item.type === "info"
                        ? "#1890ff"
                        : item.type === "warning"
                          ? "#faad14"
                          : "#ff4d4f",
                  }}
                />
              }
              title={item.title}
              description={item.message}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default NotificationList;
