import React from "react";
import { Menu, Dropdown, message, Space } from "antd";
import UpIcon from "@/public/assets/icons/up.svg";

const handleMenuClick = (e) => {
  message.info("Click on menu item.");
  console.log("click", e);
};

const DropDown = ({ items, selectedVal }) => {
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <Dropdown
      menu={menuProps}
      className="!w-20 items-center rounded-lg bg-white p-3 shadow-shadowSm"
    >
      <Space>
        {selectedVal || "Select option"}
        <UpIcon />
      </Space>
    </Dropdown>
  );
};
export default DropDown;
