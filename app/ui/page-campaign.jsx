import { oswald, roboto } from "@/style/font";
import { Button } from "./button";

export default function SubPageCampaign({
  className,
  heading_bg,
  BtnClassName,
}) {
  return (
    <div
      className={`${oswald.className} heading_bd relative flex flex-col justify-center p-6 sm:p-8 md:p-10 ${className}`}
    >
      <h2
        className={`mb-6 text-3xl font-medium leading-tight sm:text-4xl md:text-5xl ${heading_bg}`}
      >
        EXPLORE THE BEST OF YOU
      </h2>
      <p className={`${roboto.className} mb-6 text-sm sm:text-base md:text-lg`}>
        You can choose the best option for you, and it does not matter whether
        you are in Prague or San Francisco.
      </p>
      <Button className={`${BtnClassName} inline-block text-center`}>
        Shop Now
      </Button>
    </div>
  );
}
