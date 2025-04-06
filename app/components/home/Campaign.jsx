import Link from 'next/link';
import Image from 'next/image';

const CampaignSection = ({ image, title, priority = false }) => {
  return (
    <div className="relative mb-0.5 aspect-square max-h-[670px] w-full lg:w-[calc(50%-1px)]">
      <Image
        src={image}
        alt={`${title} for Men and Women`}
        fill
        style={{ objectFit: 'cover' }}
        priority={priority}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <div className="relative flex h-full flex-col items-end justify-end gap-6 pb-8 pr-8">
        <h2 className="text-3xl font-medium leading-none text-white">
          {title}
        </h2>
        <div className="flex items-end gap-4 font-oswald">
          <Link
            href="#"
            className="bg-white px-6 py-1.5 text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white"
            aria-label={`Shop Men's ${title}`}
          >
            New Arrivals
          </Link>
          <Link
            href="#"
            className="bg-white px-6 py-1.5 text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white"
            aria-label={`Shop Women's ${title}`}
          >
            Best Sellers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Campaign() {
  return (
    <div className={`mt-0.5 flex flex-col font-oswald md:flex-row`}>
      <CampaignSection
        image="/assets/mens_collection.png"
        title="Shop Men"
        priority={true}
      />

      <CampaignSection
        image="/assets/womens_collection.png"
        title="Shop Women"
      />
    </div>
  );
}
