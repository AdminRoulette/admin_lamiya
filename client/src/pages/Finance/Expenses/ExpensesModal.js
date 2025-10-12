import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import classes from "../Finance.module.scss";
import {addExpense, updateExpenses} from "@/http/financeApi";
import {CustomModal} from "@/components/CustomElements/CustomModal";
import {CustomInput} from "@/components/CustomElements/CustomInput";
import {CustomDropdown} from "@/components/CustomElements/CustomDropdown";
import {getAllStores} from "@/http/storeAPI";

const ExpensesModal = ({onHide, setExpensesList, editData}) => {
    const [name, setName] = useState(editData?.name || '');
    const [money, setMoney] = useState(editData?.money || "");
    const [expensesType, setExpensesType] = useState(editData?.type || "");
    const [addToCollection, setAddToCollection] = useState(false);
    const [expensesEditData, setExpensesEditData] = useState(null);
    const [shopId, setShopId] = useState(null);
    const [shopList, setShopList] = useState([]);
    const typeArray = [{name: 'Маркетплейси'}, {name: 'Податки'}, {name: 'Оренда'}, {name: 'Пакування'}, {name: 'Реклама'}, {name: 'Зарплата'}, {name: 'Інші'}]

    useEffect(() => {
        if (!addToCollection) setShopId(null);
        if (shopList.length === 0 && addToCollection) {
            getAllStores().then(data => {
                setShopList(data)
            }).catch(error => {
                toast.error(error.response.data.message);
            })
        }
    }, [addToCollection]);

    const createExpenses = async () => {
        if (expensesType === "Оберіть тип" || !money || !name) {
            toast.error(`Заповніть тип, суму та назву витрати`);
        }

        if (editData) {
            await updateExpenses({
                id: editData.id,
                type: expensesType,
                name: name,
                money: +money
            }).then(() => {
                setExpensesList(prev =>
                    prev.map((expenses) => {
                        if (expenses.id === editData.id) {
                            return {...expenses, name, money, expensesType}
                        } else {
                            return expenses;
                        }
                    })
                )
                onHide();
            }).catch(error => {
                toast(error.message)
            })

        } else {
            await addExpense({
                type: expensesType,
                name: name,
                money: +money,
                shopId
            }).then(SupplyElem => {
                setExpensesList(prev => ([SupplyElem, ...prev]))
                onHide();
            }).catch(error => {
                toast(error.message)
            })
        }

    }


    return (
        <CustomModal
            title={`${expensesEditData ? "Редагувати" : "Створити"} витрату`}
            onClose={onHide}
            onSubmit={expensesEditData ? edit : createExpenses}
            buttonName={`${expensesEditData ? "Редагувати" : "Додати"}`}
            width={400}
        >
            <>
                <CustomDropdown
                    array={typeArray}
                    placeholder={"Оберіть тип"}
                    dropdownAction={(item) => {
                        setExpensesType(item?.name)
                    }}
                    externalValue={
                        typeArray.find((item) => item.name === expensesType)?.name
                    }
                />
                <CustomInput
                    value={name}
                    onChange={setName}
                    placeholder={"Назва витрати"}
                />
                <CustomInput
                    value={money}
                    onChange={(value) => setMoney(+value > 0 ? value : "")}
                    placeholder={"Сума оплати"}
                />
                {!editData && <>
                    <div className={classes.expenses_check}>
                    <span>
                        Додати в інкасацію?
                    </span>
                        <input type="checkbox" checked={addToCollection}
                               onChange={(e) => setAddToCollection(e.target.checked)}/>
                    </div>
                    {addToCollection && <CustomDropdown
                        array={shopList}
                        placeholder={"Оберіть магазин"}
                        dropdownAction={(item) => {
                            setShopId(item?.id)
                        }}
                        field="address"
                    />}
                </>}
            </>
        </CustomModal>
    );
};

export default ExpensesModal;