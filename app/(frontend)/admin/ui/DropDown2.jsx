import { Select, Space } from "antd";
import { memo } from "react";

const DropDown = ({ selectedKeys, handleChange, mode, options }) => (
  <Space
    style={{
      width: "100%",
    }}
    direction="vertical"
  >
    <Select
      mode={mode}
      allowClear
      style={{
        width: "100%",
      }}
      placeholder="Please select"
      value={selectedKeys}
      onChange={handleChange}
      options={options}
    />
  </Space>
);
export default memo(DropDown);
