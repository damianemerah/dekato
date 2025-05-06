export default function ProductStructuredData({ product }) {
  if (!product) return null;

  const { name, description, price, discountPrice, image, slug, id } = product;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: image?.[0] || '',
    url: `${process.env.NEXTAUTH_URL}/product/${slug}-${id}`,
    offers: {
      '@type': 'Offer',
      price: discountPrice || price,
      priceCurrency: 'NGN',
      availability:
        product.quantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXTAUTH_URL}/product/${slug}-${id}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
