import dynamic from "next/dynamic";
import { unstable_cache } from "next/cache";
import { getAllCollections } from "@/app/action/collectionAction";

const CollectionForm = dynamic(
  () => import("@/app/(frontend)/admin/ui/collection/collection-content"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

const getCollection = unstable_cache(
  async () => {
    const collection = await getAllCollections();
    return collection;
  },
  [`collection`],
  {
    tags: ["collection"],
    revalidate: 600,
  },
);

export default async function NewCollection({ params: { slug } }) {
  const collection = await getCollection();

  return <CollectionForm collectionId={slug} collection={collection} />;
}
