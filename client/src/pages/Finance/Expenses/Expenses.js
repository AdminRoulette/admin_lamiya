import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import classes from "@/pages/Finance/Finance.module.scss";
import ExpensesModal from "@/pages/Finance/Expenses/ExpensesModal";
import {getExpenses} from "@/http/financeApi";

const Expenses = () => {
    const [expensesList, setExpensesList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const now = new Date();

    useEffect(() => {
        document.title = "Витрати"
        getExpenses(offset).then((data) => {
            setExpensesList(prev => [...prev,...data]);
        }).catch(error => {
            toast(error.message)
        });
    }, [offset]);

    return (
        <div>
            <button className={"custom_btn"}
                    onClick={() => {
                        setIsOpenModal(true);
                    }}>Додати витрату
            </button>

            <div className={classes.expenses_block}>
                <h2>Список витрат</h2>
                {expensesList.map((expenseElem) => {
                    const createdAt = new Date(expenseElem.createdAt);
                    const hoursPassed = (now - createdAt) / (1000 * 60 * 60);
                    return (
                        <>
                            <div className={classes.expenses_element} key={expenseElem.id}>
                                <div className={classes.expenses_element_block}>
                                    <div>{new Date(expenseElem.createdAt).toLocaleDateString()}</div>
                                    <div>Сума: <b>{expenseElem.money} грн</b></div>
                                    <div><b>Тип витрати:</b> {expenseElem.type}</div>
                                    <div><b>Коментар:</b> {expenseElem.name}</div>
                                </div>
                                {hoursPassed < 4 &&<span onClick={() => {
                                    setEditData(expenseElem)
                                    setIsOpenModal(true);
                                }} className="material-symbols-outlined">edit</span>}
                            </div>
                        </>
                    )
                })
                }
            </div>
            {isOpenModal && <ExpensesModal
                onHide={() => {setEditData(null);setIsOpenModal(false)}}
                editData={editData}
                setExpensesList={setExpensesList}
            />}
            <button className="second_btn_btn"
                    onClick={() => {setOffset(prev => prev + 1)}}>Завантажити ще
            </button>
        </div>
    );
};

export default Expenses;