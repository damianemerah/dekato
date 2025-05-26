import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedProduct() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Full-width background image */}
      <div className="relative min-h-72 w-full md:min-h-80 lg:min-h-96">
        <Image
          src="/assets/images/featured-tee.webp"
          alt="Model wearing premium t-shirt"
          fill
          className="object-cover"
          priority
        />

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6">
            <h2 className="mb-8 text-center text-3xl font-bold uppercase tracking-tight text-secondary md:text-5xl lg:text-3xl">
              Voted The Best Tees On Earth
            </h2>

            <p className="mb-10 max-w-2xl text-center text-lg leading-relaxed text-secondary md:text-lg">
              Our AO Tees are the shirts that made us famous—crafted to never
              fade, shrink, or wrinkle, truly built to last, and worn by
              millions.
            </p>

            <Link
              href="#"
              className="inline-flex items-center justify-center bg-secondary px-4 py-2 text-base font-medium text-primary transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
