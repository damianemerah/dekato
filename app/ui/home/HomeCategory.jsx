import Image from "next/image";
import Link from "next/link";
import image3 from "@/public/assets/image3.png";
import { oswald } from "@/font";

export default function HomeCategory() {
  return (
    <div className={`py-8 px-16 ${oswald.className}`}>
      <h2>Selected Category</h2>
      <div className="flex items-center gap-9 mb-7">
        <p>Filter By:</p>
        <ul className="flex gap-4">
          <li className="active__category">Women</li>
          <li>Men</li>
        </ul>
      </div>
      <div className="flex flex-wrap gap-5">
        <Link
          href="#"
          style={{
            background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 30%, rgba(0, 0, 0, 0.5) 50%), url('${image3.src}')`,
            backgroundSize: "cover",
          }}
          className="flex justify-center items-center text-white w-28 h-28"
        >
          TOP
        </Link>
      </div>
    </div>
  );
}
