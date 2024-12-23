"use client";

import { memo } from "react";
import DeleteIcon from "@/public/assets/icons/remove.svg";
import { useAdminStore } from "@/app/(frontend)/admin/store/adminStore";
import { Dropdown, message, Modal, Input, Button, Select } from "antd";

export default memo(function VariantGroupTable() {
  const removeVariantOption = useAdminStore((state) => state.removeVariantOption);
  const updateVariantOptionName = useAdminStore((state) => state.updateVariantOptionName);
  const updateVariantOptionValues = useAdminStore((state) => state.updateVariantOptionValues);
  const setOptionIsSaved = useAdminStore((state) => state.setOptionIsSaved);
  const variantOptions = useAdminStore((state) => state.variantOptions);
  const setVariantOptions = useAdminStore((state) => state.setVariantOptions);

  const items = [
    {
      key: "1",
      label: <span className="text-red-500">Remove</span>,
      onClick: (group) => removeVariantOption(group.id),
    },
    {
      key: "2",
      label: "Cancel",
      onClick: () => {},
    },
    {
      key: "3",
      label: "Store option",
      onClick: (group) => {
        showModal(group);
      },
    },
    {
      key: "4",
      label: "Load option",
      onClick: (group) => {
        showLoadModal(group);
      },
    },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-xs uppercase leading-normal text-gray-600">
            <th className="px-6 py-3 text-left font-medium">GROUP</th>
            <th className="px-6 py-3 text-left font-medium">OPTIONS</th>
            <th className="px-6 py-3 text-right font-medium">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="text-sm font-light text-gray-600">
          {variantOptions.map((group) => (
            <tr key={group.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="w-[33.333%] px-6 py-3 text-left font-medium">
                {group.labelName && (
                  <span className="text-xxs text-gray-500">({group.labelName})</span>
                )}
                <Input
                  placeholder="Group name (e.g. Size, Color, Material)"
                  value={group.name}
                  onChange={(e) => {
                    updateVariantOptionName(group.id, e.target.value);
                    setOptionIsSaved(false);
                  }}
                  className="block w-full rounded-md"
                />
              </td>
              <td className="py-3 text-left">
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Enter values and press enter"
                  value={group.values}
                  onChange={(newValues) => {
                    updateVariantOptionValues(group.id, newValues);
                    setOptionIsSaved(false);
                  }}
                  tokenSeparators={[',']}
                  className="w-full"
                />
              </td>
              <td className="pr-6 text-right">
                <Dropdown
                  menu={{
                    items: items.map((item) => ({
                      ...item,
                      onClick: () => item.onClick(group),
                    })),
                  }}
                  trigger={["click"]}
                >
                  <span className="cursor-pointer text-xl font-bold tracking-wider text-primary">
                    ...
                  </span>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
