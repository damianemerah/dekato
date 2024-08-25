import { memo, useState } from "react";
import DeleteIcon from "@/public/assets/icons/remove.svg";
import { useAdminStore } from "@/app/admin/store/variantStore";

export default memo(function VariantGroupTable({ variantOptions }) {
  const [activeGroup, setActiveGroup] = useState({ id: null });

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
  return (
    <div className="rounded-lg border border-gray-200">
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
                <input
                  type="text"
                  name="var-group-1"
                  autoComplete="off"
                  value={group.name}
                  placeholder="Group name (example: Size, Color, Material)"
                  className="block w-full rounded-md px-3 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                  onChange={(e) =>
                    updateVariantOptionName(group.id, e.target.value)
                  }
                />
              </td>
              <td className="space-x-2 py-3 text-left">
                <label className="flex flex-wrap items-center justify-start gap-2 rounded-md p-3 shadow-shadowSm hover:border hover:border-grayOutline">
                  {group.values.map((value, index) => (
                    <span
                      className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xxs font-bold shadow-shadowSm"
                      key={index}
                    >
                      {value}
                      <button className="h-3 w-3 rounded-full bg-primary">
                        <DeleteIcon
                          className="cursor-pointer text-xs text-white"
                          onClick={() =>
                            removeVariantOptionValue(group.id, index)
                          }
                        />
                      </button>
                    </span>
                  ))}

                  <input
                    type="text"
                    name="var-group-1-input"
                    autoComplete="off"
                    placeholder="Group name (example: Size, Color, Material)"
                    className="block rounded-md px-3 py-0.5 text-xs hover:bg-gray-50 focus:outline-none"
                    onKeyUp={(e) => updateVariantOptionValues(e, group.id)}
                  />
                </label>
              </td>
              <td className="pr-6 text-right">
                <div className="relative inline-block text-xl font-bold tracking-wider text-primary">
                  <span
                    className=""
                    onClick={() =>
                      setActiveGroup((prev) =>
                        prev.id === group.id ? { id: null } : { id: group.id },
                      )
                    }
                  >
                    ...
                  </span>
                  {activeGroup.id === group.id && (
                    <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 flex-col items-start justify-center rounded-md border border-grayOutline bg-white shadow-shadowSm">
                      <button
                        className="left-full top-0 z-50 border-b border-b-grayOutline border-opacity-50 px-1.5 py-1 text-xs font-medium tracking-wide text-red-400"
                        onClick={() => removeVariantOption(group.id)}
                      >
                        Remove
                      </button>
                      <button
                        className="px-1.5 py-1 text-xs font-medium tracking-wide"
                        onClick={() => setActiveGroup({ id: null })}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
