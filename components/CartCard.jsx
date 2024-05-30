import Image from "next/image";
import image10 from "@/public/assets/image10.png";
import { inter } from "@/font";

export default function CartCard({ heart, edit, del, showIcon = true }) {
  return (
    <div className="flex items-start gap-3 py-5 border-b border-b-gray-100">
      <div className="self-center block w-5 h-5 border border-gray-400 rounded-full mr-2"></div>
      <div className="w-28 h-28">
        <Image
          src={image10}
          width="100%"
          height="100%"
          alt="product image"
          className="block object-cover w-full h-full rounded-lg"
        />
      </div>
      <div className="flex flex-col justify-center flex-1 gap-2">
        <div className="flex justify-between items-center">
          <h4 className="inline-block font-medium overflow-hidden overflow-ellipsis mr-auto">
            Angels malu zip jeans slim black used
          </h4>
          {showIcon && (
            <div className="flex items-center gap-3">
              <button>
                <Image src={heart} width={16} height={16} alt="favorite icon" />
              </button>
              <button>
                <Image src={edit} width={16} height={16} alt="edit icon" />
              </button>
              <button>
                <Image src={del} width={16} height={24} alt="delete icon" />
              </button>
            </div>
          )}
        </div>
        <div>
          <p
            className={`${inter.className} inline-block py-0.5 px-3 bg-gray-100 rounded-full`}
          >
            Silver
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className={`${inter.className}`}>500 EUR</p>
          <div className="flex justify-center items-center">
            <button className="flex justify-center items-center w-7 h-7 bg-gray-100 rounded-full">
              -
            </button>
            <input
              type="text"
              defaultValue={1}
              className="text-center outline-none w-10 px-1"
            />
            <button className="flex justify-center items-center w-7 h-7 bg-gray-100 rounded-full">
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
