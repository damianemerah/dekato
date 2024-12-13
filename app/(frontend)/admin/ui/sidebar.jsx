import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
  PlusOutlined,
  TagOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const [selectedKeys, setSelectedKeys] = useState(["admin"]);
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname.split("/")[2] || "admin";
    setSelectedKeys([path]);
  }, [pathname]);

  const menuItems = [
    {
      key: "app-home",
      icon: <ArrowLeftOutlined />,
      label: <Link href="/">Back to App</Link>,
    },
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
      label: "Products",
      children: [
        {
          key: "products-list",
          label: <Link href="/admin/products">All Products</Link>,
        },
        {
          key: "products-new",
          icon: <PlusOutlined />,
          label: <Link href="/admin/products/new">New Product</Link>,
        },
      ],
    },
    {
      key: "collections",
      icon: <TagOutlined />,
      label: "Collections",
      children: [
        {
          key: "collections-list",
          label: <Link href="/admin/collections">All Collections</Link>,
        },
        {
          key: "collections-new",
          icon: <PlusOutlined />,
          label: <Link href="/admin/collections/new">New Collection</Link>,
        },
      ],
    },
    {
      key: "categories",
      icon: <AppstoreOutlined />,
      label: "Categories",
      children: [
        {
          key: "categories-list",
          label: <Link href="/admin/categories">All Categories</Link>,
        },
        {
          key: "categories-new",
          icon: <PlusOutlined />,
          label: <Link href="/admin/categories/new">New Category</Link>,
        },
      ],
    },
    {
      key: "blogs",
      icon: <FileTextOutlined />,
      label: "Blogs",
      children: [
        {
          key: "blogs-list",
          label: <Link href="/admin/blogs">All Blogs</Link>,
        },
        {
          key: "blogs-new",
          icon: <PlusOutlined />,
          label: <Link href="/admin/blogs/new">New Blog</Link>,
        },
      ],
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
        top: 0,
        bottom: 0,
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <div className="logo" style={{ height: 20, margin: 16 }} />
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
