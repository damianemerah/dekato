import { memo } from "react";
import { useAdminStore } from "@/app/(frontend)/admin/store/adminStore";

function VariantRow() {
  const variantOptions = useAdminStore((state) => state.variantOptions);
  const variantIsSaved = useAdminStore((state) => state.variantIsSaved);
  return (
    <>
      {variantIsSaved &&
        variantOptions.map((group, i) => (
          <tr className="border-b border-gray-200 hover:bg-gray-50" key={i}>
            <td className="px-6 py-3 text-left font-medium">
              {group.name.toUpperCase()}
            </td>
            <td className="space-x-2 px-6 py-3 text-right">
              {group.values.map((value, index) => (
                <span
                  className="inline-block rounded-full px-3 py-0.5 text-xxs font-bold shadow-shadowSm"
                  key={index}
                >
                  {value.toUpperCase()}
                </span>
              ))}
            </td>
          </tr>
        ))}
    </>
  );
}

const VariantsSection = ({ handleOpenSlider }) => {
  return (
    <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary">
          VARIANT
        </h3>
        <button
          className="rounded-full bg-primary px-4 py-1 text-xxs font-bold tracking-[0.12em] text-white"
          onClick={handleOpenSlider}
        >
          EDIT
        </button>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-xs uppercase leading-normal text-gray-600">
              <th className="px-6 py-3 text-left">GROUP</th>
              <th className="px-6 py-3 text-right">OPTIONS</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light text-gray-600">
            <VariantRow />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(VariantsSection);
