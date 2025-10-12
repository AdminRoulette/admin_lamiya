import React from "react";
import styles from "../users.module.scss";

const User = ({ user, onModalOpen }) => {
  return (
    <tr className={styles.row}>
      <td className={styles.phone}>{user.id}</td>
      <td className={styles.phone}>{user.email}</td>
      <td className={styles.totalOrders}>{user.role}</td>
      <td className={styles.completed}>{user.lastname}</td>
      <td className={styles.completed}>{user.firstname}</td>
      <td className={styles.completed}>{user.phone}</td>
      <td className={styles.completed}>{user.ref}</td>
      <td>
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
          class="lucide lucide-pencil-icon lucide-pencil"
          onClick={() => onModalOpen(user)}
        >
          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
          <path d="m15 5 4 4" />
        </svg>
      </td>
    </tr>
  );
};
export default User;
