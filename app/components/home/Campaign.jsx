import Link from 'next/link';
import Image from 'next/image';

const CampaignSection = ({ image, title, priority = false }) => {
  const type = title.toLowerCase().includes('women') ? 'women' : 'men';

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
      <div className="relative flex h-full flex-col items-center justify-end gap-4 px-4 pb-8 md:items-end md:gap-6 md:px-0 md:pr-8">
        <h2 className="text-center text-2xl font-medium leading-none text-white md:text-right md:text-3xl">
          {title}
        </h2>
        <div className="mt-4 flex gap-2 font-oswald md:items-end md:gap-4">
          <Link
            href={`/shop/${type}/new-arrival`}
            className="bg-white px-6 py-1.5 text-center text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white"
          >
            new arrivals
          </Link>
          <Link
            href="#"
            className="bg-white px-6 py-1.5 text-center text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white"
          >
            best sellers
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
