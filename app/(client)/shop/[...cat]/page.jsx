import Category from '@/models/category';
import Campaign from '@/models/collection';
import dbConnect from '@/app/lib/mongoConnection';
import { notFound } from 'next/navigation';
import ProductList from '@/app/components/products/products-list';
import { getAllProducts } from '@/app/action/productAction';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

async function getAllCategoryPaths() {
  await dbConnect();

  const [categories, collections] = await Promise.all([
    Category.find().select('slug path').lean(),
    Campaign.find().select('slug path').lean(),
  ]);

  const categoryPaths = categories.map((category) => category.path);
  const collectionPaths = collections.map((collection) => collection.path);

  return [...categoryPaths, ...collectionPaths];
}

export async function generateStaticParams() {
  const paths = await unstable_cache(getAllCategoryPaths, ['categoryPaths'], {
    revalidate: 1800,
  })();

  const filteredPaths = paths.map((path) => ({
    cat: path.map((p) => (p.includes('/') ? p.split('/')[1] : p)),
  }));

  return filteredPaths;
}

// Helper function to get category/collection data
async function getCategoryData(cat) {
  await dbConnect();

  const path = cat.join('/').toLowerCase();
  // Try to find as category first
  let data = await Category.findOne({
    path: { $all: path },
  })
    .select('name description metaTitle metaDescription path')
    .lean();

  // If not found, try as collection
  if (!data) {
    data = await Campaign.findOne({
      path: { $all: path },
    })
      .select('name description metaTitle metaDescription path')
      .lean();
  }

  return data;
}

export async function generateMetadata({ params: { cat } }, parent) {
  const parentMetadata = await parent;
  const previousImages = parentMetadata?.openGraph?.images || [];

  // Handle search path
  if (cat[0] === 'search') {
    return {
      title: 'Search Results | Dekato Outfit',
      description: 'Browse our products based on your search criteria.',
    };
  }

  const data = await unstable_cache(
    () => getCategoryData(cat),
    [`category-meta-${cat.join('-')}`],
    {
      revalidate: 1800,
    }
  )();

  if (!data) {
    return {
      title: 'Products | Dekato Outfit',
      description: 'Browse our curated collection of products.',
      robots: {
        index: false,
      },
      status: 404,
    };
  }

  return {
    title: data.metaTitle || data.name,
    description:
      data.metaDescription ||
      data.description ||
      `Browse our ${data.name} collection`,
    openGraph: {
      title: data.metaTitle || data.name,
      description:
        data.metaDescription ||
        data.description ||
        `Browse our ${data.name} collection`,
      images: [...previousImages],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaTitle || data.name,
      description:
        data.metaDescription ||
        data.description ||
        `Browse our ${data.name} collection`,
    },
    alternates: {
      canonical: `/shop/${data?.path[0] || cat.join('/')}`,
    },
  };
}

export default async function Product({ params: { cat }, searchParams }) {
  if (!Array.isArray(cat) || cat.length === 0) {
    notFound();
  }

  if (cat[0] === 'search' && !searchParams.q) {
    return notFound();
  }

  const data = await getAllProducts(cat, searchParams);

  if (!data && cat[0] !== 'search') {
    notFound();
  }

  const normalizedData = {
    data: data?.data || [],
    banner: data?.banner || null,
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || 1,
    limit: data?.limit || parseInt(searchParams?.limit || '12', 10),
    description: data?.description || null,
    isCampaign: data?.isCampaign || false,
  };

  return (
    <>
      <ProductList
        products={normalizedData.data}
        cat={cat}
        searchParams={searchParams}
        banner={normalizedData.banner}
        totalCount={normalizedData.totalCount}
        currentPage={normalizedData.currentPage}
        limit={normalizedData.limit}
        isCampaign={normalizedData.isCampaign}
      />
      {normalizedData.description && (
        <div className="bg-grayBg mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div
            className="mx-auto max-w-3xl text-start text-gray-500"
            dangerouslySetInnerHTML={{ __html: normalizedData.description }}
          />
        </div>
      )}
    </>
  );
}
