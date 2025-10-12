import React from "react";

export const CustomInput = ({ type="text", value, placeholder, onChange }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(event)=>onChange(event.target.value)}
      placeholder={placeholder}
    />
  );
};
