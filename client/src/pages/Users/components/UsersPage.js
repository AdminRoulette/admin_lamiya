import { allUsers } from "@/http/userApi";
import React, { useEffect, useState } from "react";
import classes from "../users.module.scss";
import User from "./User";
import UserModal from "./UserModal";
import { toast } from "react-toastify";
import {
  ROLE_ADMIN,
  ROLE_USER,
  ROLE_AUTHOR,
  ROLE_SEO,
  ROLE_SELLER,
} from "@/utils/constants";
import { CustomInput } from "@/components/CustomElements/CustomInput";
import CustomSelect from "@/components/CustomElements/CustomSelect";
const UsersPage = ({}) => {
  const [users, setUsers] = useState([]);
  const [offset, setOffset] = useState(0);
  const [searchPhone, setSearchPhone] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [count, setCount] = useState(0);
  const [roleToSearch, setRoleToSearch] = useState("");
  const [isListOpen, setIsListOpen] = React.useState(false);

  const roleList = [
    { value: ROLE_ADMIN, name: "Адміністратор" },
    { value: ROLE_AUTHOR, name: "Автор" },
    { value: ROLE_SEO, name: "SEO" },
    { value: ROLE_SELLER, name: "Касир" },
    { value: ROLE_USER, name: "Користувач" },
    { value: "ALL", name: "Всі ролі з привілегіями" },
  ];
  const [searchOption, setSearchOption] = useState("");

  useEffect(() => {
    fetchUsers({ offset: 0 });
  }, []);

  const fetchUsers = async ({
    offset = 0,
    haveMoreData = false,
    phone = searchPhone,
    role = roleToSearch,
  }) => {
    await allUsers({ offset: offset, phone, role })
      .then((response) => {
        if (response.count && response.count / 50 > offset + 1) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }

        if (haveMoreData) {
          setUsers((prev) => [...prev, ...(response.rows || response)]);
        } else {
          setUsers(response.rows || response);
        }

        if (response.count !== undefined) {
          setCount(response.count);
        } else {
          setCount((response.rows || response).length);
        }
      })
      .catch((error) => {
        toast(error.response?.data?.message);
      });
  };

  const handleClear = () => {
    setSearchPhone("");
    setOffset(0);
    setUsers([]);
    fetchUsers({ offset: 0, phone: "" });
  };

  const handleLoadMore = () => {
    const newOffset = offset + 1;
    setOffset(newOffset);
    fetchUsers({ offset: newOffset, haveMoreData: true });
  };

  const handleOpenModal = (userData = null) => {
    setUserModalOpen(true);
    setUserToEdit(userData);
  };

  const handleCloseModal = () => {
    setUserModalOpen(false);
    setUserToEdit(null);
  };

  const handleSelect = (item) => {
    setRoleToSearch(item.value);
    setIsListOpen(false);
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.searchBar}>
          <span>Пошук:</span>
          <div className={classes.input_wrapper}>
            <CustomInput
              placeholder="Введіть номер телефону"
              value={searchPhone}
              onChange={setSearchPhone}
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

          <CustomSelect
            placeholder={roleToSearch ? roleToSearch : "Оберіть тип пошуку"}
            action={(item) => setRoleToSearch(item?.value)}
            field="value"
            array={roleList}
          />

          <button className="second_btn"
            onClick={() => {
              setOffset(0);
              fetchUsers({ offset: 0 });
            }}
          >
            Пошук
          </button>
        </div>
        <h1 className={classes.title}>Список користувачів</h1>
        <div className={classes.info}>Всього: {count} записів</div>
        {users.length > 0 && (
          <div className={classes.tableWrapper}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Пошта</th>
                  <th>Роль</th>
                  <th>Фамілія</th>
                  <th>Ім'я</th>
                  <th>Телефон</th>
                  <th>Рефералка</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  return (
                    <User
                      key={user.id}
                      user={user}
                      onModalOpen={handleOpenModal}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {users.length === 0 && (
          <div className={classes.emptyState}>
            <p>Користувачів не знайдено</p>
          </div>
        )}
        {hasMore && users.length > 0 && (
          <div className={classes.loadMoreWrapper}>
            <button onClick={handleLoadMore} className={classes.loadMoreButton}>
              {"Завантажити ще"}
            </button>
          </div>
        )}
        {!hasMore && users.length > 0 && (
          <div className={classes.endMessage}>Всі записи завантажено</div>
        )}
      </div>
      {userModalOpen && (
        <UserModal
          onClose={handleCloseModal}
          user={userToEdit}
          setUsers={setUsers}
        />
      )}
    </>
  );
};
export default UsersPage;
