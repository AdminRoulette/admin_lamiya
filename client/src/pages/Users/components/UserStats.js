import { changeUserComment } from "@/http/userApi";
import React from "react";
import { toast } from "react-toastify";
import styles from "../users.module.scss";

export const UserStats = ({ stat }) => {
  const [comment, setComment] = React.useState(stat.comment || "");

  const handleCommentChange = async (newComment) => {
    await changeUserComment({ id: stat.id, comment: newComment })
      .then(() => {
        setComment(newComment);
        toast.success("Comment updated successfully");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error updating comment");
      });
  };

  return (
    <tr className={styles.row}>
      <td className={styles.phone}>{stat.phone}</td>
      <td className={styles.totalOrders}>{stat.total_orders}</td>
      <td className={styles.completed}>{stat.completed_orders}</td>
      <td className={`${styles.failed} ${stat.failed_orders > 0 ? styles.hasFailures : ""}`}>
        {stat.failed_orders}
      </td>
      <td>
        <span
          className={`${styles.badge} ${
            stat.completed_percent === 100
              ? styles.badgeSuccess
              : stat.completed_percent === 0
                ? styles.badgeDanger
                : styles.badgeWarning
          }`}
        >
          {stat.completed_percent.toFixed(1)}%
        </span>
      </td>
      <td>
        <textarea
          className={styles.commentTextarea}
          value={comment}
          placeholder="Add a comment..."
          onChange={(e) => setComment(e.target.value)}
          onBlur={(e) => handleCommentChange(e.target.value)}
        />
      </td>
    </tr>
  );
};