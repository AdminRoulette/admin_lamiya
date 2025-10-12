import React, { useState } from "react";
import classes from "../users.module.scss";

const Cashier = ({ cashier, onModalOpen, handleShiftToggle }) => {
  return (
    <tr className={classes.row}>
      <td className={classes.id}>
        {cashier.user.lastname + " " + cashier.user.firstname}
      </td>
      <td>{cashier.fops_list.name}</td>
      <td>{cashier.shop.address}</td>
      <td className={classes.table_buttons}>
        <button className="second_btn" onClick={() => handleShiftToggle(cashier)}>
          {cashier.shift ? "Закрити зміну" : "Відкрити зміну"}
        </button>
        {!cashier.bearer && (
          <button className="custom_btn" onClick={() => onModalOpen(cashier, "bearer")}>
            Створити бірер
          </button>
        )}
      </td>

      <td>
        <div className={classes.icons_container}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-pencil-icon lucide-pencil"
            onClick={() => onModalOpen(cashier)}
          >
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-trash-icon lucide-trash"
            onClick={() => onModalOpen(cashier, "delete")}
          >
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </div>
      </td>
    </tr>
  );
};

export default Cashier;
