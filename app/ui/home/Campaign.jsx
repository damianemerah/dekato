import { oswald } from "@/font";
import Link from "next/link";

export default function Campaign() {
  return (
    <div className={`${oswald.className} flex justify-center`}>
      <div
        className="relative"
        style={{
          backgroundImage: "url('/assets/image4.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          objectFit: "cover",
          height: "670px",
          width: "50%",
        }}
      >
        <h2 className="center text-white">Festival Arrivals</h2>
        <div className="flex justify-center items-center w-full absolute bottom-10 left-0">
          <Link
            href="#"
            className="capitalize py-3 px-10 mr-8 bg-white text-black"
          >
            Shop men
          </Link>
          <Link href="#" className="capitalize py-3 px-10 bg-white text-black">
            Shop women
          </Link>
        </div>
      </div>
      <div
        className="relative"
        style={{
          backgroundImage: "url('/assets/image5.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          objectFit: "cover",
          height: "670px",
          width: "50%",
        }}
      >
        <h2 className="center text-white">Festival Arrivals</h2>
        <div className="flex justify-center items-center w-full absolute bottom-10 left-0">
          <Link
            href="#"
            className="capitalize py-3 px-10 mr-8 bg-white text-black"
          >
            Shop men
          </Link>
          <Link href="#" className="capitalize py-3 px-10 bg-white text-black">
            Shop women
          </Link>
        </div>
      </div>
    </div>
  );
}
