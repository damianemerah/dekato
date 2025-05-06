import { Suspense } from 'react';
import { productSearch } from '@/app/action/productAction';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { LoadingSpinner } from '@/app/components/spinner';
import ProductCard from '@/app/components/products/product-card';
import { Search, ShoppingBag } from 'lucide-react';

export async function generateMetadata({ searchParams }) {
  const { q } = searchParams;
  return {
    title: q ? `Search results for "${q}" | Dekato` : 'Search | Dekato',
    description: q ? `Browse search results for "${q}"` : 'Search our products',
  };
}

async function SearchResults({ searchParams }) {
  const searchQuery = searchParams.q;

  if (!searchQuery) {
    return <NoSearchQuery />;
  }

  try {
    // Use the productSearch function to get results
    const { products, categories } = await productSearch({ q: searchQuery });

    if (products.length === 0) {
      return <NoProductsFound query={searchQuery} />;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">
          Search Results for &quot;{searchQuery}&quot;
        </h1>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Search error:', error);
    return <SearchError query={searchQuery} />;
  }
}

function NoSearchQuery() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <Search className="mb-4 h-16 w-16 text-gray-300" />
      <h1 className="mb-2 text-2xl font-bold">Start Your Search</h1>
      <p className="mb-8 max-w-md text-gray-600">
        Enter a search term to find products in our store.
      </p>
      <Link href="/">
        <Button>Browse Products</Button>
      </Link>
    </div>
  );
}

function NoProductsFound({ query }) {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
      <h1 className="mb-2 text-2xl font-bold">No Products Found</h1>
      <p className="mb-4 max-w-md text-gray-600">
        We couldn&apos;t find any products matching &quot;{query}&quot;.
      </p>
      <div className="mb-8 text-gray-600">
        <p className="mb-2">Suggestions:</p>
        <ul className="list-disc text-left">
          <li>Check your spelling</li>
          <li>Try more general keywords</li>
          <li>Try different keywords</li>
          <li>Browse our categories</li>
        </ul>
      </div>
      <div className="flex flex-wrap gap-4">
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
        <Link href="/shop/men">
          <Button variant="outline">Men&apos;s Collection</Button>
        </Link>
        <Link href="/shop/women">
          <Button variant="outline">Women&apos;s Collection</Button>
        </Link>
      </div>
    </div>
  );
}

function SearchError({ query }) {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-4">
        <Search className="h-8 w-8 text-red-500" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">Search Error</h1>
      <p className="mb-8 max-w-md text-gray-600">
        We encountered an error while searching for &quot;{query}&quot;. Please
        try again later.
      </p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}

export default function SearchPage({ searchParams }) {
  return (
    <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}
