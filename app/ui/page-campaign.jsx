import { oswald, inter, roboto } from "@/style/font";
import { Button } from "./button";

export default function SubPageCampaign({
  className,
  heading_bg,
  BtnClassName,
}) {
  return (
    <div
      className={`${oswald.className} heading_bd relative mb-4 flex flex-shrink-0 flex-grow-0 basis-full flex-col justify-center self-baseline p-4 sm:mb-4 sm:basis-full sm:p-6 md:mb-4 md:basis-full md:p-8 lg:mr-2 lg:basis-1/2 ${className}`}
    >
      <h2
        className={`mb-6 text-3xl font-medium leading-tight sm:mb-8 sm:text-4xl md:mb-10 md:text-5xl ${heading_bg}`}
      >
        EXPLORE THE BEST OF YOU.
      </h2>
      <p
        className={`${roboto.className} mb-6 text-sm sm:mb-8 sm:text-base md:mb-10`}
      >
        You can choose the best option for you, and it does not matter whether
        you are in Prague or San Francisco.
      </p>
      <Button className={`${BtnClassName} !inline-block text-center`}>
        Shop Now
      </Button>
    </div>
  );
}
