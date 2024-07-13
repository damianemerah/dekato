import Hero from "@/app/ui/home/Hero";
import HomeCategory from "@/app/ui/home/HomeCategory";
import ProductCard from "@/app/ui/ProductCard";
import Campaign from "@/app/ui/home/Campaign";
import { oswald } from "@/style/font";
import SubPageCampaign from "@/app/ui/SubPageCampaign";
import Galley from "@/app/ui/home/Galley";
import Image from "next/image";
import image6 from "@/public/assets/image6.png";
import ProductList from "@/app/ui/ProductList";

export default function Home() {
  return (
    <section className={`${oswald.className}`}>
      <Hero />
      <HomeCategory />
      <Campaign />
      <div className="py-10 px-5">
        <h2 className="mb-7">YOU MAY ALSO LIKE</h2>
        <ProductList cat="men" />
      </div>
      <div className={`flex items-center justify-center mb-10 gap-5`}>
        <div className="block w-1/2 flex-1 self-stretch">
          <Image
            alt="cat"
            className="max-h-full object-cover h-full"
            style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)" }}
            loading="lazy"
            src={image6}
            width="100%"
            height="auto"
          />
        </div>
        <SubPageCampaign
          className="border-black"
          heading_bg="after:bg-black before:bg-black"
        />
      </div>
      <Galley />
    </section>
  );
}
