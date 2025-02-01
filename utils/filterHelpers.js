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

export const formatCategories = (categories) => {
  return categories?.map(({ _id, parent, createdAt, ...rest }) => {
    const { _id: pid, ...p } = parent || {};
    const formattedCategory = {
      id: _id.toString(),
      parent: parent ? { id: pid.toString(), ...p } : null,
      ...rest,
    };
    if (createdAt) {
      formattedCategory.createdAt = createdAt.toISOString();
    }
    return formattedCategory;
  });
};
