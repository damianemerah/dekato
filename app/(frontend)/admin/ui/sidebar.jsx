import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(["admin"]);
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname.split("/")[2] || "admin";
    setSelectedKeys([path]);
  }, [pathname]);

  const menuItems = [
    {
      key: "admin",
      icon: <HomeOutlined />,
      label: <Link href="/admin">Home</Link>,
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: <Link href="/admin/orders">Orders</Link>,
    },
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: <Link href="/admin/products">Products</Link>,
    },
    {
      key: "collections",
      icon: <AppstoreOutlined />,
      label: <Link href="/admin/collections">Collections</Link>,
    },
    // {
    //   key: "inventory",
    //   icon: <DatabaseOutlined />,
    //   label: <Link href="/admin/products/inventory">Inventory</Link>,
    // },
    {
      key: "customers",
      icon: <UserOutlined />,
      label: <Link href="/admin/customers">Customers</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: "4rem",
        bottom: 0,
        borderRight: "1px solid #f0f0f0",
      }}
    >
      {/* <div
        className="logo"
        style={{ height: 32, margin: 16, background: "rgba(0, 0, 0, 0.2)" }}
      /> */}
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={selectedKeys}
        items={menuItems}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
}
