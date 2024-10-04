import AppError from "./errorClass";
import { v4 as uuidv4 } from "uuid";

export function getQuantity(item, product) {
  // Check if product exists or variant exists
  if (item.variantId && product?.variant.length > 0) {
    const variant = product.variant.find(
      (doc) => doc._id.toString() === item.variantId,
    );

    if (!variant || +variant.quantity === 0) {
      throw new Error("Product out of stock");
    }

    if (+item.quantity > +variant.quantity && +variant.quantity > 0) {
      item.quantity = variant.quantity;
      return item.quantity;
    } else {
      return item.quantity;
    }
  } else if (+product.quantity === 0) {
    throw new Error("Product out of stock");
  } else if (+item.quantity > +product.quantity && +product.quantity > 0) {
    item.quantity = +product.quantity;
    return +item.quantity;
  } else {
    return +item.quantity;
  }
}

//generate variantOptions
export const generateVariantOptions = (variants) => {
  const clonedVariants = [...variants];

  const result = {};
  clonedVariants.forEach((variant) => {
    Object.entries(variant.options).forEach(([key, value]) => {
      if (!result[key]) {
        result[key] = new Set();
      }

      result[key].add(value);
    });
  });

  const formattedResult = Object.keys(result).map((key) => ({
    id: key.id || uuidv4(),
    name: key,
    values: Array.from(result[key]),
  }));
  return formattedResult;
};

export function getQueryObj(searchParams) {
  const params = Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.slice(-1) : value.split(","),
    ]),
  );

  let variantConditions = [];

  for (const key in params) {
    if (key.includes("-vr")) {
      console.log(key, "key🚀😎💎🎈🐯⭐😎");
      // Add variant conditions for size and color
      const newKey = key.replace("-vr", "");
      variantConditions.push({ [`options.${newKey}`]: { $in: params[key] } });
      delete params[key];
    } else if (key === "price") {
      // Handle price range
      const [minPrice, maxPrice] = params.price.map((n) =>
        isNaN(n) ? Number.MAX_SAFE_INTEGER : n,
      );
      params.price = { $gte: minPrice, $lte: maxPrice };
    } else if (key === "quantity") {
      params.quantity = { $gte: parseInt(params.quantity[0]) };
    } else {
      // Handle other general filters
      params[key] =
        params[key].length > 1 ? { $in: params[key] } : params[key][0];
    }
  }

  // If we have any variant conditions, use $or to match any of them
  if (variantConditions.length > 0) {
    params.variant = { $elemMatch: { $or: variantConditions } };
  }

  return params;
}
