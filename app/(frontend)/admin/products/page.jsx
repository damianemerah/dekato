"use client";
import { Badge, Box, Card, Page } from "@shopify/polaris";

import ProductsIndexFilter from "@/app/(frontend)/admin/ui/products/ProductsFilter";
import ProductsIndexTable from "@/app/(frontend)/admin/ui/products/ProductsTable";
import {
  useProductStore,
  useCategoryStore,
} from "@/app/(frontend)/admin/store/adminStore";
import useSWR from "swr";
import { getAdminProduct } from "@/app/action/productAction";

function Products() {
  //fetch products

  const { data, error } = useSWR("/admin/products", () => getAdminProduct(), {
    onSuccess: (products) => {
      console.log("products🚀🎈", products);
      return setProducts(products);
    },
  });

  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);
  const allCategories = useCategoryStore((state) => state.allCategories);

  if (data) console.log("products", data);
  // const products = [
  //   {
  //     id: "1020",
  //     price: "$200",
  //     product: "1ZPRESSO | J-MAX Manual Coffee Grinder",
  //     status: "Active",
  //     inventory: "20 in stock",
  //     category: "Brew Gear",
  //     type: "Accessories",
  //     vendor: "Espresso Shot Coffee",
  //   },
  //   {
  //     id: "1018",
  //     price: "$200",
  //     product: "Acaia Pearl Set",
  //     status: "Draft",
  //     tone: <Badge tone="success">Active</Badge>,
  //     inventory: "2 in stock for 50 variants",
  //     category: "Brew Gear",
  //     type: "Accessories",
  //     vendor: "Espresso Shot Coffee",
  //   },
  //   {
  //     id: "1016",
  //     price: "$200",
  //     product: "AeroPress Go Brewer",
  //     status: "Archived",
  //     tone: <Badge tone="info">Draft</Badge>,
  //     inventory: "3 in stock for 50 variants",
  //     category: "Brew Gear",
  //     type: "Accessories",
  //     vendor: "Espresso Shot Coffee",
  //   },
  // ];

  return (
    <Page
      fullWidth
      title={"Products"}
      primaryAction={{
        content: "Add Product",
        accessibilityLabel: "Add product",
        url: "/admin/products/new",
      }}
    >
      <Box paddingBlockEnd="400">
        <Card>
          <ProductsIndexFilter />
          <ProductsIndexTable products={products} />
        </Card>
      </Box>
    </Page>
  );
}

export default Products;
