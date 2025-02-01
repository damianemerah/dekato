"use client";

import { memo, useState } from "react";
import { createVarOption, getVarOption } from "@/app/action/variantAction";
import { useAdminStore } from "@/app/(frontend)/admin/store/adminStore";
import { Dropdown, message, Modal, Input, Button, Select } from "antd";
import useSWR from "swr";

export default memo(function VariantGroupTable() {
  const removeVariantOption = useAdminStore(
    (state) => state.removeVariantOption,
  );
  const updateVariantOptionName = useAdminStore(
    (state) => state.updateVariantOptionName,
  );
  const updateVariantOptionValues = useAdminStore(
    (state) => state.updateVariantOptionValues,
  );
  const setOptionIsSaved = useAdminStore((state) => state.setOptionIsSaved);
  const variantOptions = useAdminStore((state) => state.variantOptions);
  const setVariantOptions = useAdminStore((state) => state.setVariantOptions);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionName, setOptionName] = useState("");
  const [currentGroup, setCurrentGroup] = useState(null);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const { data: storedOptions, mutate } = useSWR(
    "/api/admin/variantOption",
    getVarOption,
    {
      revalidateOnFocus: false,
    },
  );

  const showModal = (group) => {
    setCurrentGroup(group);
    setIsModalOpen(true);
  };
  const showLoadModal = (group) => {
    setCurrentGroup(group);
    setIsLoadModalOpen(true);
  };
  const handleOk = async () => {
    if (currentGroup) {
      try {
        const res = await createVarOption({
          labelName: optionName,
          name: currentGroup.name,
          values: currentGroup.values,
        });
        message.success("Option stored successfully");
        mutate();
      } catch (error) {
        console.error("Error storing option:", error);
        message.error(`Failed to store option : ${error.message}`);
      }
    }
    setIsModalOpen(false);
    setOptionName("");
    setCurrentGroup(null);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setOptionName("");
    setCurrentGroup(null);
  };

  const handleLoadOk = () => {
    if (currentGroup && selectedOption) {
      const updatedOptions = variantOptions.map((option) => {
        if (option.id === currentGroup.id) {
          return {
            ...option,
            labelName: selectedOption.labelName,
            labelId: selectedOption.id,
            name: selectedOption.name,
            values: selectedOption.values,
          };
        }
        return option;
      });
      setVariantOptions(updatedOptions);
      setOptionIsSaved(false);
    }
    setIsLoadModalOpen(false);
    setCurrentGroup(null);
  };
  const handleLoadCancel = () => {
    setIsLoadModalOpen(false);
    setCurrentGroup(null);
  };

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
            <tr
              key={group.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="w-[33.333%] px-6 py-3 text-left font-medium">
                {group.labelName && (
                  <span className="text-xxs text-gray-500">
                    ({group.labelName})
                  </span>
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
                  style={{ width: "100%" }}
                  placeholder="Enter values and press enter"
                  value={group.values}
                  onChange={(newValues) => {
                    updateVariantOptionValues(group.id, newValues);
                    setOptionIsSaved(false);
                  }}
                  tokenSeparators={[","]}
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
      <Modal
        title="Store Option"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter option name"
          value={optionName}
          onChange={(e) => setOptionName(e.target.value)}
        />
      </Modal>
      <Modal
        title="Load Option"
        open={isLoadModalOpen}
        onOk={handleLoadOk}
        onCancel={handleLoadCancel}
        footer={[
          <Button key="cancel" onClick={handleLoadCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleLoadOk}>
            Load
          </Button>,
        ]}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select an option to load"
          onChange={(value) =>
            setSelectedOption(
              storedOptions?.find((option) => option.labelName === value),
            )
          }
        >
          {Array.isArray(storedOptions) &&
            storedOptions.map((option) => (
              <Select.Option key={option.id} value={option.labelName}>
                {option.labelName}
              </Select.Option>
            ))}
        </Select>
      </Modal>
    </div>
  );
});
