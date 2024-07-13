export function includePriceObj(searchParams) {
  const params = { ...searchParams };

  for (const key in params) {
    if (Array.isArray(params[key])) {
      params[key] = params[key][0];
    }
  }

  const priceRange = {};
  if (params.min) {
    priceRange.$gte = params.min;
    params.price = { ...priceRange };
  }
  if (params.max) {
    priceRange.$lte = params.max;
    params.price = { ...priceRange };
  }
  if (params.quantity) params.quantity = { $gte: params.quantity };

  delete params.min;
  delete params.max;

  return params;
}
