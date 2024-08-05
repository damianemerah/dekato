"use client";

import AddIcon from "@/public/assets/icons/add.svg";
import CloseIcon from "@/public/assets/icons/minus.svg";
import { useState } from "react";
import { oswald } from "@/font";

export default function SideMenu() {
  const [openMenuItemIds, setOpenMenuItemIds] = useState([]);

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
    <div className="h-screen w-full shrink-0 basis-80 overflow-y-scroll bg-white">
      {menuItems.map((menuItem) => (
        <div key={menuItem.id}>
          <div className="mb-1 flex w-full items-center justify-between border-b border-b-slate-200">
            <h4 className={`mr-3 p-2 text-base ${oswald.className}`}>
              {menuItem.title}
            </h4>
            <div className="flex h-3.5 w-3.5 items-center justify-center py-2">
              {openMenuItemIds.includes(menuItem.id) ? (
                <CloseIcon onClick={() => toggleMenuItem(menuItem.id)} />
              ) : (
                <AddIcon onClick={() => toggleMenuItem(menuItem.id)} />
              )}
            </div>
          </div>
          <ul
            className={`list-none text-xs uppercase ${
              openMenuItemIds.includes(menuItem.id) ? "block" : "hidden"
            }`}
          >
            {menuItem.items.map((item, index) => (
              <li key={index} className="mb-2 ml-6">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
