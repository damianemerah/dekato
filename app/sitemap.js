import Category from '@/models/category';
import Product from '@/models/product';
import Blog from '@/models/blog';
import Campaign from '@/models/collection';
import dbConnect from '@/app/lib/mongoConnection';

const getAllProducts = async () => {
  await dbConnect();
  return await Product.find({ status: 'active' })
    .select('slug updatedAt')
    .lean();
};

const getAllCategories = async () => {
  await dbConnect();
  return await Category.find().select('slug path updatedAt').lean();
};

const getAllCollections = async () => {
  await dbConnect();
  return await Campaign.find().select('slug path updatedAt').lean();
};

const getAllBlogs = async () => {
  await dbConnect();
  return await Blog.find({ status: 'published' })
    .select('slug updatedAt')
    .lean();
};

export default async function sitemap() {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://www.dekato.ng';

  try {
    // Establish DB connection first
    await dbConnect();

    // Fetch all data with error handling
    const [products, categories, collections, blogs] = await Promise.all([
      getAllProducts().catch(() => []),
      getAllCategories().catch(() => []),
      getAllCollections().catch(() => []),
      getAllBlogs().catch(() => []),
    ]);

    // Generate category URLs (both parent and full path)
    const categoryUrls = categories.flatMap((category) => {
      const urls = new Set();
      // Add parent category URL
      if (category.path[0]) {
        urls.add(
          JSON.stringify({
            url: `${siteUrl}/shop/${category.path[0]}`,
            lastModified: category.updatedAt.toISOString(),
          })
        );
      }
      // Add full path URL if it exists
      if (category.path[0] && category.path[0].includes('/')) {
        urls.add(
          JSON.stringify({
            url: `${siteUrl}/shop/${category.path[0].split('/')[1]}`,
            lastModified: category.updatedAt.toISOString(),
          })
        );
      }

      return Array.from(urls).map((url) => JSON.parse(url));
    });

    // Generate collection URLs (both parent and full path)
    const collectionUrls = collections.flatMap((collection) => {
      const urls = new Set();
      // Add parent collection URL
      if (collection.path[0]) {
        urls.add(
          JSON.stringify({
            url: `${siteUrl}/shop/${collection.path[0]}`,
            lastModified: collection.updatedAt.toISOString(),
          })
        );
      }
      // Add full path URL if it exists
      if (collection.path[0] && collection.path[0].includes('/')) {
        urls.add(
          JSON.stringify({
            url: `${siteUrl}/shop/${collection.path[0].split('/')[1]}`,
            lastModified: collection.updatedAt.toISOString(),
          })
        );
      }

      return Array.from(urls).map((url) => JSON.parse(url));
    });

    // Combine category and collection URLs to check for duplicates
    const combinedUrls = [...categoryUrls, ...collectionUrls];
    const uniqueUrls = combinedUrls.reduce(
      (unique, item) =>
        unique.includes(item.url) ? unique : [...unique, item],
      []
    );

    // Generate product URLs
    const productUrls = products.map((product) => ({
      url: `${siteUrl}/product/${product.slug}-${product._id.toString()}`,
      lastModified: product.updatedAt.toISOString(),
    }));

    // Generate blog URLs
    const blogUrls = blogs.map((blog) => ({
      url: `${siteUrl}/fashion/${blog.slug}`,
      lastModified: blog.updatedAt.toISOString(),
    }));

    // Static pages
    const staticPages = [
      {
        url: siteUrl,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${siteUrl}/about`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${siteUrl}/contact`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${siteUrl}/blog`,
        lastModified: new Date().toISOString(),
      },
    ];

    const urlList = [
      ...staticPages,
      ...uniqueUrls,
      ...productUrls,
      ...blogUrls,
    ];
    return urlList;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static pages on error
    return [
      {
        url: siteUrl,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${siteUrl}/about`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${siteUrl}/contact`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${siteUrl}/blog`,
        lastModified: new Date().toISOString(),
      },
    ];
  }
}

// // Should be named app/sitemap.xml/route.ts (or .js)
// // import { MetadataRoute } from 'next'; // If using TS

// import Category from '@/models/category';
// import Product from '@/models/product';
// import Blog from '@/models/blog';
// import Campaign from '@/models/collection'; // Assuming Campaign is your collection model
// import dbConnect from '@/app/lib/mongoConnection';

// // ... (getAllProducts, getAllCategories, getAllCollections, getAllBlogs functions are good)

// export default async function sitemap() { // : Promise<MetadataRoute.Sitemap> { // If using TS
//   const siteUrl = process.env.NEXTAUTH_URL || 'https://www.dekato.ng';

//   try {
//     // Establish DB connection first - Good, but your getAll* functions also call it.
//     // await dbConnect(); // This call might be redundant if getAll* functions ensure connection.

