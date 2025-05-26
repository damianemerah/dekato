import { htmlToText } from 'html-to-text';

export default function ProductStructuredData({ product }) {
  if (!product) return null;

  const { name, description, price, discountPrice, image, slug, id } = product;

  const structuredData = {
    brand: {
      '@type': 'Brand',
      name: 'Dekato Outfit',
    },
    sku: id,
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: htmlToText(product.description, {
      wordwrap: false,
      ignoreHref: true,
      ignoreImage: true,
    })
      .split('.')
      .slice(0, 2)
      .join('.')
      .slice(0, 160),
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
