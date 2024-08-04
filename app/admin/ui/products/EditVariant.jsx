import { ButtonPrimary } from "@/app/ui/Button";

import DeleteIcon from "@/public/assets/icons/remove.svg";
import AddIcon from "@/public/assets/icons/add.svg";
import ListIcon from "@/public/assets/icons/list.svg";
import Image from "next/image";
import Image5 from "@/public/assets/image5.png";
import Image6 from "@/public/assets/image6.png";

export default function EditVariant({
  setOpenSlider,
  openSlider,
  handleOpenSlider2,
}) {
  const handleRemoveVar = () => {
    console.log("Remove Variant");
  };

  return (
    <div
      className={`fixed inset-0 transition-transform duration-500 ${openSlider ? "translate-x-0" : "translate-x-full"} overflow x-hidden z-10`}
    >
      <div
        className="absolute inset-0 h-full w-full bg-white bg-opacity-70 blur-md"
        onClick={() => setOpenSlider(false)}
      ></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-5xl overflow-y-scroll bg-white shadow-shadowBig">
        <div className="sticky top-0 z-[25] flex min-h-24 items-center justify-between px-6 shadow-shadowSm">
          <h2 className="text-xl font-medium text-primary">Edit Variants</h2>
          <DeleteIcon
            className="cursor-pointer text-xl"
            onClick={() => setOpenSlider(false)}
          />
        </div>
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-medium text-primary">Group</h2>
            <ButtonPrimary className="flex items-center gap-1.5 !rounded-full !px-4 !py-1.5">
              <AddIcon className="text-xxs font-extrabold text-white" />
              Add
            </ButtonPrimary>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-xs uppercase leading-normal text-gray-600">
                  <th className="px-6 py-3 text-left font-medium">GROUP</th>
                  <th className="px-6 py-3 text-left font-medium">OPTIONS</th>
                  <th className="px-6 py-3 text-right font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-sm font-light text-gray-600">
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="w-[33.333%] px-6 py-3 text-left font-medium">
                    <input
                      type="text"
                      name="var-group-1"
                      autoComplete="off"
                      placeholder="Group name (example: Size, Color, Material)"
                      className="block w-full rounded-md px-3 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                    />
                  </td>
                  <td className="space-x-2 py-3 text-left">
                    <div className="flex flex-wrap items-center justify-start gap-2 rounded-md p-3 shadow-shadowSm hover:border hover:border-grayOutline">
                      <span className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xxs font-bold shadow-shadowSm">
                        RED
                        <button className="h-3 w-3 rounded-full bg-primary">
                          <DeleteIcon
                            className="cursor-pointer text-xs text-white"
                            onClick={handleRemoveVar}
                          />
                        </button>
                      </span>

                      <input
                        type="text"
                        name="var-group-1-input"
                        autoComplete="off"
                        placeholder="Group name (example: Size, Color, Material)"
                        className="block rounded-md px-3 py-0.5 text-xs hover:bg-gray-50 focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="pr-6 text-right">
                    <button className="text-xl font-bold tracking-wider text-primary">
                      ...
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-medium text-primary">Variants</h2>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 !rounded-full bg-primary !px-4 !py-1.5 text-white"
                onClick={handleOpenSlider2}
              >
                <AddIcon className="text-xxs font-extrabold text-white" />
                Add
              </button>
              <ButtonPrimary className="flex items-center gap-1.5 !rounded-full !px-4 !py-1.5">
                <ListIcon className="text-lg font-extrabold text-white" />
                Bulk Add
              </ButtonPrimary>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full table-fixed bg-white">
              <thead>
                <tr className="bg-gray-100 text-xs uppercase leading-normal text-gray-600">
                  <th className="max-w-6 px-6 py-3 text-left font-medium">
                    IMAGE
                  </th>
                  <th className="text-left font-medium">OPTIONS</th>
                  <th className="py-3 text-left font-medium">QUANTITY</th>
                  <th className="py-3 text-left font-medium">PRICE</th>
                  <th className="px-6 py-3 text-right font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-sm font-light text-gray-600">
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-left font-medium">
                    <div className="h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={Image6}
                        alt="product image"
                        width={100}
                        height={100}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 text-left">
                    <div className="flex flex-wrap items-center justify-start gap-x-1 gap-y-1.5 rounded-md">
                      <div className="cursor-pointer rounded-full text-sm">
                        <span className="rounded-l-full bg-slate-500 p-1.5 text-xxs font-semibold uppercase tracking-widest text-white">
                          Color
                        </span>
                        <span className="rounded-r-full bg-slate-100 p-1.5 text-xxs font-semibold uppercase tracking-widest text-primary">
                          Yellow
                        </span>
                      </div>
                      <div className="cursor-pointer rounded-full text-sm">
                        <span className="rounded-l-full bg-slate-500 p-1.5 text-xxs font-semibold uppercase tracking-widest text-white">
                          Color
                        </span>
                        <span className="rounded-r-full bg-slate-100 p-1.5 text-xxs font-semibold uppercase tracking-widest text-primary">
                          Yellow
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <input
                      type="number"
                      name="quantity"
                      autoComplete="off"
                      placeholder="Quantity"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      autoComplete="off"
                      placeholder="Price"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                    />
                  </td>
                  <td className="pr-6 text-right">
                    <button className="align-middle text-xl font-bold tracking-wider text-primary">
                      ...
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-left font-medium">
                    <div className="h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={Image6}
                        alt="product image"
                        width={100}
                        height={100}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 text-left">
                    <div className="flex flex-wrap items-center justify-start gap-x-1 gap-y-1.5 rounded-md">
                      <div className="cursor-pointer rounded-full text-sm">
                        <span className="rounded-l-full bg-slate-500 p-1.5 text-xxs font-semibold uppercase tracking-widest text-white">
                          Color
                        </span>
                        <span className="rounded-r-full bg-slate-100 p-1.5 text-xxs font-semibold uppercase tracking-widest text-primary">
                          Yellow
                        </span>
                      </div>
                      <div className="cursor-pointer rounded-full text-sm">
                        <span className="rounded-l-full bg-slate-500 p-1.5 text-xxs font-semibold uppercase tracking-widest text-white">
                          Color
                        </span>
                        <span className="rounded-r-full bg-slate-100 p-1.5 text-xxs font-semibold uppercase tracking-widest text-primary">
                          Yellow
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <input
                      type="number"
                      name="quantity"
                      autoComplete="off"
                      placeholder="Quantity"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      autoComplete="off"
                      placeholder="Price"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                    />
                  </td>
                  <td className="pr-6 text-right">
                    <button className="align-middle text-xl font-bold tracking-wider text-primary">
                      ...
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-left font-medium">
                    <div className="h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={Image6}
                        alt="product image"
                        width={100}
                        height={100}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 text-left">
                    <div className="flex flex-wrap items-center justify-start gap-x-1 gap-y-1.5 rounded-md">
                      <div className="cursor-pointer rounded-full text-sm">
                        <span className="rounded-l-full bg-slate-500 p-1.5 text-xxs font-semibold uppercase tracking-widest text-white">
                          Color
                        </span>
                        <span className="rounded-r-full bg-slate-100 p-1.5 text-xxs font-semibold uppercase tracking-widest text-primary">
                          Yellow
                        </span>
                      </div>
                      <div className="cursor-pointer rounded-full text-sm">
                        <span className="rounded-l-full bg-slate-500 p-1.5 text-xxs font-semibold uppercase tracking-widest text-white">
                          Color
                        </span>
                        <span className="rounded-r-full bg-slate-100 p-1.5 text-xxs font-semibold uppercase tracking-widest text-primary">
                          Yellow
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <input
                      type="number"
                      name="quantity"
                      autoComplete="off"
                      placeholder="Quantity"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      autoComplete="off"
                      placeholder="Price"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                    />
                  </td>
                  <td className="pr-6 text-right">
                    <button className="align-middle text-xl font-bold tracking-wider text-primary">
                      ...
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-left font-medium">
                    <div className="h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={Image6}
                        alt="product image"
                        width={100}
                        height={100}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 text-left">
                    <div className="flex flex-wrap items-center justify-start gap-x-1 gap-y-1.5 rounded-md">
                      <div className="cursor-pointer rounded-full text-sm">
                        <span className="rounded-l-full bg-slate-500 p-1.5 text-xxs font-semibold uppercase tracking-widest text-white">
                          Color
                        </span>
                        <span className="rounded-r-full bg-slate-100 p-1.5 text-xxs font-semibold uppercase tracking-widest text-primary">
                          Yellow
                        </span>
                      </div>
                      <div className="cursor-pointer rounded-full text-sm">
                        <span className="rounded-l-full bg-slate-500 p-1.5 text-xxs font-semibold uppercase tracking-widest text-white">
                          Color
                        </span>
                        <span className="rounded-r-full bg-slate-100 p-1.5 text-xxs font-semibold uppercase tracking-widest text-primary">
                          Yellow
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <input
                      type="number"
                      name="quantity"
                      autoComplete="off"
                      placeholder="Quantity"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      autoComplete="off"
                      placeholder="Price"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                    />
                  </td>
                  <td className="pr-6 text-right">
                    <button className="align-middle text-xl font-bold tracking-wider text-primary">
                      ...
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-left font-medium">
                    <div className="h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={Image6}
                        alt="product image"
                        width={100}
                        height={100}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 text-left">
                    <div className="flex flex-wrap items-center justify-start gap-x-1 gap-y-1.5 rounded-md">
                      <div className="cursor-pointer rounded-full text-sm">
                        <span className="rounded-l-full bg-slate-500 p-1.5 text-xxs font-semibold uppercase tracking-widest text-white">
                          Color
                        </span>
                        <span className="rounded-r-full bg-slate-100 p-1.5 text-xxs font-semibold uppercase tracking-widest text-primary">
                          Yellow
                        </span>
                      </div>
                      <div className="cursor-pointer rounded-full text-sm">
                        <span className="rounded-l-full bg-slate-500 p-1.5 text-xxs font-semibold uppercase tracking-widest text-white">
                          Color
                        </span>
                        <span className="rounded-r-full bg-slate-100 p-1.5 text-xxs font-semibold uppercase tracking-widest text-primary">
                          Yellow
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <input
                      type="number"
                      name="quantity"
                      autoComplete="off"
                      placeholder="Quantity"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      autoComplete="off"
                      placeholder="Price"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                    />
                  </td>
                  <td className="pr-6 text-right">
                    <button className="align-middle text-xl font-bold tracking-wider text-primary">
                      ...
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-left font-medium">
                    <div className="h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={Image6}
                        alt="product image"
                        width={100}
                        height={100}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 text-left">
                    <div className="flex flex-wrap items-center justify-start gap-x-1 gap-y-1.5 rounded-md">
                      <div className="cursor-pointer rounded-full text-sm">
                        <span className="rounded-l-full bg-slate-500 p-1.5 text-xxs font-semibold uppercase tracking-widest text-white">
                          Color
                        </span>
                        <span className="rounded-r-full bg-slate-100 p-1.5 text-xxs font-semibold uppercase tracking-widest text-primary">
                          Yellow
                        </span>
                      </div>
                      <div className="cursor-pointer rounded-full text-sm">
                        <span className="rounded-l-full bg-slate-500 p-1.5 text-xxs font-semibold uppercase tracking-widest text-white">
                          Color
                        </span>
                        <span className="rounded-r-full bg-slate-100 p-1.5 text-xxs font-semibold uppercase tracking-widest text-primary">
                          Yellow
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <input
                      type="number"
                      name="quantity"
                      autoComplete="off"
                      placeholder="Quantity"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      autoComplete="off"
                      placeholder="Price"
                      className="flex w-20 items-center justify-center rounded-md px-1.5 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
                    />
                  </td>
                  <td className="pr-6 text-right">
                    <button className="align-middle text-xl font-bold tracking-wider text-primary">
                      ...
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="fixed bottom-0 right-0 mr-5 flex items-center justify-end gap-6 py-4">
              <button className="text-[15px] font-bold tracking-wider">
                Cancel
              </button>
              <ButtonPrimary className="!rounded-md !px-3.5 py-4">
                Save changes
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
