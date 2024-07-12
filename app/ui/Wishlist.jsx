import Image from "next/image";
import image7 from "../../public/assets/image7.png";
import { Button, ButtonPrimary } from "./Button";
import { oswald } from "@/style/font";
import deleteIcon from "@/public/assets/icons/delete.svg";

export default function Wishlist() {
  return (
    <div className="flex items-start gap-2">
      <div className="animate_hover max-w-[167px] space-y-3 overflow-hidden">
        <Image
          src={image7}
          alt="Product Image"
          className="h-[219px] w-[167px]"
          height="auto"
          width="auto"
          placeholder="blur"
        />
        <div className="space-y-2 px-2">
          <p className={`${oswald.className} text-lg leading-5`}>
            Denin Jeans for women women women
          </p>
          <p className="text-grayText text-sm">$30, 000</p>
        </div>
        <div className="flex items-center justify-between gap-1">
          <div className="border-grayOutline flex h-8 w-8 items-center justify-center border-2 p-4">
            1
          </div>
          <ButtonPrimary className="!px-4 font-oswald text-sm uppercase">
            Add to Cart
          </ButtonPrimary>
        </div>
      </div>
      <button className="bg-grayBg p-1">
        <Image src={deleteIcon} alt="Delete Icon" />
      </button>
    </div>
  );
}
