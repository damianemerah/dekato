import Image from "next/image";
import image7 from "../../public/assets/image7.png";
import { Button } from "./Button";

export default function Wishlist() {
  return (
    <div className='max-w-[205px] animate_hover pb-2 rounded-lg overflow-hidden'>
      <Image
        src={image7}
        alt='Product Image'
        className='w-[205px] h-auto'
        height='auto'
        width='auto'
        placeholder='blur'
      />
      <div className='px-2'>
        <p className='text-sm overflow-hidden overflow-ellipsis line-clamp-2 mb-1'>
          Denin Jeans for women
        </p>
        <p className='font-bold text-sm'>#30, 000</p>
      </div>
      <div className='flex items-center justify-between px-2 gap-1'>
        <button className='font-bold text-sm border-b border-b-slate-950'>
          Remove
        </button>
        <button className='text-sm p-2 rounded-lg bg-black text-white'>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
