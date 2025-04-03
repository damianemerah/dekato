import { getPinnedCategoriesByParent } from '@/app/action/categoryAction';
import CategoryLink from './category-link';
import { cookies } from 'next/headers';
import { CategorySelector } from './category-selector';

export default async function SelectedCategories() {
  // Get selected category from cookie
  const cookieStore = cookies();
  const selectedCategory =
    cookieStore.get('selected-category')?.value || 'women';

  // Server-side data fetching
  const categories = await getPinnedCategoriesByParent(selectedCategory);

  return (
    <>
      <div
        className="min-h-[300px] px-4 py-6 font-oswald sm:px-6 lg:px-8"
        id="selected-category"
      >
        <div className="flex flex-col sm:ml-4 md:ml-8">
          <h2>SHOP BY CATEGORY</h2>

          {/* Client component for category selection */}
          <CategorySelector initialCategory={selectedCategory} />
        </div>

        {categories && categories.length > 0 ? (
          <div className="relative">
            <div
              id="category-container"
              className="lg:no-scrollbar lg-gap-6 flex gap-2 overflow-x-auto scroll-smooth pb-4 sm:gap-4 lg:overflow-x-visible"
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="w-1/3 flex-none md:w-1/4 lg:w-[calc(100%/5-16px)]"
                >
                  <CategoryLink category={category} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center text-gray-500">
            No categories found
          </div>
        )}
      </div>
    </>
  );
}
