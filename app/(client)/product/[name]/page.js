import { notFound } from 'next/navigation';
import { getProductById } from '@/app/action/productAction';
import ProductDetail from '@/app/components/product/product-details';
import SimilarProductsServer from '@/app/components/product/similar-products';
import ProductStructuredData from '@/app/components/products/product-structured-data';
import BreadcrumbStructuredData from '@/app/components/products/breadcrumb-structured-data';
import { htmlToText } from 'html-to-text';
import ProductInteractionWrapper from '@/app/components/product/product-interaction-wrapper';

export async function generateMetadata({ params }, parent) {
  const id = params.name.split('-').slice(-1)[0];
  const product = await getProductById(id);
  const name = params.name;

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
      robots: {
        index: false,
      },
      status: 404,
    };
  }
  const description = htmlToText(product.description, {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true,
  })
    .split('.')
    .slice(0, 2)
    .join('.')
    .slice(0, 160);

  return {
    title: `${product.name} | Dekato Outfit`,
    description,
    openGraph: {
      title: product.name,
      description,
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
    keywords: product.tags || [],
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: [product.image[0]],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL}/product/${name}`,
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
        <BreadcrumbStructuredData
          items={[
            { name: 'Home', url: 'https://www.dekato.ng' },
            {
              name: product.category[0]?.name || 'Category',
              url: `https://www.dekato.ng/shop/${product.category[0]?.slug || 'women'}`,
            },
            {
              name: product.name,
              url: `https://www.dekato.ng/product/${product.slug}-${product.id}`,
            },
          ]}
        />

        <ProductInteractionWrapper product={product} />
        <div className="mt-8">
          <SimilarProductsServer productId={id} category={product.category} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}