//     // Fetch all data with error handling - Excellent use of Promise.all and .catch()
//     const [products, categories, collections, blogs] = await Promise.all([
//       getAllProducts().catch(() => []),
//       getAllCategories().catch(() => []),
//       getAllCollections().catch(() => []),
//       getAllBlogs().catch(() => []),
//     ]);

//     // Generate category URLs
//     const categoryUrls = categories.flatMap((category) => {
//       const urls = new Set<string>(); // Use Set<string> for stringified JSON
//       // Add parent category URL (assuming path[0] is the main slug for the parent level)
//       if (category.path && category.path[0]) { // Check if path and path[0] exist
//         urls.add(
//           JSON.stringify({
//             url: `${siteUrl}/shop/${category.path[0].split('/')[0]}`, // Get the first segment
//             lastModified: category.updatedAt?.toISOString() || new Date().toISOString(),
//             changeFrequency: 'weekly',
//             priority: 0.7,
//           })
//         );
//       }
//       // Add full path URL (assuming category.slug is the specific slug for the full path)
//       // And path is an array like ['parent-slug', 'child-slug'] or just ['slug']
//       // This part needs clarification on your `category.path` structure.
//       // If category.slug is the actual leaf slug:
//       if (category.slug) {
//          const fullPath = category.path ? category.path.join('/') + '/' + category.slug : category.slug;
//          // Or if category.path itself is the full path string:
//          // const fullPath = category.path;
//          urls.add(
//            JSON.stringify({
//              url: `${siteUrl}/shop/${fullPath}`, // Adjust based on actual path structure
//              lastModified: category.updatedAt?.toISOString() || new Date().toISOString(),
//              changeFrequency: 'weekly',
//              priority: 0.7,
//            })
//          );
//       }
//       return Array.from(urls).map((url) => JSON.parse(url));
//     });

//     // Generate collection URLs - Similar logic to categories, assuming `Campaign` is your collection model
//     const collectionUrls = collections.flatMap((collection) => {
//       const urls = new Set<string>();
//       if (collection.path && collection.path[0]) {
//         urls.add(
//           JSON.stringify({
//             url: `${siteUrl}/collections/${collection.path[0].split('/')[0]}`, // Assuming collections have a /collections/ base
//             lastModified: collection.updatedAt?.toISOString() || new Date().toISOString(),
//             changeFrequency: 'weekly',
//             priority: 0.7,
//           })
//         );
//       }
//       if (collection.slug) { // Assuming collection.slug for the full path
//         const fullPath = collection.path ? collection.path.join('/') + '/' + collection.slug : collection.slug;
//         urls.add(
//           JSON.stringify({
//             url: `${siteUrl}/collections/${fullPath}`,
//             lastModified: collection.updatedAt?.toISOString() || new Date().toISOString(),
//             changeFrequency: 'weekly',
//             priority: 0.7,
//           })
//         );
//       }
//       return Array.from(urls).map((url) => JSON.parse(url));
//     });

//     // De-duplication using Set of URLs before mapping to objects
//     const allDynamicPageData = [...categoryUrls, ...collectionUrls];
//     const uniquePageObjects = Array.from(new Set(allDynamicPageData.map(item => item.url)))
//         .map(url => allDynamicPageData.find(item => item.url === url));

//     const productUrls = products.map((product) => ({
//       url: `${siteUrl}/product/${product.slug}`, // Removed product._id from URL for cleaner SEO if slug is unique
//       // url: `${siteUrl}/product/${product.slug}-${product._id.toString()}`, // Your original, also fine if slugs aren't guaranteed unique
//       lastModified: product.updatedAt?.toISOString() || new Date().toISOString(),
//       changeFrequency: 'weekly',
//       priority: 0.9, // Products are usually high priority
//     }));

//     const blogUrls = blogs.map((blog) => ({
//       url: `${siteUrl}/fashion/${blog.slug}`, // Assuming /fashion/ is your blog base
//       lastModified: blog.updatedAt?.toISOString() || new Date().toISOString(),
//       changeFrequency: 'daily', // Or weekly if not updated daily
//       priority: 0.6,
//     }));

//     const staticPages = [ /* ... your static pages ... */ ]
//       .map(page => ({
//         ...page,
//         lastModified: page.lastModified || new Date().toISOString(), // Ensure lastModified
//         changeFrequency: page.changeFrequency || 'monthly', // Default changeFrequency
//         priority: page.priority || 0.5, // Default priority
//       }));

//     const urlList = [
//       ...staticPages,
//       ...uniquePageObjects,
//       ...productUrls,
//       ...blogUrls,
//     ];
//     return urlList.filter(Boolean); // Filter out any potential undefined entries from uniquePageObjects if find fails (shouldn't happen with this logic)
//   } catch (error) {
//     console.error('Error generating sitemap:', error);
//     // ... fallback ...
//   }
// }
