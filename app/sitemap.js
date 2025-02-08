import Category from "@/models/category";
import Product from "@/models/product";
import Blog from "@/models/blog";
import Campaign from "@/models/collection";
import dbConnect from "@/lib/mongoConnection";

const getAllProducts = async () => {
  await dbConnect();
  return await Product.find({ status: "active" })
    .select("slug updatedAt")
    .lean();
};

const getAllCategories = async () => {
  await dbConnect();
  return await Category.find().select("slug path updatedAt").lean();
};

const getAllCollections = async () => {
  await dbConnect();
  return await Campaign.find().select("slug path updatedAt").lean();
};

const getAllBlogs = async () => {
  await dbConnect();
  return await Blog.find({ status: "published" })
    .select("slug updatedAt")
    .lean();
};

export default async function sitemap() {
  const siteUrl = process.env.NEXTAUTH_URL || "https://www.dekato.ng";

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
          }),
        );
      }
      // Add full path URL if it exists
      if (category.path[0] && category.path[0].includes("/")) {
        urls.add(
          JSON.stringify({
            url: `${siteUrl}/shop/${category.path[0].split("/")[1]}`,
            lastModified: category.updatedAt.toISOString(),
          }),
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
          }),
        );
      }
      // Add full path URL if it exists
      if (collection.path[0] && collection.path[0].includes("/")) {
        urls.add(
          JSON.stringify({
            url: `${siteUrl}/shop/${collection.path[0].split("/")[1]}`,
            lastModified: collection.updatedAt.toISOString(),
          }),
        );
      }

      return Array.from(urls).map((url) => JSON.parse(url));
    });

    // Combine category and collection URLs to check for duplicates
    const combinedUrls = [...categoryUrls, ...collectionUrls];
    const uniqueUrls = combinedUrls.reduce(
      (unique, item) =>
        unique.includes(item.url) ? unique : [...unique, item],
      [],
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
    console.error("Error generating sitemap:", error);
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
