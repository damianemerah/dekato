import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789", 10);

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
    if (variant.options) {
      Object.entries(variant.options).forEach(([key, value]) => {
        if (!result[key]) {
          result[key] = new Set();
        }

        result[key].add(value);
      });
    }
  });

  const formattedResult = Object.keys(result).map((key) => ({
    id: key.id || nanoid(),
    name: key,
    values: Array.from(result[key]),
  }));

  return formattedResult;
};

export function getQueryObj(searchParams) {
  const params = Object.fromEntries(
    //not price/quantity, convert -vr to array
    Object.entries(searchParams).map(([key, value]) => {
      return [
        key,
        Array.isArray(value)
          ? value.slice(-1)
          : isFinite(value) && !key.endsWith("-vr")
            ? value
            : value.split(","),
      ];
    }),
  );

  let variantConditions = [];

  for (const key in params) {
    if (key.includes("-vr")) {
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

  // Add default limit and page if not provided
  params.limit = params.limit || 20;
  params.page = params.page || 1;

  return params;
}

export const formatToNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
