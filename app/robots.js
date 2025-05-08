export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/account/', '/api/', '/checkout/', '/cart/'],
      },
    ],
    sitemap: `${process.env.NEXTAUTH_URL || 'https://www.dekato.ng'}/sitemap.xml`,
  };
}
