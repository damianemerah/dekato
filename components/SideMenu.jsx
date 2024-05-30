"use client";

import Image from "next/image";
import add from "@/public/assets/icons/add.svg";
import remove from "@/public/assets/icons/minus.svg";
import { useState } from "react";
import { oswald } from "@/font";
import { useAppContext } from "./AppContext";

export default function SideMenu() {
  const [openMenuItemIds, setOpenMenuItemIds] = useState([]);
  const { show } = useAppContext();

  const toggleMenuItem = (menuItemId) => {
    if (openMenuItemIds.includes(menuItemId)) {
      setOpenMenuItemIds(openMenuItemIds.filter((id) => id !== menuItemId));
    } else {
      setOpenMenuItemIds([...openMenuItemIds, menuItemId]);
    }
  };

  const menuItems = [
    { id: 1, title: "Trending", items: ["State", "Cece", "Barot", "Donna"] },
    { id: 2, title: "Another Menu", items: ["Item 1", "Item 2", "Item 3"] },
    // Add more menu items as needed
  ];

  return (
    <div
      className="bg-white w-full basis-80 h-screen overflow-y-scroll"
      style={{
        display: `${show ? "block" : "none"}`,
      }}
    >
      {menuItems.map((menuItem) => (
        <div key={menuItem.id}>
          <div className="flex justify-between items-center border-b w-full border-b-slate-200 mb-1">
            <h4 className={`mr-3 p-2 text-base ${oswald.className}`}>
              {menuItem.title}
            </h4>
            <div className="w-3.5 h-3.5 flex justify-center items-center py-2">
              <Image
                onClick={() => toggleMenuItem(menuItem.id)}
                src={openMenuItemIds.includes(menuItem.id) ? remove : add}
                width={19}
                height={19}
                alt="dropdown icon"
                className="cursor-pointer object-cover w-full h-auto block"
              />
            </div>
          </div>
          <ul
            className={`uppercase list-none text-xs ${
              openMenuItemIds.includes(menuItem.id) ? "block" : "hidden"
            }`}
          >
            {menuItem.items.map((item, index) => (
              <li key={index} className="ml-6 mb-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
