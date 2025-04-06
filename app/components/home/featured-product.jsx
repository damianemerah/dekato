import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedProduct() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Full-width background image */}
      <div className="relative min-h-72 w-full md:min-h-80 lg:min-h-96">
        <Image
          src="/assets/featured-tee.webp"
          alt="Model wearing premium t-shirt"
          fill
          className="object-cover"
          priority
        />

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-5xl px-6 text-white">
            <h2 className="mb-8 text-4xl font-bold uppercase tracking-tight md:text-5xl lg:text-7xl">
              Voted The Best Tees On Earth
            </h2>

            <p className="mb-10 max-w-2xl text-lg leading-relaxed md:text-xl">
              Our AO Tees are the shirts that made us famous—crafted to never
              fade, shrink, or wrinkle, truly built to last, and worn by
              millions.
            </p>

            <Link
              href="/products/tees"
              className="inline-flex items-center justify-center border border-transparent bg-white px-8 py-4 text-base font-medium text-black transition hover:bg-gray-100"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
