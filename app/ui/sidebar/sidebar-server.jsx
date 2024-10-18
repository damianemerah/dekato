import { getAllCollections } from "@/app/action/collectionAction";
import { unstable_cache } from "next/cache";
import Sidebar from "./sidebar";
import Category from "@/models/category";
import dbConnect from "@/lib/mongoConnection";
import { formatCategories } from "@/app/action/categoryAction";
const getCategories = unstable_cache(
  async () => {
    await dbConnect();
    const categories = await Category.find({})
      .populate("parent", "name _id slug")
      .lean({ virtuals: true });
    return formatCategories(categories);
  },
  ["categories"],
  { revalidate: 120, tags: ["categories"] },
);

const getCollections = unstable_cache(
  async () => {
    return await getAllCollections();
  },
  ["collections"],
  { revalidate: 120, tags: ["collections"] },
);

export default async function SidebarServer() {
  const [categories, collections] = await Promise.all([
    getCategories(),
    getCollections(),
  ]);
  return <Sidebar categories={categories} collections={collections} />;
}
