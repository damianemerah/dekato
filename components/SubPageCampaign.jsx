import { oswald, roboto } from "@/style/font";
import Button from "./Button";

export default function SubPageCampaign({ className, heading_bg }) {
  return (
    <div
      className={`${oswald.className} heading_bd relative self-baseline flex flex-col justify-center flex-grow-0 flex-shrink-0 basis-1/2 p-8 ${heading_bg}`}
    >
      <h2 className="mb-10 font-medium text-5xl leading-tight">
        EXPLORE THE BEST OF YOU.
      </h2>
      <p className={`${roboto.className} mb-10`}>
        You can choose the best option for you, and it does not matter whether
        you are in Prague or San Francisco.
      </p>
      <Button className={className}>Shop Now</Button>
    </div>
  );
}
