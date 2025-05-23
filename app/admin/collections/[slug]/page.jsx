import dynamic from 'next/dynamic';
import { unstable_cache } from 'next/cache';
import { getAllCollections } from '@/app/action/collectionAction';
import { notFound } from 'next/navigation';

const CollectionForm = dynamic(
  () => import('@/app/admin/ui/collection/collection-content'),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const getCollection = unstable_cache(
  async () => {
    const collection = await getAllCollections();
    return collection;
  },
  [`collection`],
  {
    tags: ['collection'],
    revalidate: 600,
  }
);

export default async function NewCollection({ params: { slug } }) {
  const collection = await getCollection();

  if (!collection || collection?.error) {
    notFound();
  }

  return <CollectionForm collectionId={slug} collection={collection} />;
}
