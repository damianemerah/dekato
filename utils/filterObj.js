export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export function formDataToObject(formData) {
  if (!formData || !(formData instanceof FormData)) return formData;
  const obj = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
}
