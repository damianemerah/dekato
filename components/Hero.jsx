import Image from "next/image";
import Link from "next/link";
import image2 from "@/public/assets/image2.png";
import image3 from "@/public/assets/image3.png";
import heroBg from "@/public/assets/hero_bg.png";
import arrowLeft from "@/public/assets/icons/arrow_left.png";
import arrowRight from "@/public/assets/icons/arrow_right.png";
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
      <div className="flex justify-center self-center absolute bottom-0 right-0">
        <button>
          <Image src={arrowLeft} width="40" height="40" alt="arrow" />
        </button>
        <button>
          <Image src={arrowRight} width="40" height="40" alt="arrow" />
        </button>
      </div>

      <div className="flex justify-center items-center absolute bottom-0 left-0 mb-4 ml-4">
        <button className={`w-3 h-3 mr-1 border border-black`}></button>
        <button className={`w-3 h-3 mr-1 border border-black`}></button>
        <button
          className={`${styles.hero__active} w-3 h-3 mr-1 border border-black`}
        ></button>
        <button className={`w-3 h-3 mr-1 border border-black`}></button>
      </div>

      <div className={`flex items-center justify-center px-16 py-16 `}>
        <div className="heading_bd relative flex flex-col justify-center flex-grow-0 flex-shrink-0 basis-1/2 mr-4 p-8">
          <h1 className="mb-10 font-bold text-7xl leading-tight">
            SUMMER SALE: Get 30% OFF On all dresses.
          </h1>
          <Link
            href="#"
            className="text-black font-medium hover:no-underline self-start py-3 px-8 border-2 border-black"
          >
            SHOP NOW
          </Link>
        </div>
        <div className="flex-1 flex justify-center border-dashed relative h-96">
          <div className="block w-1/2">
            <Image
              alt="cat"
              className="max-h-full object-cover"
              style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)" }}
              loading="lazy"
              src={image2}
              width="100%"
              height="auto"
            />
          </div>
          <div className="block w-1/2 transform scale-110 -translate-x-10">
            <Image
              alt="cat"
              className="max-h-full object-cover"
              style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.25)" }}
              loading="lazy"
              src={image3}
              width="100%"
              height="auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
