import { CustomDropdown } from "@/components/CustomElements/CustomDropdown";
import { CustomInput } from "@/components/CustomElements/CustomInput";
import { CustomModal } from "@/components/CustomElements/CustomModal";
import classes from "../users.module.scss";
import { changeUserData, createUser } from "@/http/userApi";
import {
  ROLE_ADMIN,
  ROLE_AUTHOR,
  ROLE_SELLER,
  ROLE_SEO,
  ROLE_USER,
} from "@/utils/constants";
import React from "react";

const UserModal = ({ onClose, user, setUsers }) => {
  const [email, setEmail] = React.useState(user?.email || "");
  const [role, setRole] = React.useState(user?.role || "");
  const [firstname, setFirstname] = React.useState(user?.firstname || "");
  const [lastname, setLastname] = React.useState(user?.lastname || "");
  const [phone, setPhone] = React.useState(user?.phone || "");
  const [ref, setRef] = React.useState(user?.ref || "");
  const roleList = [
    { value: ROLE_ADMIN, name: "Адміністратор" },
    { value: ROLE_AUTHOR, name: "Автор" },
    { value: ROLE_SEO, name: "SEO" },
    { value: ROLE_SELLER, name: "Касир" },
    { value: ROLE_USER, name: "Користувач" },
    { value: "ALL", name: "Всі ролі з привілегіями" },
  ];
  const [isListOpen, setIsListOpen] = React.useState(false);

  const handleEdit = async () => {
    await changeUserData({
      id: user.id,
      email,
      role,
      firstname,
      lastname,
      phone,
      ref,
    })
      .then((res) => {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, ...res } : u))
        );
        onClose();
      })
      .catch((error) => {
        toast(error.response.data.message);
      });
  };

  const CreateUser = async () => {
    await createUser({
      email,
      role,
      firstname,
      lastname,
      phone,
      ref,
    })
      .then((res) => {
        setUsers((prev) => [res, ...prev]);
        onClose();
      })
      .catch((error) => {
        toast(error.response.data.message);
      });
  };

  const handleSelect = (item) => {
    setRole((prev) => {
      if (!prev.includes(item.value)) {
        return prev ? prev + "," + item.value : item.value;
      }
      return prev;
    });
    setIsListOpen(false);
  };

  const handleDelete = (item) => {
    const newRoles = role
      .split(",")
      .filter((roleItem) => roleItem !== item.value)
      .join(",");
    setRole(newRoles);
  };

  return (
    <CustomModal
      onClose={onClose}
      title={user ? "Редагувати користувача" : "Додати користувача"}
      onSubmit={user ? handleEdit : CreateUser}
      buttonName={user ? "Редагувати" : "Створити"}
    >
      <div className={"dropdown_input_container"}>
        <div
          className={classes.role_container}
          onClick={() => setIsListOpen((prev) => !prev)}
        >
          {role &&
            role.split(",").map((item, index) => (
              <span key={index} className={classes.role_item}>
                {item}
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
                  class="lucide lucide-x-icon lucide-x"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete({ value: item });
                  }}
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </span>
            ))}
        </div>
        <div
          className={"dropdown_list"}
          style={{ display: isListOpen ? "block" : "none" }}
        >
          {roleList.map((arrayElem, index) => {
            return (
              <div
                key={index}
                onClick={() => handleSelect(arrayElem)}
                className={"dropdown_item"}
              >
                {arrayElem.value}
              </div>
            );
          })}
        </div>
      </div>
      <CustomInput
        value={firstname}
        onChange={setFirstname}
        placeholder={"Ім'я"}
      />
      <CustomInput
        value={lastname}
        onChange={setLastname}
        placeholder={"Прізвище"}
      />
      <CustomInput value={email} onChange={setEmail} placeholder={"Пошта"} />
      <CustomInput value={phone} onChange={setPhone} placeholder={"Телефон"} />
      <CustomInput
        value={ref}
        onChange={setRef}
        placeholder={"Реферальне посилання"}
      />
    </CustomModal>
  );
};

export default UserModal;

