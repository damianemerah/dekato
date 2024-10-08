import { getAllCategories } from "@/app/action/categoryAction";
import { getAllCollections } from "@/app/action/collectionAction";
import { unstable_cache } from "next/cache";
import Sidebar from "./sidebar";

const getCategories = unstable_cache(
  async () => {
    return await getAllCategories();
  },
  ["categories"],
  { revalidate: 3600, tags: ["categories"] },
);

const getCollections = unstable_cache(
  async () => {
    return await getAllCollections();
  },
  ["collections"],
  { revalidate: 3600, tags: ["collections"] },
);

export default async function SidebarServer() {
  const [categories, collections] = await Promise.all([
    getCategories(),
    getCollections(),
  ]);
  return <Sidebar categories={categories} collections={collections} />;
}
