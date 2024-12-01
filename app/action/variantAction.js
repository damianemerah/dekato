"use server";

import dbConnect from "@/lib/mongoConnection";
import OptionGroup from "@/models/variantsOption"; // Static import
import { omit } from "lodash";

export async function getVarOption() {
  await dbConnect(); // Ensure connection is established
  try {
    const options = await OptionGroup.find().lean();
    return options.map((option) => ({
      id: option._id.toString(),
      ...omit(option, "_id"),
    }));
  } catch (error) {
    throw error;
  }
}

export async function getVarOptionById(id) {
  await dbConnect();
  const option = await OptionGroup.findById(id)
    .select("-_id name values")
    .lean();
  return option;
}

export async function createVarOption(option) {
  try {
    const newOption = await OptionGroup.create(option);
    const leanOption = newOption.toObject();
    return { id: leanOption._id.toString(), ...omit(leanOption, "_id") };
  } catch (error) {
    throw error;
  }
}

export async function updateVarOption(id, option) {
  try {
    const updatedOption = await OptionGroup.findByIdAndUpdate(id, option, {
      new: true,
      lean: true,
    });
    return {
      id: updatedOption._id.toString(),
      ...omit(updatedOption, "_id"),
    };
  } catch (error) {
    throw error;
  }
}

export async function deleteVarOption(id) {
  try {
    await OptionGroup.findByIdAndDelete(id).lean();
  } catch (error) {
    throw error;
  }
}
