"use client";

import { useCallback } from "react";
import styles from "@/app/ui/inputStyle.module.css";

export function InputType({
  name,
  label,
  required = false,
  type = "text",
  value = "",
  defaultValue = "",
}) {
  const floatingLabel = styles.floatingLabel;

  const renderFormField = useCallback(
    ({
      name,
      label,
      required = false,
      type = "text",
      value = "",
      defaultValue = "",
    }) => (
      <div className={`${floatingLabel} flex-grow`}>
        <input
          type={type}
          name={name}
          placeholder=" "
          required={required}
          id={name}
          defaultValue={defaultValue || value}
          className="w-full border border-primary px-4 pb-2 pt-6 !text-primary ring-inset ring-gray-200 focus:outline-none focus:ring-4"
        />
        <label htmlFor={name} className="text-gray-500">
          {label}
          {required ? "*" : ""}
        </label>
      </div>
    ),
    [floatingLabel],
  );

  return renderFormField({ name, label, required, type, value, defaultValue });
}
