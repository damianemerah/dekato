import { ButtonPrimary } from "@/app/ui/Button";
import { useState } from "react";

const VariantsSection = () => {
  const handleAddVariant = () => {};

  const handleInputChange = (e) => {};

  const handleDeleteVariant = (index) => {};

  return (
    <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xxs mb-1 block font-bold tracking-wider text-primary">
          VARIANT
        </h3>
        <button className="text-xxs rounded-full bg-primary px-4 py-1 font-bold tracking-wider text-white">
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
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-3 text-left font-medium">Color</td>
              <td className="space-x-2 px-6 py-3 text-right">
                <span className="text-xxs inline-block rounded-full bg-slate-300 px-3 py-0.5 font-bold opacity-90">
                  RED
                </span>
                <span className="text-xxs inline-block rounded-full bg-slate-300 px-3 py-0.5 font-bold opacity-90">
                  GREEN
                </span>
                <span className="text-xxs inline-block rounded-full bg-slate-300 px-3 py-0.5 font-bold opacity-90">
                  GOLD
                </span>
              </td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-3 text-left font-medium">Size</td>
              <td className="space-x-2 px-6 py-3 text-right">
                <span className="text-xxs inline-block rounded-full bg-slate-300 px-3 py-0.5 font-bold opacity-90">
                  XL
                </span>
                <span className="text-xxs inline-block rounded-full bg-slate-300 px-3 py-0.5 font-bold opacity-90">
                  XXL
                </span>
                <span className="text-xxs inline-block rounded-full bg-slate-300 px-3 py-0.5 font-bold opacity-90">
                  3XL
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VariantsSection;
