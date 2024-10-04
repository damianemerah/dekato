export function createSearchParams(params) {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const valueArray = params[key];
      if (key === "price") {
        const formattedPrice = valueArray.map((priceRange) =>
          priceRange.replace(/₦|\s/g, "").split("-"),
        );
        searchParams.set(key, formattedPrice.join(","));
      } else {
        searchParams.set(key, valueArray.join(","));
      }
    }
  }

  return searchParams.toString();
}
