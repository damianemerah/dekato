import { getCollections } from "@/app/action/collectionAction";
import { unstable_cache } from "next/cache";
import Sidebar from "./sidebar";
import Category from "@/models/category";
import dbConnect from "@/lib/mongoConnection";
import { formatCategories } from "@/utils/filterHelpers";

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

const getAllCollections = unstable_cache(
  async () => {
    return await getCollections();
  },
  ["collections"],
  { revalidate: 120, tags: ["collections"] },
);

export default async function SidebarServer() {
  const [categories, collections] = await Promise.all([
    getCategories(),
    getAllCollections(),
  ]);
  return <Sidebar categories={categories} collections={collections} />;
}
