import { unstable_cache } from "next/cache";
import Sidebar from "./sidebar";
import Category from "@/models/category";
import Campaign from "@/models/collection";
import dbConnect from "@/lib/mongoConnection";
import { formatCategories } from "@/utils/filterHelpers";

const getCategories = unstable_cache(
  async () => {
    await dbConnect();
    const categories = await Category.find({ parent: null })
      .populate("children", "name _id slug path")
      .lean({ virtuals: true });
    return formatCategories(categories);
  },
  ["categories"],
  { revalidate: 120, tags: ["categories"] },
);

const getAllCollections = unstable_cache(
  async () => {
    return await Campaign.find();
  },
  ["collections"],
  { revalidate: 120, tags: ["collections"] },
);

export default async function SidebarFetcher() {
  const [categories, collections] = await Promise.all([
    getCategories(),
    getAllCollections(),
  ]);

  return <Sidebar categories={categories} collections={collections} />;
}
