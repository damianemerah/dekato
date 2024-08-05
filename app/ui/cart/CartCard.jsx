"use client";

import Image from "next/image";
import image10 from "@/public/assets/image10.png";
import { inter } from "@/font";
import { useCartStore } from "@/store/store";
import { useEffect } from "react";
import HeartIcon from "@/public/assets/icons/heart.svg";
import EditIcon from "@/public/assets/icons/edit.svg";
import DeleteIcon from "@/public/assets/icons/delete.svg";

const CartCard = ({
  heart,
  edit,
  del,
  showIcon = true,
  showButton = true,
  className,
}) => {
  return (
    <div
      className={`${className} flex items-start gap-3 border-b border-b-gray-100 py-5`}
    >
      {showButton && (
        <div className="mr-2 block h-5 w-5 shrink-0 cursor-pointer self-center rounded-full border border-gray-400"></div>
      )}
      <div className="h-28 w-28 shrink-0">
        <Image
          src={image10}
          alt="product image"
          className="block h-full w-full rounded-lg object-cover"
        />
      </div>
      <div className="flex w-full min-w-0 flex-col gap-2">
        <div className="flex__center min-w-0">
          <h4 className="flex-1 overflow-hidden overflow-ellipsis text-nowrap pr-1.5 font-medium">
            Angels malu zip jea ns slim black used Angels malu zip jeans slim
            black used Angels malu zip jeans slim black used
          </h4>
          {showIcon && (
            <div className="flex items-center gap-3">
              <button>
                <HeartIcon className="text-base" />
              </button>
              <button>
                <EditIcon className="text-base" />
              </button>
              <button>
                <DeleteIcon className="text-base" />
              </button>
            </div>
          )}
        </div>
        <div>
          <p
            className={`${inter.className} inline-block rounded-full bg-gray-100 px-3 py-0.5`}
          >
            Silver
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className={`${inter.className}`}>500 EUR</p>
          {showButton && (
            <div className="flex items-center justify-center">
              <button className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                -
              </button>
              <input
                type="text"
                defaultValue={1}
                className="w-10 px-1 text-center outline-none"
              />
              <button className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CartCards() {
  const user = useCartStore((state) => state.user);
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (user) {
      console.log(user.id, "user id");
      const fetchCart = async () => {
        const res = await fetch(`/api/cart/${user.id}`);
        const data = await res.json();
        setCart(data.data);
      };
      fetchCart();
    }
  }, [user, setCart]);

  return (
    <div>
      {cart?.item?.map((item, index) => (
        <CartCard
          key={index}
          heart={HeartIcon}
          edit={EditIcon}
          del={DeleteIcon}
        />
      ))}
      <CartCard heart={HeartIcon} edit={EditIcon} del={DeleteIcon} />
    </div>
  );
}
