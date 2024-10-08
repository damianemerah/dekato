import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const BigSpinner = ({ className }) => (
  <Spin
    indicator={
      <LoadingOutlined
        style={{ fontSize: 48 }}
        spin
        className={`!text-primary ${className}`}
      />
    }
    size="large"
  />
);

const SmallSpinner = ({ className }) => (
  <Spin
    indicator={
      <LoadingOutlined
        style={{ fontSize: 24 }}
        spin
        className={`${className}`}
      />
    }
    size="small"
  />
);

export { BigSpinner, SmallSpinner };
