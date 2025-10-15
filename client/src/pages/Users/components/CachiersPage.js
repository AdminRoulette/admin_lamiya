import * as userApi from "@/http/userApi";
import React, { useEffect, useState } from "react";
import classes from "../users.module.scss";
import { CloseShift, OpenCashierShift } from "@/http/ExternalApi/checkBoxAPI";
import Cashier from "./Cashier";
import CashierModal from "./CashierModal";
const CachiersPage = ({}) => {
  const [cashiers, setCashiers] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [cashierModalOpen, setCashierModalOpen] = useState(false);
  const [cashierToEdit, setCashierToEdit] = useState(null);
  const [modalType, setModalType] = useState(null); // 'edit' or 'bearer'
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState({});

  useEffect(() => {
    fetchCashiers({ offset: 0 });
  }, []);

  const fetchCashiers = async ({
    offset = 0,
    haveMoreData = false,
    // phone: shop_id = searchPhone,
    query = {},
  }) => {
    await userApi
      .allCashiers({ offset: offset, shop_id: 0, fop_id: 0 })
      .then((response) => {
        if (response.count / 50 > offset + 1) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
        if (haveMoreData) {
          setCashiers((prev) => [...prev, ...response.rows]);
        } else {
          setCashiers(response.rows);
        }

        setCount(response.count);
      });
  };
  const handleShiftToggle = async (cashierData) => {
    if (cashierData.shift) {
      await CloseShift({ id: cashierData.userId })
        .then(() => {
          setCashiers((prev) =>
            prev.map((c) =>
              c.id === cashierData.id ? { ...c, shift: false } : c
            )
          );
        })
        .catch((error) => {
          console.error("Error closing shift:", error);
        });
    } else {
      await OpenCashierShift({ id: cashierData.userId })
        .then(() => {
          setCashiers((prev) =>
            prev.map((c) =>
              c.id === cashierData.id ? { ...c, shift: true } : c
            )
          );
        })
        .catch((error) => {
          console.error("Error closing shift:", error);
        });
    }
  };

  // const handleClear = () => {
  //   setSearchPhone("");
  //   setOffset(0);
  //   setCashiers([]);
  //   fetchCashiers({ offset: 0 });
  // };

  const handleLoadMore = () => {
    const newOffset = offset + 1;
    setOffset(newOffset);
    fetchCashiers({ offset: newOffset, haveMoreData: true });
  };

  const handleOpenModal = (cashierData = null, type = "edit") => {
    setCashierModalOpen(true);
    setCashierToEdit(cashierData);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setCashierModalOpen(false);
    setCashierToEdit(null);
    setModalType(null);
  };

  return (
    <>
      <div className={classes.container}>
        {/* <div className={classes.searchBar}>
          <span>Пошук:</span>
          <div className={classes.input_wrapper}>
            <input
              placeholder="Введіть номер телефону"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
            />
            {searchPhone && (
              <div
                className={classes.clear_icon_container}
                onClick={handleClear}
              >
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
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setOffset(0);
              fetchCashiers({ offset: 0 });
            }}
          >
            Пошук
          </button>
        </div> */}
        <h1 className={classes.title}>Список касирів</h1>
        <div className={classes.info}>Всього: {count} записів</div>
        <button
          className={"custom_btn"}
          onClick={() => handleOpenModal(null, "")}
          style={{ marginBottom: "20px" }}
        >
          Створити касира
        </button>
        {cashiers.length > 0 && (
          <div className={classes.tableWrapper}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th>Касир</th>
                  <th>ФОП</th>
                  <th>Магазин</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cashiers.map((cashier) => {
                  return (
                    <Cashier
                      key={cashier.id}
                      cashier={cashier}
                      onModalOpen={handleOpenModal}
                      handleShiftToggle={handleShiftToggle}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {cashiers.length === 0 && (
          <div className={classes.emptyState}>
            <p>Касирів не знайдено</p>
          </div>
        )}
        {hasMore && cashiers.length > 0 && (
          <div className={classes.loadMoreWrapper}>
            <button onClick={handleLoadMore} className={classes.loadMoreButton}>
              {"Завантажити ще"}
            </button>
          </div>
        )}
        {!hasMore && cashiers.length > 0 && (
          <div className={classes.endMessage}>Всі записи завантажено</div>
        )}
      </div>
      {cashierModalOpen && (
        <CashierModal
          onClose={handleCloseModal}
          cashier={cashierToEdit}
          setCashiers={setCashiers}
          modalType={modalType}
        />
      )}
    </>
  );
};

export default CachiersPage;
