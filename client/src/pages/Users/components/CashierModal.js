import { CustomDropdown } from "@/components/CustomElements/CustomDropdown";
import { CustomInput } from "@/components/CustomElements/CustomInput";
import { CustomModal } from "@/components/CustomElements/CustomModal";
import classes from "../users.module.scss";
import {
  allUsers,
  changeCashier,
  changeUserData,
  createCashier,
  createUser,
  deleteCashier,
} from "@/http/userApi";
import React, { useEffect } from "react";
import { getAllStores } from "@/http/storeAPI";
import { getFopsList } from "@/http/financeApi";
import { createCashierBearer } from "@/http/ExternalApi/checkBoxAPI";
import { toast } from "react-toastify";

const CashierModal = ({ onClose, cashier, setCashiers, modalType }) => {
  const [shopId, setShopId] = React.useState(cashier?.shop_id || "");
  const [fopId, setFopId] = React.useState(cashier?.fop_id || "");
  const [userId, setUserId] = React.useState(cashier?.userId || "");
  const [cashiersList, setCashiersList] = React.useState([]);
  const [shopList, setShopList] = React.useState([]);
  const [fopList, setFopList] = React.useState([]);
  const [pin, setPin] = React.useState("");

  useEffect(() => {
    allUsers({ offset: 0, phone: "", role: "SELLER" }).then((response) => {
      setCashiersList(response.rows);
    });
  }, []);

  useEffect(() => {
    getAllStores().then((response) => {
      setShopList(response);
    });
  }, []);

  useEffect(() => {
    getFopsList().then((response) => {
      setFopList(response);
    });
  }, []);

  const handleEdit = async () => {
    await changeCashier({
      id: cashier.id,
      fop_id: fopId,
      shop_id: shopId,
    }).then((res) => {
      const fopName = fopList.find((f) => f.id === fopId)?.name || "";
      const shopName = shopList.find((s) => s.id === shopId)?.address || "";

      setCashiers((prev) =>
        prev.map((c) =>
          c.id === cashier.id
            ? {
                ...c,
                ...res,
                fops_list: { name: fopName },
                shop: { address: shopName },
              }
            : c
        )
      );

      onClose();
    });
  };

  const CreateCashier = async () => {
    await createCashier({
      userId,
      fop_id: fopId,
      shop_id: shopId,
    })
      .then((res) => {
        const fopName = fopList.find((f) => f.id === fopId)?.name || "";
        const shopName = shopList.find((s) => s.id === shopId)?.address || "";
        const firstname = cashiersList.find((c) => c.id === userId)?.firstname;
        const lastname = cashiersList.find((c) => c.id === userId)?.lastname;
        setCashiers((prev) => [
          {
            ...res,
            fops_list: { name: fopName },
            shop: { address: shopName },
            user: { firstname, lastname },
          },
          ...prev,
        ]);
        onClose();
      })
      .catch((error) => {
        toast(error.response?.data?.message || "Error creating cashier");
      });
  };

  const addBearer = async () => {
    await createCashierBearer({
      id: cashier.id,
      pinCode: pin,
    }).then(() => {
      setCashiers((prev) =>
        prev.map((c) => (c.id === cashier.id ? { ...c, bearer: "bearer" } : c))
      );
      onClose();
      toast("Бірер успішно створений");
    });
  };

  const handleDelete = async () => {
    await deleteCashier({ id: cashier.id }).then(() => {
      setCashiers((prev) => prev.filter((c) => c.id !== cashier.id));
      onClose();
      toast("Касир успішно видалений");
    });
  };

  const getSubmitHandler = () => {
    if (modalType === "bearer") return addBearer;
    if (modalType === "delete") return handleDelete;
    if (cashier) return handleEdit;
    return CreateCashier;
  };

  const getButtonName = () => {
    if (modalType === "bearer") return "Створити бірер";
    if (modalType === "delete") return "Видалити";
    if (cashier) return "Редагувати";
    return "Створити";
  };

  const getTitle = () => {
    if (modalType === "bearer") return "Створити бірер";
    if (modalType === "delete") return "Видалити касира";
    if (cashier) return "Редагувати касира";
    return "Додати касира";
  };

  return (
    <CustomModal
      onClose={onClose}
      title={getTitle()}
      onSubmit={getSubmitHandler()}
      buttonName={getButtonName()}
    >
      {modalType !== "bearer" && modalType !== "delete" && (
        <CustomDropdown
          array={shopList}
          dropdownAction={(item) => setShopId(item?.id)}
          field="address"
          externalValue={shopList.find((s) => s.id === shopId)?.address || ""}
          placeholder="Магазин"
        />
      )}
      {modalType !== "bearer" && modalType !== "delete" && (
        <CustomDropdown
          array={fopList}
          dropdownAction={(item) => setFopId(item?.id)}
          externalValue={fopList.find((f) => f.id === fopId)?.name || ""}
          placeholder="ФОП"
        />
      )}
      {!cashier && (
        <CustomDropdown
          array={cashiersList}
          dropdownAction={(item) => setUserId(item?.id)}
          field="fullname"
          placeholder="Касир"
        />
      )}
      {modalType === "bearer" && (
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Введіть пін код"
          type="password"
        />
      )}
    </CustomModal>
  );
};

export default CashierModal;
