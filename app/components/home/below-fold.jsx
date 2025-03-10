import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import Gallery from '@/app/components/home/gallery';
import { getAllBlogs } from '@/app/action/blogAction';
import BlogCarousel from './blog-carousel';

export default async function BelowFold() {
  // Server-side data fetching
  const blogs = await getAllBlogs({
    limit: 3,
    status: 'published',
  });

  return (
    <div className="w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {blogs?.data && blogs.data.length > 0 && (
          <div className="py-12">
            <h2 className="font-oswald mb-6 text-center font-bold">
              LATEST FASHION
            </h2>

            {/* Client component to handle sidebar state */}
            <BlogCarousel blogs={blogs.data} />

            <div className="mt-6 flex items-center justify-center">
              <Link href="/fashion">
                <Button
                  variant="outline"
                  className="mt-auto font-semibold uppercase transition-colors hover:bg-primary hover:text-white"
                  aria-label="View all fashion blog posts"
                >
                  View more
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Gallery component */}
        <Gallery />
      </div>
    </div>
  );
}
