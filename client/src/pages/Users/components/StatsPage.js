import { getAllUsersStats, changeUserComment } from "@/http/userApi";
import React, { useState, useEffect } from "react";
import styles from "../users.module.scss";
import { UserStats } from "./UserStats";
import { toast } from "react-toastify";
import { CustomInput } from "@/components/CustomElements/CustomInput";

const StatsPage = () => {
  const [allStats, setAllStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchPhone, setSearchPhone] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchStats({ offset: 0 });
  }, []);

  const fetchStats = async ({
    offset = 0,
    haveMoreData = false,
    phone = searchPhone,
  }) => {
    try {
      setLoading(true);
      const response = await getAllUsersStats({
        phone,
        offset: offset,
      });

      if (response.count && response.count / 50 > offset + 1) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }

      if (haveMoreData) {
        setAllStats((prev) => [...prev, ...(response.rows || response)]);
      } else {
        setAllStats(response.rows || response);
      }

      if (response.count !== undefined) {
        setCount(response.count);
      } else {
        setCount((response.rows || response).length);
      }
    } catch (error) {
      toast(error.response.data.message || "Error fetching stats");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchPhone("");
    setOffset(0);
    setAllStats([]);
    fetchStats({ offset: 0, phone: "" });
  };

  const handleLoadMore = () => {
    const newOffset = offset + 1;
    setOffset(newOffset);
    fetchStats({ offset: newOffset, haveMoreData: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <span>Пошук:</span>
        <div className={styles.input_wrapper}>
          <CustomInput
            placeholder="Введіть номер телефону"
            value={searchPhone}
            onChange={setSearchPhone}
          />
          {searchPhone && (
            <div className={styles.clear_icon_container} onClick={handleClear}>
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
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </div>
          )}
        </div>
        <button
          className="custom_btn"
          onClick={() => {
            setOffset(0);
            fetchStats({ offset: 0 });
          }}
        >
          Пошук
        </button>
      </div>
      <h1 className={styles.title}>Статистика користувачів</h1>

      <div className={styles.info}>Всього: {count} записів</div>

      {loading && offset === 0 && <p>Завантаження...</p>}

      {allStats.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Телефон</th>
                <th>Всього замовлень</th>
                <th>Виконано</th>
                <th>Провалено</th>
                <th>% Виконання</th>
                <th>Коментар</th>
              </tr>
            </thead>
            <tbody>
              {allStats.map((stat) => {
                return <UserStats key={stat.id} stat={stat} />;
              })}
            </tbody>
          </table>
        </div>
      )}

      {allStats.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <p>Статистика не знайдена</p>
        </div>
      )}

      {hasMore && allStats.length > 0 && (
        <div className={styles.loadMoreWrapper}>
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className={styles.loadMoreButton}
          >
            {loading ? "Завантаження..." : "Завантажити ще"}
          </button>
        </div>
      )}

      {!hasMore && allStats.length > 0 && (
        <div className={styles.endMessage}>Всі записи завантажено</div>
      )}
    </div>
  );
};

export default StatsPage;
