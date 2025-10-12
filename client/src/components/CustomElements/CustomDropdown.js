import classes from "@/pages/Product/productPage.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { CustomInput } from "@/components/CustomElements/CustomInput";

export const CustomDropdown = ({
  placeholder="",
  array=[],
  dropdownAction,
  field = "name", 
  externalValue = "",
}) => {
  const [inputValue, setInputValue] = useState(externalValue);
  const [filteredArray, setFilteredArray] = useState(array);
  const arrowRef = useRef(null);
  useEffect(() => {
      setInputValue(externalValue);
      setFilteredArray(array);
  },[array])

  const handleSelect = (value) => {
    setInputValue(value[field]);
    setFilteredArray(array)
    dropdownAction(value);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
    setFilteredArray(array.filter((item) => item[field].toLowerCase().includes(value.toLowerCase())));
    if (value.length === 0) dropdownAction(null);
  };
  return (
    <div className={"dropdown_input_container"}>
      <div className="dropdown_input">
        <input
          type={"text"}
          value={inputValue}
          onChange={(event) => handleInputChange(event.target.value)}
          placeholder={placeholder}
          ref={arrowRef}
        />
        <div className={"icon_container"}>
          {inputValue.length > 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x-icon lucide-x"
              onClick={() => {
                {
                  handleInputChange("");
                }
              }}
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-chevron-down-icon lucide-chevron-down"
              onClick={() => arrowRef.current.focus()}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          )}
        </div>
      </div>
      {filteredArray.length > 0 && (
        <div className={"dropdown_list"}>
          {filteredArray.map((arrayElem, index) => {
            return (
              <div
                key={index}
                onClick={() => handleSelect(arrayElem)}
                className={"dropdown_item"}
              >
                {arrayElem[field]}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
