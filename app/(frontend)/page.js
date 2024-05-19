import Hero from "@/components/Hero";
import HomeCategory from "@/components/HomeCategory";
import ProductCard from "@/components/ProductCard";
import Campaign from "@/components/Campaign";
import { oswald } from "@/style/font";
import SubPageCampaign from "@/components/SubPageCampaign";
import Galley from "@/components/Galley";

export default function Home() {
  return (
    <section className={`${oswald.className}`}>
      <Hero />
      <HomeCategory />
      <Campaign />
      <div className="py-10 px-5">
        <h2 className="mb-7">YOU MAY ALSO LIKE</h2>
        <ProductCard />
      </div>
      <SubPageCampaign />
      <Galley />
    </section>
  );
}
