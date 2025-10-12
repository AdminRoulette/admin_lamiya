import React from 'react';
import classes from "@/pages/Orders/adminOrder.module.scss";
import {toast} from "react-toastify";
import {checkPhoneForPartPayment} from "@/http/ExternalApi/monoBankAPI";

const OrderPayments = ({setPayments, payments, totalPrice, onChangeMoneyBack, setPartPaymentInfo, partPaymentInfo}) => {

    const onChangePaymentAmount = (type, amount) => {
        if (+amount || amount === "") {
            setPayments(prev => prev.map((p) => {
                if (p.type === type) {
                    return {...p, amount: +amount}
                } else {
                    return p
                }
            }))
        }
    }

    const onClickPaymentType = (type, moneyBack) => {
        if (type === 'combo') {
            setPayments([
                {type: "cash", amount: ""},
                {type: "moneyback", amount: ""},
                {type: "mono", amount: ""},
                {type: "account", amount: ""},
                {type: "marketplace", amount: ""},
            ])
        } else if (type === 'mono_part') {
            setPayments([{type: 'mono_part', amount: totalPrice, count: ""}])
        } else if (type === 'privat_part') {
            setPayments([{type: 'privat_part', amount: totalPrice, count: ""}])
        } else if (type === 'promo') {
            setPayments([{type: 'promo', amount: ""}, {type: 'marketplace', amount: ""}, {type: 'moneyback', amount: ""}])
        } else {
            setPayments([{type: type, amount: totalPrice}])
        }
        onChangeMoneyBack(+moneyBack)
    }

    const PHONE_REGEXP = /^[+38]{3}[0-9]+$/;
    const ValidPhone = (event) => {
        event = event.replaceAll(" ", "").replaceAll("+3838", "+38").replaceAll("+38+38", "+38").replaceAll(" ", "").replaceAll("(", "").replaceAll(")", "").replaceAll("-", "");
        if (event.length < 4) {
            setPartPaymentInfo(prev => ({...prev,phone:"+38"}))
        } else {
            if (event.match(PHONE_REGEXP) && event.length < 14) {
                setPartPaymentInfo(prev => ({...prev,phone:event}))
            } else if (event.length === 10 && ("+38" + event).match(PHONE_REGEXP)) {
                setPartPaymentInfo(prev => ({...prev,phone:"+38" + event}))
            }
        }
    }

    const CheckPhone = async () => {
        setPartPaymentInfo(prev => ({...prev,isPhoneValid:null}))
        if(!partPaymentInfo.phone || !partPaymentInfo.phone.match(/^[+38]{3}[0-9]{10}$/)){
            toast.error("Невірний формат телефону")
            return;
        }
        await checkPhoneForPartPayment({phone:partPaymentInfo.phone,language:true}).then((res) => {
            setPartPaymentInfo(prev => ({...prev,isPhoneValid:res}))
        }).catch((error) => {
            toast.error(error?.response.data.message)
        })
    }

    return (
        <div className={classes.ttn_modal_payment_block}>
            <div>
                <span>Вид оплати</span>
                <div className={classes.ttn_modal_option_list}>
                    <div onClick={() => {
                        onClickPaymentType("marketplace", 0)
                    }}>
                        <input
                            type='radio'
                            checked={payments.length === 1 && payments[0].type === 'marketplace'}
                        />
                        Оплачено на маркетплейсі
                    </div>
                    <div onClick={() => {
                        onClickPaymentType("account", 0)
                    }}>
                        <input
                            type='radio'
                            checked={payments.length === 1 && payments[0].type === 'account'}
                        />
                        На р\р
                    </div>
                    <div onClick={() => {
                        onClickPaymentType("moneyback", totalPrice)
                    }}>
                        <input
                            type='radio'
                            checked={payments.length === 1 && payments[0].type === 'moneyback'}
                        />
                        Післяплата
                    </div>
                    <div onClick={() => {
                        onClickPaymentType("promo", 0)
                    }}>
                        <input
                            type='radio'
                            checked={payments.length > 1 && payments[0].type === 'promo'}
                        />
                        Бонусами на маркетплейсі
                    </div>
                    <div onClick={() => {
                        onClickPaymentType("mono_part", 0)
                    }}>
                        <input
                            type='radio'
                            checked={payments.length === 1 && payments[0].type === 'mono_part'}
                        />
                        Покупка частинами (Моно)
                    </div>
                    <div onClick={() => {
                        onClickPaymentType("privat_part", 0)
                    }}>
                        <input
                            type='radio'
                            checked={payments.length === 1 && payments[0].type === 'privat_part'}
                        />
                        Оплата частинами (Приват)
                    </div>
                    <div onClick={() => {
                        onClickPaymentType("combo", 0)
                    }}>
                        <input
                            type='radio'
                            checked={payments.length > 1 && payments[0].type !== 'promo'}
                        />
                        Комбінована
                    </div>
                </div>
            </div>
            {
                payments.length === 1 && payments[0].type === 'moneyback' ?
                    <div className={classes.ttn_modal_hideBlock}>
                        <div>
                            <span>Сумма післяплати:</span>
                            <input
                                className={totalPrice !== payments.find(payment => payment.type === 'moneyback')?.amount ? classes.ttn_modal_error_moneyBack : ""}
                                value={payments.find(payment => payment.type === 'moneyback')?.amount || ""}
                                onChange={(event) => {
                                    onChangePaymentAmount('moneyback', event.target.value)
                                    onChangeMoneyBack(+event.target.value)
                                }}
                                type='text'
                                placeholder='Введіть суму післяплати'
                            />
                        </div>
                    </div>
                    : payments.length > 1 && payments[0].type === 'promo' ?
                        <div className={classes.ttn_modal_hideBlock}>
                            <div>
                                <input
                                    value={payments.find(payment => payment.type === 'promo')?.amount || ""}
                                    onChange={(event) => onChangePaymentAmount('promo', event.target.value)}
                                    type='text'
                                    placeholder='Сума списаних балів'
                                />
                            </div>
                            <div>
                                <input
                                    value={payments.find(payment => payment.type === 'moneyback')?.amount || ""}
                                    onChange={(event) => {
                                        onChangePaymentAmount('moneyback', event.target.value)
                                        onChangeMoneyBack(+event.target.value)
                                    }}
                                    type='text'
                                    placeholder='Сума післяплати'
                                />
                            </div>
                            <div>
                                <input
                                    value={payments.find(payment => payment.type === 'marketplace')?.amount || ""}
                                    onChange={(event) => onChangePaymentAmount('marketplace', event.target.value)}
                                    type='text'
                                    placeholder="Сума оплат на маркетплейсі"
                                />
                            </div>
                        </div>
                        : payments.length > 1 ? <div className={classes.ttn_modal_hideBlock}>
                            <div>
                                <input
                                    value={payments.find(payment => payment.type === 'moneyback')?.amount || ""}
                                    onChange={(event) => onChangePaymentAmount('moneyback', event.target.value)}
                                    type='text'
                                    placeholder='Сума післяплати'
                                />
                            </div>
                            <div>
                                <input
                                    value={payments.find(payment => payment.type === 'cash')?.amount || ""}
                                    onChange={(event) => onChangePaymentAmount('cash', event.target.value)}
                                    type='text'
                                    placeholder='Сума готівки'
                                />
                            </div>
                            <div>
                                <input
                                    value={payments.find(payment => payment.type === 'mono')?.amount || ""}
                                    onChange={(event) => onChangePaymentAmount('mono', event.target.value)}
                                    type='text'
                                    placeholder='Сума оплати Моно на сайті'
                                />
                            </div>
                            <div>
                                <input
                                    value={payments.find(payment => payment.type === 'account')?.amount || ""}
                                    onChange={(event) => onChangePaymentAmount('account', event.target.value)}
                                    type='text'
                                    placeholder='Сума на р\р'
                                />
                            </div>
                            <div>
                                <input
                                    value={payments.find(payment => payment.type === 'marketplace')?.amount || ""}
                                    onChange={(event) => onChangePaymentAmount('marketplace', event.target.value)}
                                    type='text'
                                    placeholder="Сума оплат на маркетплейсі"
                                />
                            </div>
                        </div> : payments.length === 1 && payments[0].type === 'mono_part' ?
                            <div className={classes.ttn_modal_hideBlock}>
                                <input style={{flex: "0"}} onChange={(e) => {
                                    setPartPaymentInfo(prev => ({...prev, partPaymentAmount: e.target.value}));
                                    setPayments(prev => ([{...prev[0], count: e.target.value}]))

                                }}
                                       value={partPaymentInfo.partPaymentAmount} type='text'
                                       placeholder="Кількість платежів, 3 або 4"/>
                                <input style={{flex: "0"}} value={partPaymentInfo.phone}
                                       id="phoneInput"
                                       formcontrolname="phone"
                                       inputMode="tel"
                                       maxLength="19"
                                       onChange={(event) => ValidPhone(event.target.value)}
                                       type='tel'/>
                                <button className="custom_btn" onClick={CheckPhone}>Перевірити</button>
                                {partPaymentInfo.isPhoneValid !== null &&
                                    <span style={{color: partPaymentInfo.isPhoneValid ? "#009700" : "#da0000"}}>
                                                    {partPaymentInfo.isPhoneValid ? "Телефон підтвержено" : "Вказаний номер телефону не зареєстрований або не встановлений додаток Monobank"}
                                                </span>}
                            </div>
                            : payments.length === 1 && payments[0].type === 'privat_part' ?
                                <div className={classes.ttn_modal_hideBlock}>
                                    <input style={{flex: "0"}} onChange={(e) => {
                                        setPartPaymentInfo(prev => ({...prev, partPaymentAmount: e.target.value}));
                                        setPayments(prev => ([{...prev[0], count: e.target.value}]))
                                    }}
                                           value={partPaymentInfo.partPaymentAmount} type='text'
                                           placeholder="Кількість платежів 2,3 або 4"/>
                                    <input style={{flex: "0"}} value={partPaymentInfo.phone}
                                           id="phoneInput"
                                           formcontrolname="phone"
                                           inputMode="tel"
                                           maxLength="19"
                                           onChange={(event) => ValidPhone(event.target.value)}
                                           type='tel'/>
                                </div> : <></>
            }
        </div>
    );
};

export default OrderPayments;