import { oswald } from "@/style/font";
import Link from "next/link";
import Image from "next/image";

const CampaignSection = ({ image, title, priority = false }) => {
  return (
    <div className="relative mb-0.5 aspect-square max-h-[670px] w-full lg:w-[calc(50%-1px)]">
      <Image
        src={image}
        alt={`${title} for Men and Women`}
        layout="fill"
        objectFit="cover"
        priority={priority}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <div className="relative flex h-full flex-col items-center justify-end gap-6 pb-8">
        <h2 className="text-3xl font-medium leading-none text-white">
          {title}
        </h2>
        <div className="flex w-full items-center justify-center gap-4 font-oswald">
          <Link
            href="#"
            className="bg-white px-6 py-1.5 text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white"
            aria-label={`Shop Men's ${title}`}
          >
            Shop Men
          </Link>
          <Link
            href="#"
            className="bg-white px-6 py-1.5 text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white"
            aria-label={`Shop Women's ${title}`}
          >
            Shop Women
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Campaign() {
  return (
    <div className={`${oswald.className} mt-0.5 flex flex-col md:flex-row`}>
      <CampaignSection
        image="/assets/image4.png"
        title="New Arrivals"
        priority={true}
      />
      <CampaignSection
        image="/assets/image5.webp"
        title="Featured Collection"
      />
    </div>
  );
}
