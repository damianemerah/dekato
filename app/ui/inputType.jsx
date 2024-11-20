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
  icon: Icon = null,
  onIconClick = () => {},
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
      icon: Icon,
      onIconClick,
    }) => (
      <div className={`${floatingLabel} relative flex-grow`}>
        <input
          type={type}
          name={name}
          placeholder=" "
          required={required}
          id={name}
          defaultValue={defaultValue || value}
          className={`w-full border border-primary px-4 pb-2 pt-6 !text-primary ring-inset ring-gray-200 focus:outline-none focus:ring-4 ${
            Icon ? "pr-12" : ""
          }`}
        />
        <label htmlFor={name} className="text-gray-500">
          {label}
          {required ? "*" : ""}
        </label>
        {Icon && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={onIconClick}
            role="button"
            tabIndex={0}
            aria-label={`Toggle ${label} visibility`}
          >
            <Icon className="w-5" />
          </div>
        )}
      </div>
    ),
    [floatingLabel],
  );

  return renderFormField({
    name,
    label,
    required,
    type,
    value,
    defaultValue,
    icon: Icon,
    onIconClick,
  });
}
