import React from 'react';
import classes from "../../../adminOrder.module.scss";
import {toast} from "react-toastify";
import {checkPhoneForPartPayment} from "@/http/ExternalApi/monoBankAPI";
import OrderPayments from "@/pages/Orders/modals/CompleteOrder/TTNComponents/OrderPayments";

const  MinorTTNOption = ({
                            orderData, setOrderData, deliveryData,
                            totalPrice, setPayments, payments, setDeliveryData,
                             setPartPaymentInfo,partPaymentInfo
                        }) => {


    const NUMBER_REGEXP = /^[0-9]+$/;
    const onChangeMoneyBack = (value) => {
            setDeliveryData(prev => ({...prev, moneyBack: value}))
    }
    const onChangeMoneyLose = (value) => {
        if (value.match(NUMBER_REGEXP) || value.length === "") {
            setOrderData(prev => ({...prev, moneyLose: value}))
        }
    }

    const onChangePromoCode = (value) => {
        setOrderData(prev => ({...prev, promoCode: value}))
    }

    return (
        <div className='ttn-modal_block'>
            <div className={classes.ttn_modal_option_cont}>
                <div className={classes.ttn_modal_delivery_block}>
                    <span>Хто сплачує доставку:</span>
                    <div className={classes.ttn_modal_delivery_payment}>
                        <div onClick={() => setDeliveryData(prev => ({...prev, deliveryPay: "recipient"}))}>
                            <input
                                type="radio"
                                checked={deliveryData.deliveryPay === 'recipient'}
                            />
                            Одержувач
                        </div>
                        <div onClick={() => setDeliveryData(prev => ({...prev, deliveryPay: "sender"}))}>
                            <input
                                type="radio"
                                checked={deliveryData.deliveryPay === 'sender'}
                            />
                            Відправник
                        </div>
                    </div>
                    {(totalPrice > 799 && deliveryData.deliveryPay === "recipient") ?
                        <div
                            style={{WebkitTextFillColor: "red"}}>{'Безкоштовна доставка, бо сумма > 799?'}</div> : <></>}
                </div>
                <OrderPayments setPayments={setPayments} payments={payments} totalPrice={totalPrice} onChangeMoneyBack={onChangeMoneyBack}
                               setPartPaymentInfo={setPartPaymentInfo} partPaymentInfo={partPaymentInfo}/>

            </div>
            <div className={classes.ttn_modal_option_cont}>
                <div className={classes.ttn_modal_option_block}>
                    <span>Сума затрат або акцій:</span>
                    <div className={classes.ttn_modal_sale_block}>
                        <input
                            value={orderData.moneyLose}
                            onChange={(event) => onChangeMoneyLose(event.target.value)}
                            type='text'
                            placeholder='Сума затрат або акцій'
                        />
                    </div>
                </div>
                <div className={classes.ttn_modal_option_block}>
                    <span>Промокод:</span>
                    <div className={classes.ttn_modal_promo}>
                        <input
                            value={orderData.promoCode}
                            onChange={(event) => onChangePromoCode(event.target.value)}
                            type='text'
                            placeholder='Промокод'
                        />
                        <button className="second_btn">Застосувати</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MinorTTNOption;
