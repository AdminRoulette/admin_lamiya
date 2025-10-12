import React, {useContext, useState} from 'react';
import classes from "../../../adminOrder.module.scss";
import {toast} from "react-toastify";
import {CompleteOrder, CompleteRealOrder, WaitOrderInShop} from "@/http/Order/ordersApi";
import GenerateOnTabOption from "@/pages/Product/modals/components/GenerateOnTabOption";
import {checkPhoneForPartPayment} from "@/http/ExternalApi/monoBankAPI";
import {Context} from "@/index";

const RealOrderBlock = ({setOrders, onHide, OrderElem, WSConnection}) => {
    const {user,shift} = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState("+380");
    const [amountPaid, setAmountPaid] = useState("");
    const [partPaymentAmount, setPartPaymentAmount] = useState("");
    const [isPhoneValid, setIsPhoneValid] = useState(null);
    const [payments, setPayments] = useState([{type: 'cash', amount: OrderElem.totalPrice}]);

    const checkOrderData = async () => {
        if (!shift.Shift?.open) throw new Error("Зміна закрита")
        if (!payments.every(p => p.type && +p.amount)) throw new Error("Немає потрібної суми")
        if (payments.length > 1) {
            if (OrderElem.totalPrice !== payments.reduce((sum, p) => sum + (+p.amount || 0), 0)) throw new Error("Сума замовлення не співпадає з вказанною")
        } else {
            if (payments[0].type === 'mono_part') {
                if (!isPhoneValid) {
                    throw new Error("Перевірте чи підходить номер телефону")
                }
                if (!(partPaymentAmount === "3" || partPaymentAmount === "4" || partPaymentAmount === "6")) {
                    throw new Error("Кількість платежів 3 або 4")
                }
                if(phone.length !== 13){
                    throw new Error("Вкажіть вірний номер телефону")
                }
            }
            if (payments[0].type === 'privat_part') {
                if (!(partPaymentAmount === "2" || partPaymentAmount === "3"|| partPaymentAmount === "4")) {
                    throw new Error("Кількість платежів 2,3 або 4")
                }
                if(phone.length !== 13){
                    throw new Error("Вкажіть вірний номер телефону")
                }
                if(OrderElem.totalPrice < 301){
                    throw new Error("Оплату частинами можна оформити лише на суму від 300 грн")
                }
            }
            if (payments[0].type === 'cash' && OrderElem.totalPrice > +payments[0].amount) throw new Error("Сума готівки менша за суму замовлення")
        }
    };

    const RealOrder = async () => {
        setLoading(true)
        try {
            await checkOrderData();
            await CompleteRealOrder({
                postMethod: 'store',
                orderId: OrderElem.id,
                moneyLose: 0,
                promoCode: "",
                partPaymentAmount: payments[0].type === 'mono_part' || payments[0].type === 'privat_part' ? +partPaymentAmount : undefined,
                finance_phone: phone.length === 13 && (payments[0].type === 'mono_part' || payments[0].type === 'privat_part') ? phone : undefined,
                payments,
                amountPaid
            }).then(async (res) => {
                setOrders(order => order.map((OrderElement) => {
                    if (OrderElement.id === OrderElem.id) {
                        return {
                            ...OrderElement, ...res
                        }
                    } else {
                        return {...OrderElement}
                    }
                }))
                if (payments[0].type === 'mono_part' || payments[0].type === 'privat_part') {
                    WSConnection({status: res.status, id: OrderElem.id})
                }
                toast(`Продаж за самовивозом створено`);
                onHide();
            }).catch((error) => {
                toast.error(error.response.data.message);
            }).finally(() => {
                setLoading(false)
            })
        } catch (error) {
            setLoading(false)
            toast(error.message);
        }
    }

    const ChangePaymentType = (type) => {
        let array = [];
        setIsPhoneValid(null)
        setPhone("+380")
        setAmountPaid("")
        if (type === 'cash') {
            array.push({type: 'cash', amount: OrderElem.totalPrice})
        } else if (type === 'terminal') {
            array.push({type: 'terminal', amount: OrderElem.totalPrice})
        } else if (type === 'account') {
            array.push({type: 'account', amount: OrderElem.totalPrice})
        } else if (type === 'combo') {
            array.push({type: 'cash', amount: ""})
            array.push({type: 'terminal', amount: ""})
        } else if (type === 'mono_part') {
            setPartPaymentAmount("")
            setIsPhoneValid(null)
            array.push({type: 'mono_part', amount: OrderElem.totalPrice, count: ""})
        } else if (type === 'privat_part') {
            setPartPaymentAmount("")
            setIsPhoneValid(null)
            array.push({type: 'privat_part', amount: OrderElem.totalPrice, count: ""})
        }
        setPayments(array)
    }

    const OnChangePayment = (field, value) => {
        if (+value || value === '') {
            if (field === 'paid') {
                setAmountPaid(value)
            } else {
                setPayments(prev => prev.map((payment) => {
                    if (payment.type === field) {
                        return {type: field, amount: value};
                    } else {
                        return payment
                    }
                }))
            }

        }
    }
    const PHONE_REGEXP = /^[+38]{3}[0-9]+$/;
    const ValidPhone = (event) => {
        event = event.replaceAll(" ", "").replaceAll("+3838", "+38").replaceAll("+38+38", "+38").replaceAll(" ", "").replaceAll("(", "").replaceAll(")", "").replaceAll("-", "");
        if (event.length < 4) {
            setPhone("+38")
        } else {
            if (event.match(PHONE_REGEXP) && event.length < 14) {
                setPhone(event)
            } else if (event.length === 10 && ("+38" + event).match(PHONE_REGEXP)) {
                setPhone("+38" + event)
            }
        }
    }

    const CheckPhone = async () => {
        setIsPhoneValid(null)
        if (!phone || !phone.match(/^[+38]{3}[0-9]{10}$/)) {
            toast.error("Невірний формат телефону")
            return;
        }
        await checkPhoneForPartPayment({phone, language: true}).then((res) => {
            setIsPhoneValid(res)
        }).catch((error) => {
            toast.error(error?.response.data.message)
        })
    }

    return (
        <div className="modal_main">
            <div onClick={() => onHide()} className="modal_bg"/>
            <div className={'modal_container' + " " + classes.real_order_modal_body}>
                <div className="modal_header">
                    <div>Замовлення з магазині</div>
                    <svg onClick={() => onHide()} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className="modal_body">
                    <div className={classes.real_order_container}>
                        <div className={classes.real_order}>
                            <div className={classes.real_order_ratio_block}>
                                <div onClick={() => {
                                    ChangePaymentType("cash")
                                }}>
                                    <input
                                        type='radio'
                                        checked={payments[0].type === 'cash' && payments.length === 1}
                                    />
                                    Готівка
                                </div>
                                <div onClick={() => {
                                    ChangePaymentType("terminal")
                                }}>
                                    <input
                                        type='radio'
                                        checked={payments[0].type === 'terminal' && payments.length === 1}
                                    />
                                    Термінал
                                </div>
                                {user.user.role?.includes("ADMIN") && <div onClick={() => {
                                    ChangePaymentType("account")
                                }}>
                                    <input
                                        type='radio'
                                        checked={payments[0].type === 'account' && payments.length === 1}
                                    />
                                    На р\р
                                </div>}
                                <div onClick={() => {
                                    ChangePaymentType("combo")
                                }}>
                                    <input
                                        type='radio'
                                        checked={payments.length > 1}
                                    />
                                    Комбінована
                                </div>
                                <div onClick={() => {
                                    ChangePaymentType("mono_part")
                                }}>
                                    <input
                                        type='radio'
                                        checked={payments[0].type === 'mono_part'}
                                    />
                                    Покупка частинами (Моно)
                                </div>
                                <div onClick={() => {
                                    ChangePaymentType("privat_part")
                                }}>
                                    <input
                                        type='radio'
                                        checked={payments[0].type === 'privat_part'}
                                    />
                                    Оплата частинами (Приват)
                                </div>
                            </div>
                            <div>
                                {payments[0].type === 'cash' && payments.length === 1
                                    ? <input onChange={(e) => OnChangePayment('paid', e.target.value)}
                                             value={amountPaid} type='text'
                                             placeholder="Отримано готівки, грн"/>
                                    : payments.length > 1
                                        ? <div className={classes.real_order_payment_inputs}>
                                            <input onChange={(e) => OnChangePayment('cash', e.target.value)}
                                                   value={payments[0].amount}
                                                   type='text' placeholder="Отримано готівки, грн"/>
                                            <input onChange={(e) => OnChangePayment('terminal', e.target.value)}
                                                   value={payments[1].amount} type='text'
                                                   placeholder="Оплачено терміналом, грн"/>
                                        </div>
                                        : payments[0].type === 'mono_part'
                                            ?
                                            <div className={classes.real_order_payment_inputs}>
                                                <input onChange={(e) => {
                                                    setPartPaymentAmount(e.target.value);
                                                    setPayments(prev => ([{...prev[0], count: e.target.value}]))
                                                }}
                                                       value={partPaymentAmount} type='text'
                                                       placeholder="Кількість платежів, 3 або 4"/>
                                                <input value={phone}
                                                       id="phoneInput"
                                                       formcontrolname="phone"
                                                       inputMode="tel"
                                                       maxLength="19"
                                                       onChange={(event) => ValidPhone(event.target.value)}
                                                       type='tel'/>
                                                <button className="custom_btn" onClick={CheckPhone}>Перевірити</button>
                                                {isPhoneValid !== null &&
                                                    <span style={{color: isPhoneValid ? "#009700" : "#da0000"}}>
                                                    {isPhoneValid ? "Телефон підтвержено" : "Вказаний номер телефону не зареєстрований або не встановлений додаток Monobank"}
                                                </span>}
                                            </div>
                                            : payments[0].type === 'privat_part' ?
                                                <div className={classes.real_order_payment_inputs}>
                                                    <input onChange={(e) => {
                                                        setPartPaymentAmount(e.target.value);
                                                        setPayments(prev => ([{...prev[0], count: e.target.value}]))
                                                    }}
                                                           value={partPaymentAmount} type='text'
                                                           placeholder="Кількість платежів, 2,3 або 4"/>
                                                    <input value={phone}
                                                           id="phoneInput"
                                                           formcontrolname="phone"
                                                           inputMode="tel"
                                                           maxLength="19"
                                                           onChange={(event) => ValidPhone(event.target.value)}
                                                           type='tel'/>
                                                </div>
                                                : <></>}

                            </div>
                        </div>
                        <div className={classes.real_order_btns}>
                            <button disabled={loading} className="custom_btn" onClick={RealOrder}>Підтвердити</button>
                            <button className="second_btn" onClick={onHide}>Закрити</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealOrderBlock;
