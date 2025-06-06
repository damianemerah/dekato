import NewSidebar from './app-sidebar';
import { getAllFormattedCategories } from '@/app/action/categoryAction';
import { getAllCollections } from '@/app/action/collectionAction';

export default async function SidebarContent() {
  try {
    const [categories, collectionsResult] = await Promise.all([
      getAllFormattedCategories(),
      getAllCollections({ limit: 1000 }),
    ]);

    const collections = collectionsResult?.data || [];

    return <NewSidebar categories={categories} collections={collections} />;
  } catch (error) {
    console.error('Error fetching sidebar data:', error);
    return <NewSidebar categories={[]} collections={[]} />;
  }
}
