'use server';

import dbConnect from '@/app/lib/mongoConnection';
import OptionGroup from '@/models/variantsOption'; // Static import
import { omit } from 'lodash';
import { restrictTo } from '@/app/utils/checkPermission';
import handleAppError from '@/app/utils/appError';

export async function getVarOption() {
  await restrictTo('user', 'admin');

  await dbConnect(); // Ensure connection is established
  try {
    const options = await OptionGroup.find().lean();
    return options.map((option) => ({
      id: option._id.toString(),
      ...omit(option, '_id'),
    }));
  } catch (error) {
    throw error;
  }
}

export async function getVarOptionById(id) {
  await restrictTo('user', 'admin');

  await dbConnect();
  const option = await OptionGroup.findById(id)
    .select('-_id name values')
    .lean();
  return option;
}

export async function createVarOption(option) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const newOption = await OptionGroup.create(option);
    const leanOption = newOption.toObject();
    return { id: leanOption._id.toString(), ...omit(leanOption, '_id') };
  } catch (error) {
    const err = handleAppError(error);
    throw new Error(err.message);
  }
}

export async function updateVarOption(id, option) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const updatedOption = await OptionGroup.findByIdAndUpdate(id, option, {
      new: true,
      lean: true,
    });
    return {
      id: updatedOption._id.toString(),
      ...omit(updatedOption, '_id'),
    };
  } catch (error) {
    const err = handleAppError(error);
    throw new Error(err.message);
  }
}

export async function deleteVarOption(id) {
  await restrictTo('admin');

  try {
    await dbConnect();
    await OptionGroup.findByIdAndDelete(id).lean();
    return { success: true };
  } catch (error) {
    const err = handleAppError(error);
    throw new Error(err.message);
  }
}
