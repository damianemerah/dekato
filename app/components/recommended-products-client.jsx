'use client';

import { useState } from 'react';
import ProductCard from '@/app/components/products/product-card';

const RecommendedProductsClient = ({ initialProducts = [], category }) => {
  // Use the server-provided initial products directly
  const [products] = useState(
    initialProducts.map((p) => ({ id: p.id || p._id, ...p }))
  );

  // Return null if no products available
  if (products.length === 0) return null;

  return (
    <div className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <h2 className={`mb-6 text-center font-oswald md:text-left`}>
        YOU MAY ALSO LIKE
      </h2>
      <div className="grid grid-cols-2 gap-2 bg-white md:grid-cols-3 md:gap-3 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} showDelete={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProductsClient;
