import Image from "next/image";
import Link from "next/link";
import image2 from "@/public/assets/image2.png";
import image3 from "@/public/assets/image3.png";
import heroBg from "@/public/assets/hero_bg.png";
import ArrowLeft from "@/public/assets/icons/arrow_left.svg";
import ArrowRight from "@/public/assets/icons/arrow_right.svg";
import { oswald } from "@/font";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section
      style={{
        backgroundImage: `url(${heroBg.src})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        position: "relative",
      }}
      className={`${oswald.className}`}
    >
      <div className="absolute bottom-0 right-0 mb-4 mr-4 flex justify-center gap-3 self-center">
        <button className="h-5 w-5">
          <ArrowLeft className="h-full w-full" />
        </button>
        <button className="h-5 w-5">
          <ArrowRight />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 mb-4 ml-4 flex items-center justify-center">
        <button className={`mr-1 h-3 w-3 border border-black`}></button>
        <button className={`mr-1 h-3 w-3 border border-black`}></button>
        <button
          className={`${styles.hero__active} mr-1 h-3 w-3 border border-black`}
        ></button>
        <button className={`mr-1 h-3 w-3 border border-black`}></button>
      </div>

      <div className={`flex items-center justify-center px-16 py-16`}>
        <div className="heading_bd relative mr-4 flex flex-shrink-0 flex-grow-0 basis-1/2 flex-col justify-center p-8">
          <h1 className="mb-10 text-7xl font-bold leading-tight text-slate-950">
            SUMMER SALE: Get 30% OFF On all dresses.
          </h1>
          <Link
            href="#"
            className="self-start border-2 border-black px-8 py-3 font-medium text-black hover:no-underline"
          >
            SHOP NOW
          </Link>
        </div>
        <div className="relative flex h-96 flex-1 justify-center border-dashed">
          <div className="block w-1/2">
            <Image
              alt="cat"
              className="max-h-full object-cover"
              style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)" }}
              loading="lazy"
              src={image2}
            />
          </div>
          <div className="block w-1/2 -translate-x-10 scale-110 transform">
            <Image
              alt="cat"
              className="max-h-full object-cover"
              style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.25)" }}
              loading="lazy"
              src={image3}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
