import { oswald, inter } from "@/style/font";
import { Button } from "./Button";

export default function SubPageCampaign({ className, heading_bg }) {
  return (
    <div
      className={`${oswald.className} heading_bd relative flex flex-shrink-0 flex-grow-0 basis-1/2 flex-col justify-center self-baseline p-8 ${heading_bg} mr-2`}
    >
      <h2 className="mb-10 text-5xl font-medium leading-tight">
        EXPLORE THE BEST OF YOU.
      </h2>
      <p className={`${inter.className} mb-10`}>
        You can choose the best option for you, and it does not matter whether
        you are in Prague or San Francisco.
      </p>
      <Button className={className}>Shop Now</Button>
    </div>
  );
}
