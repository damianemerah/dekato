import { oswald } from "@/font";
import Link from "next/link";

export default function Campaign() {
  return (
    <div className={`${oswald.className} flex justify-center`}>
      <div className="h-[670px] w-1/2 bg-[url('/assets/image4.png')] bg-cover bg-center">
        <div className="flex h-full flex-col items-center justify-end gap-10 pb-20">
          <h2 className="text-3xl text-white">New Arrivals</h2>
          <div className="flex w-full items-center justify-center">
            <Link
              href="#"
              className="mr-8 bg-white px-10 py-3 capitalize text-black"
            >
              Men
            </Link>
            <Link
              href="#"
              className="bg-white px-10 py-3 capitalize text-black"
            >
              Women
            </Link>
          </div>
        </div>
      </div>
      <div className="h-[670px] w-1/2 bg-[url('/assets/image5.png')] bg-cover bg-center">
        <div className="flex h-full flex-col items-center justify-end gap-10 pb-20">
          <h2 className="text-3xl text-white">New Arrivals</h2>
          <div className="flex w-full items-center justify-center">
            <Link
              href="#"
              className="mr-8 bg-white px-10 py-3 capitalize text-black"
            >
              Men
            </Link>
            <Link
              href="#"
              className="bg-white px-10 py-3 capitalize text-black"
            >
              Women
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
