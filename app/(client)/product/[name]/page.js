import { notFound } from 'next/navigation';
import { getProductById } from '@/app/action/productAction';
import ProductDetail from '@/app/components/product/product-details';
import { Suspense } from 'react';
import RecommendedProductsSkeleton from '@/app/components/recommended-products-skeleton';
import SimilarProductsServer from '@/app/components/product/similar-products';
import ProductStructuredData from '@/app/components/products/product-structured-data';

export async function generateMetadata({ params }, parent) {
  const id = params.name.split('-').slice(-1)[0];
  const product = await getProductById(id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} | Dekato Outfit`,
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

export const revalidate = 3600;

export default async function ProductInfoPage({ params: { name } }) {
  const id = name.split('-').slice(-1)[0];

  try {
    const product = await getProductById(id);

    if (!product) {
      notFound();
    }

    return (
      <div>
        <ProductStructuredData product={product} />
        <ProductDetail product={product} />
        <Suspense fallback={<RecommendedProductsSkeleton />}>
          <SimilarProductsServer productId={id} category={product.category} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}
