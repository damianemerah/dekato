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

function LoadingSpinner({ className }) {
  return (
    <div
      className={`flex h-40 w-full items-center justify-center ${className}`}
    >
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

export { BigSpinner, SmallSpinner, LoadingSpinner };
