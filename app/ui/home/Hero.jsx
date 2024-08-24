import Link from "next/link";
import Image from "next/image";
import { oswald } from "@/font";
import { useRef, useState, useEffect, useCallback, use } from "react";

import styles from "./Hero.module.css";
import heroBg from "@/public/assets/hero_bg.png";
import ArrowLeft from "@/public/assets/icons/arrow_left.svg";
import ArrowRight from "@/public/assets/icons/arrow_right.svg";

// heroData.js
const heroContent = [
  {
    id: 1,
    title: "SUMMER SALE: Get 30% OFF On all dresses.",
    link: "#",
    images: ["/assets/image2.png", "/assets/image5.png"],
  },
  {
    id: 2,
    title: "WINTER SALE: Get 50% OFF On all jackets.",
    link: "#",
    images: ["/assets/image2.png", "/assets/image5.png"],
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const sliderRef = useRef(null);
  const totalSlides = heroContent.length;

  useEffect(() => {
    const slides = sliderRef.current.children;

    //clone first and last slide
    const firstSlide = slides[0].cloneNode(true);
    const lastSlide = slides[slides.length - 1].cloneNode(true);

    sliderRef.current.prepend(lastSlide);
    sliderRef.current.append(firstSlide);

    console.log(slides);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;

    const handleTransitionEnd = () => {
      console.log("transition ended");
      if (currentSlide === totalSlides) {
        slider.style.transition = "none";
        slider.style.transform = `translateX(0%)`;
        setCurrentSlide(0);
      }
    };

    slider.addEventListener("transitionend", handleTransitionEnd);
    return () => {
      slider.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [currentSlide, totalSlides]);

  const handleNextSlide = useCallback(() => {
    const slider = sliderRef.current;

    if (currentSlide < totalSlides) {
      setCurrentSlide(currentSlide + 1);
      slider.style.transition = `0.7s linear`;
      slider.style.transform = `translateX(-${currentSlide + 1}00%)`;
    }

    if (currentSlide === totalSlides - 1) {
      setTimeout(() => {
        slider.style.transition = "none";
        slider.style.transform = `translateX(0%)`;
        setCurrentSlide(0);
      }, 700);
    }
  }, [currentSlide, totalSlides]);

  const handlePrevSlide = () => {
    const slider = sliderRef.current;

    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      slider.style.transition = `0.7s linear`;
      slider.style.transform = `translateX(-${currentSlide - 1}00%)`;
    }

    if (currentSlide === 0) {
      slider.style.transition = "none";
      slider.style.transform = `translateX(-${(totalSlides - 1) * 100}%)`;
      setCurrentSlide(totalSlides - 1);

      setTimeout(() => {
        slider.style.transition = `0.7s linear`;
      }, 0);
    }
  };
  return (
    <section
      style={{
        backgroundImage: `url(${heroBg.src})`,
      }}
      className={`${oswald.className} relative bg-cover bg-center bg-no-repeat`}
    >
      <div className="absolute bottom-0 right-0 z-10 mb-4 mr-4 flex justify-center gap-3 self-center">
        <button className="h-5 w-5" onClick={handlePrevSlide}>
          <ArrowLeft className="h-full w-full" />
        </button>
        <button className="h-5 w-5" onClick={handleNextSlide}>
          <ArrowRight />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 z-10 mb-4 ml-4 flex items-center justify-center">
        <button className={`mr-1 h-3 w-3 border border-black`}></button>
        <button className={`mr-1 h-3 w-3 border border-black`}></button>
        <button
          className={`${styles.hero__active} mr-1 h-3 w-3 border border-black`}
        ></button>
        <button className={`mr-1 h-3 w-3 border border-black`}></button>
      </div>

      <div className="overflow-hidden">
        <div className="flex w-full" ref={sliderRef}>
          {heroContent.map((content) => (
            <div
              className={`slide grid w-full min-w-full grid-cols-2 items-center justify-center gap-4 px-16 py-16`}
              key={content.id}
            >
              <div className="heading_bd relative flex flex-col justify-center p-8">
                <h1 className="mb-10 text-7xl font-bold leading-tight text-primary">
                  {content.title}
                </h1>
                <Link
                  href="#"
                  className="self-start border-2 border-black px-8 py-3 font-medium text-black hover:no-underline"
                >
                  SHOP NOW
                </Link>
              </div>
              <div className="relative flex justify-center">
                {content.images.map((image, index) => (
                  <div
                    className={`block w-1/2 ${index === 1 && "-translate-x-10 scale-110 transform"} flex items-center`}
                    key={index}
                  >
                    <Image
                      alt="Product Image"
                      className="max-h-full max-w-full object-cover"
                      style={{
                        boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)",
                      }}
                      loading="lazy"
                      src={image}
                      width={300}
                      height={400}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
