import Link from 'next/link';

export default function OurStory() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-6">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-4">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-600">
            Our Story
          </p>
        </div>
        <h2 className="mb-10 text-xl font-bold leading-tight tracking-tight md:text-2xl">
          We&apos;re Inspired by the Cities that Never Sleep
          <br className="hidden md:block" /> and the Dreams that Keep Us Awake
        </h2>
      </div>
    </section>
  );
}
