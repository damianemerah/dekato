import { getAllCategories } from "@/app/action/categoryAction";
import { unstable_cache } from "next/cache";
import Sidebar from "./sidebar";

const getCategories = unstable_cache(
  async () => {
    return await getAllCategories();
  },
  ["categories"],
  { revalidate: 3600, tags: ["categories"] },
);

export default async function SidebarServer() {
  const categories = await getCategories();
  return <Sidebar categories={categories} />;
}
