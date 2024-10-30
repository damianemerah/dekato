"use client";

import { memo, useState, useEffect } from "react";
import DeleteIcon from "@/public/assets/icons/remove.svg";
import { useAdminStore } from "@/app/(frontend)/admin/store/adminStore";
import { Dropdown, message, Modal, Input, Button, Select } from "antd";
import { createVarOption, getVarOption } from "@/app/action/variantAction";
import { SmallSpinner } from "@/app/ui/spinner";
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
  const removeVariantOptionValue = useAdminStore(
    (state) => state.removeVariantOptionValue,
  );
  const setOptionIsSaved = useAdminStore((state) => state.setOptionIsSaved);
  const variantOptions = useAdminStore((state) => state.variantOptions);
  const setVariantOptions = useAdminStore((state) => state.setVariantOptions);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionName, setOptionName] = useState("");
  const [currentGroup, setCurrentGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const {
    data: storedOptions,
    isLoading,
    mutate,
  } = useSWR("/api/admin/variantOption", getVarOption, {
    revalidateOnFocus: false,
  });

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
        setLoading(true);
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
      } finally {
        setLoading(false);
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
    <div className="overflow-x-auto rounded-lg border border-gray-200 sm:overflow-x-auto md:overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center">
          <SmallSpinner />
        </div>
      )}
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-xs uppercase leading-normal text-gray-600">
            <th className="px-6 py-3 text-left font-medium">GROUP</th>
            <th className="px-6 py-3 text-left font-medium">OPTIONS</th>
            <th className="px-6 py-3 text-right font-medium">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="text-sm font-light text-gray-600">
          {variantOptions.map((group, i) => (
            <tr
              className={`${i !== variantOptions.length - 1 ? "border-b border-gray-200" : ""} hover:bg-gray-50`}
              key={group.id}
            >
              <td className="w-[33.333%] px-6 py-3 text-left font-medium">
                {group.labelName && (
                  <span className="text-xxs text-gray-500">
                    ({group.labelName})
                  </span>
                )}
                <input
                  type="text"
                  name={`var-group-${group.id}-name`}
                  autoComplete="off"
                  value={group.name}
                  placeholder="Group name (example: Size, Color, Material)"
                  className="block w-full rounded-md px-3 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                  onChange={(e) => {
                    updateVariantOptionName(group.id, e.target.value);
                    setOptionIsSaved(false);
                  }}
                />
              </td>
              <td className="py-3 text-left">
                {group.optionName && (
                  <span className="inline-block text-xxs leading-5 text-gray-500"></span>
                )}
                <label className="flex w-full flex-wrap items-center justify-start gap-1 rounded-md p-3 shadow-shadowSm hover:border hover:border-grayOutline">
                  {group?.values.map((value, index) => (
                    <span
                      className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xxs font-bold shadow-shadowSm"
                      key={index}
                    >
                      {value}
                      <button className="h-3 w-3 rounded-full bg-primary">
                        <DeleteIcon
                          className="cursor-pointer text-xs text-white"
                          onClick={() => {
                            removeVariantOptionValue(group.id, index);
                            setOptionIsSaved(false);
                          }}
                        />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    name={`var-group-${group.id}-value`}
                    autoComplete="off"
                    placeholder="Group name (e.g. Size, Color, Length)"
                    className="block rounded-md px-3 py-0.5 text-xs hover:bg-gray-50 focus:outline-none"
                    onKeyUp={(e) => {
                      updateVariantOptionValues(e, group.id);
                      setOptionIsSaved(false);
                    }}
                  />
                </label>
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
