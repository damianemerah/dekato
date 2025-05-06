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

    // Check if collections have proper data structure and log if issues found
    const newArrivals = collections.filter((c) =>
      c.slug.startsWith('new-arrival')
    );
    if (newArrivals.length > 0 && process.env.NODE_ENV === 'development') {
      const missingCategoryNames = newArrivals.filter((item) => {
        // Handle both cases: when category is an object or when it's an ID
        let categoryName;

        if (typeof item.category === 'object' && item.category !== null) {
          categoryName = item.category.name;
        } else {
          categoryName = categories?.find(
            (cat) => cat.id === item.category
          )?.name;
        }

        return !categoryName;
      });

      if (missingCategoryNames.length > 0) {
        console.warn(
          '[Sidebar] Warning: Some New Arrival items have missing category names:',
          missingCategoryNames.map((item) => ({
            id: item.id,
            slug: item.slug,
            category: item.category,
          }))
        );
      }
    }

    return <NewSidebar categories={categories} collections={collections} />;
  } catch (error) {
    console.error('Error fetching sidebar data:', error);
    return <NewSidebar categories={[]} collections={[]} />;
  }
}
