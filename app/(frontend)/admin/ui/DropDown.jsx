import { Select, Space } from "antd";
import { memo } from "react";

const DropDown = ({
  selectedKeys,
  handleChange,
  mode,
  options,
  placeholder = "Please select",
}) => (
  <Space
    style={{
      width: "100%",
      maxWidth: "400px",
    }}
    direction="vertical"
  >
    <Select
      mode={mode}
      allowClear
      style={{
        width: "100%",
      }}
      placeholder={placeholder}
      value={selectedKeys || undefined}
      onChange={handleChange}
      options={options}
    />
  </Space>
);
export default memo(DropDown);
