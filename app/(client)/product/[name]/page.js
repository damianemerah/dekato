import { unstable_cache } from 'next/cache';
import { getProductById } from '@/app/action/productAction';
import dynamic from 'next/dynamic';
import ProductDetail from '@/app/components/product/product-details';
import RecommendedProductsSkeleton from '@/app/components/recommended-products-skeleton';

const RecommendedProducts = dynamic(
  () => import('@/app/components/recommended-products'),
  {
    loading: () => <RecommendedProductsSkeleton />,
    ssr: false,
  }
);

const getProductData = unstable_cache(
  async (id) => {
    return await getProductById(id);
  },
  ['product-data'],
  {
    tags: ['single-product-data'],
    revalidate: 10,
  }
);

export async function generateMetadata({ params }, parent) {
  const id = params.name.split('-').slice(-1)[0];
  const product = await getProductData(id);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [
        {
          url: product.image[0],
          width: 1200,
          height: 630,
          alt: product.name,
        },
        ...previousImages,
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.image[0]],
    },
  };
}

export default async function ProductInfoPage({ params: { name } }) {
  const id = name.split('-').slice(-1)[0];
  const product = await getProductData(id);

  return (
    <div>
      <ProductDetail product={product} />
      <RecommendedProducts productId={id} />
    </div>
  );
}
