"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import AdminSidebar from "@/app/(frontend)/admin/ui/sidebar";
import Layout from "antd/lib/layout";

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
  );
}

export default AdminLayout;
