"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "@/style/globals.css";
import "./admin.css";
import { SWRDevTools } from "swr-devtools";
import AdminSidebar from "./ui/sidebar";
import { Layout } from "antd";

function AdminLayout({ children }) {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  const selected = paths.length > 0 ? paths[paths.length - 1] : "admin";
  const [selectedNavItem, setSelectedNavItem] = useState(selected);
  const [isLoading, setIsLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const handleNavItemClick = (item) => {
    setSelectedNavItem(item);
    setIsLoading(true);
  };

  return (
    <SWRDevTools>
      <Layout style={{ minHeight: "100vh" }}>
        <AdminSidebar
          selectedNavItem={selectedNavItem}
          onNavItemClick={handleNavItemClick}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            {isLoading ? <div>Loading...</div> : children}
          </div>
        </Layout>
      </Layout>
    </SWRDevTools>
  );
}

export default AdminLayout;
