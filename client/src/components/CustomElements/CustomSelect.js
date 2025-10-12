import React, { useState } from "react";

const CustomSelect = ({ array, action, field = "name", placeholder = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="custom_select_container">
      <div className="custom_select_header" onClick={() => setIsOpen(!isOpen)}>
        {placeholder}
      </div>

      <div
        className="dropdown_list"
        style={{ display: isOpen ? "block" : "none" }}
      >
        {array.map((item) => (
          <div
            className="dropdown_item"
            key={item[field]}
            onClick={() => {
              action(item)
                setIsOpen(false);
            }}
          >
            {item[field]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
