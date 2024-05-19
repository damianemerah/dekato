import Image from "next/image";
import Link from "next/link";
import { oswald, roboto } from "@/style/font";
import image6 from "@/public/assets/image6.png";

export default function SubPageCampaign() {
  return (
    <div className={`flex items-center justify-center mb-10`}>
      <div className="block w-1/2">
        <Image
          alt="cat"
          className="max-h-full object-cover"
          style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)" }}
          loading="lazy"
          src={image6}
          width="100%"
          height="auto"
        />
      </div>
      <div className="heading_bd relative self-baseline flex flex-col justify-center flex-grow-0 flex-shrink-0 basis-1/2 p-8">
        <h2 className="mb-10 font-medium text-5xl leading-tight">
          EXPLORE THE BEST OF YOU.
        </h2>
        <p className={`${roboto.className} mb-10`}>
          You can choose the best option for you, and it does not matter whether
          you are in Prague or San Francisco.
        </p>
        <Link
          href="#"
          className="text-black font-medium hover:no-underline self-start py-2 px-8 border-2 border-black"
        >
          SHOP NOW
        </Link>
      </div>
    </div>
  );
}
