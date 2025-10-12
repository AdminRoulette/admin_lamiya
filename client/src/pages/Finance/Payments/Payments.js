import React, {useEffect, useState} from 'react';
import classes from "../Finance.module.scss"
import {toast} from "react-toastify";
import {getFopPayments, getFopsList} from "@/http/financeApi";

const Payments = ({PageParam}) => {
    const [fop, setFop] = useState(null);
    const [fopsList, setFopsList] = useState([]);
    const [paymentList, setPaymentList] = useState({});

    useEffect(() => {
        getFopsList().then((data) => {
            setFopsList(data);
        }).catch(error => {
            toast(error.message)
        });
        document.title = "Оплати на р/р"
    }, []);

    useEffect(() => {
        if (fop) {
            getFopPayments({id: fop.id}).then((data) => {
                setPaymentList(data);
            }).catch(error => {
                toast(error.message)
            });
        }
    }, [fop]);

    return (
        <div className={classes.payments_container}>
            <div className="custom-select">
                <select value={fop?.id || "Оберіть фоп"}
                        onChange={(e) => {
                            const selected = fopsList.find(f => f.id === parseInt(e.target.value));
                            setFop(selected);
                        }}
                >
                    <option disabled value="Оберіть фоп">Оберіть фоп</option>
                    {fopsList.map(fop => {
                        return <option value={fop.id}>{fop.name}</option>
                    })}
                </select>
            </div>
            <div className={classes.payments_balance}>Баланс: {paymentList[1]} грн</div>
            <ul  className={classes.payments_list_block}>
            {paymentList[0]?.map((payment) => {
                let time = new Date(payment.time * 1000)
                return (
                    <li>
                        <div>{time.toLocaleDateString()} {time.getHours()}:{time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`}</div>
                        <b>{payment.amount} грн</b>
                        <div>{payment.counterName}</div>
                        <div>{payment.comment}</div>
                    </li>
                )
            })}
            </ul>
        </div>
    );
};

export default Payments;