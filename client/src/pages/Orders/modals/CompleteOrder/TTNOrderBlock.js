import React, {useEffect, useState} from 'react';
import {CompleteOrder, OrderWithOutPRRO} from "@/http/Order/ordersApi";
import {toast} from "react-toastify";
import classes from "@/pages/Orders/adminOrder.module.scss";
import DeliveryData from "@/pages/Orders/modals/CompleteOrder/TTNComponents/Delivery/DeliveryData";
import UserData from "@/pages/Orders/modals/CompleteOrder/TTNComponents/UserData";
import MinorTTNOption from "@/pages/Orders/modals/CompleteOrder/TTNComponents/MinorTTNOption";
import {getFopsList} from "@/http/financeApi";
import {NP_WAREHOUSE, PAY_MONO_PART, PAY_PRIVAT_PART} from "@/utils/constants";

const TTNOrderBlock = ({OrderElem, setOrders, onHide, WSConnection}) => {
    const sourceArray = [{name: "Розетка", value: 'rozetka'}, {
        name: "Пром", value: 'prom'
    }, {name: "Каста", value: 'kasta'}, {
        name: "Інстаграм", value: 'inst'
    }, {name: "ТікТок", value: 'tiktok'}, {
        name: "Вайбер", value: 'viber'
    }, {name: "Телеграм", value: 'telegram'}, {
        name: "Епіцентр", value: 'epicenter'
    }];
    const [partPaymentInfo, setPartPaymentInfo] = useState({
        partPaymentAmount: "",
        phone: "+380",
        isPhoneValid: null
    });
    const [fopsList, setFopsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        firstName: OrderElem.deliveryData?.firstName || "",
        lastName: OrderElem.deliveryData?.lastName || "",
        mobile: OrderElem.deliveryData?.mobile || "+38",
    });
    const [deliveryData, setDeliveryData] = useState({
        postMethod: OrderElem.postMethod || NP_WAREHOUSE,
        deliveryPay: OrderElem.deliveryData?.deliveryPay || "recipient",
        ttn: "",
        cityRef: OrderElem.deliveryData?.cityRef || 0,
        warehouseRef: OrderElem.deliveryData?.warehouseRef || "",
        moneyBack: OrderElem.deliveryData?.moneyBack || 0,
        streetRef: OrderElem.deliveryData?.streetRef || "",
        house: "",
        apartment: ""
    });
    const [orderData, setOrderData] = useState({
        source: OrderElem.source || "",
        moneyLose: OrderElem.deliveryData?.moneyLose || 0,
        promoCode: OrderElem.promo || "",
        fop_id: OrderElem.fop_id || null
    });
    const [payments, setPayments] = useState(OrderElem.paymentMethods || [{
        type: 'card', amount: OrderElem.totalPrice
    }]);
    useEffect(() => {
        getFopsList().then(async (list) => {
            setFopsList(list)
        }).catch((error) => {
            toast.error(error.response.data.message);
        })
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleModalClick);
        return () => {
            document.removeEventListener('click', handleModalClick);
        };
    }, []);

    const handleModalClick = (event) => {
        event.stopPropagation();
    };

    const CreateOrderWithOutPRRO = async () => {
        setLoading(true)
        await OrderWithOutPRRO({
            orderId: OrderElem.id, moneyLose: orderData.moneyLose
        }).then(async (obj) => {
            setOrders(order => order.map((OrderElement) => {
                if (OrderElement.id === OrderElem.id) {
                    return {
                        ...OrderElement, ...obj
                    }
                } else {
                    return {...OrderElement}
                }
            }))
            toast(`Продаж без рро створено`);
            onHide();
        }).catch((error) => {
            throw new Error(error.response.data.message);
        }).finally(() => {
            setLoading(false)
        })
    }

    const checkOrderData = async () => {
        if (payments.length === 1) {
            if (payments[0].type === 'moneyback' && !deliveryData.moneyBack) throw new Error(`Післяплата без суми`)
            if (payments[0].type === 'promo' && !payments[0].amount) throw new Error(`Немає суми балів`)
            if (payments[0].type === 'mono_part') {
                if (!partPaymentInfo.partPaymentAmount) {
                    throw new Error(`Не вказана кількість оплат частинами`)
                }
                if (!partPaymentInfo.phone) {
                    throw new Error(`Не вказаний номер для оплат частинами`)
                }
                if (!partPaymentInfo.isPhoneValid) {
                    throw new Error(`Не підтвердили номер для оплат частинами`)
                }
            }
            if (payments[0].type === 'privat_part') {
                if (!partPaymentInfo.partPaymentAmount) {
                    throw new Error(`Не вказана кількість оплат частинами`)
                }
                if (partPaymentInfo.phone.length !== 13) {
                    throw new Error(`Не вірний номер телефону`)
                }
            }
        } else {
            const paymentsWithAmount = payments.filter(payment => payment.amount);
            if (OrderElem.totalPrice !== payments.reduce((sum, p) => sum + (+p.amount || 0), 0)) throw new Error(`Сума замовлення не відповідає вказаним оплатам`)
            if (paymentsWithAmount.length < 2) throw new Error(`В комбінованому режимі заповнено менше 2 значень`)
        }
        if (!orderData.fop_id) throw new Error(`ФОП не вибрана`)
        if (!orderData.source) throw new Error(`Оберіть джерело замовлення`)
        if (deliveryData.postMethod === "np" && !deliveryData.warehouseRef && !deliveryData.cityRef) throw new Error(`Відділення нової пошти не вибране`)
        if (payments[0].type === 'moneyback' && payments[0].amount !== OrderElem.totalPrice) throw new Error(`Сума наложки не співпадає з сумою замовлення`)
        if ((deliveryData.postMethod === "ukr" || deliveryData.postMethod === 'ukr_standart') && !deliveryData.warehouseRef && !deliveryData.cityRef) throw new Error(`Відділення укр пошти не вибране`)
        if (userData.firstName.length < 2) throw new Error(`Ім'я не вказане`)
        if (userData.lastName.length < 2) throw new Error(`Призвіще не вказане`)
        if (userData.mobile.length !== 13) throw new Error(`Мобільний не вказаний керректно`);
        if (deliveryData.ttn && !(deliveryData.ttn.length === 13 || deliveryData.ttn.length === 14)) throw new Error(`Маркетплейс ТТН не коректний`)
        if (orderData.source === 'kasta' && !deliveryData.ttn && deliveryData.postMethod.startsWith("np")) throw new Error(`Замовлення Каста на НП і без ттн!!`)
    }

    async function CreateOrder() {
        try {
            await checkOrderData();
            setLoading(true)
            await CompleteOrder({
                postMethod: deliveryData.postMethod,
                orderId: OrderElem.id,
                moneyLose: orderData.moneyLose,
                fop_id: orderData.fop_id,
                promoCode: orderData.promoCode,
                payments: payments.filter(payment => payment.amount),
                source: orderData.source,
                firstName: userData.firstName,
                lastName: userData.lastName,
                mobile: userData.mobile,
                cityRef: deliveryData.cityRef,
                warehouseRef: deliveryData.warehouseRef,
                deliveryPay: deliveryData.deliveryPay,
                moneyBack: deliveryData.moneyBack ? +deliveryData.moneyBack : 0,
                ttn: deliveryData.ttn,
                streetRef: deliveryData.streetRef,
                house: deliveryData.house,
                apartment: deliveryData.apartment,
                ...(
                    payments[0].type === PAY_MONO_PART || payments[0].type === PAY_PRIVAT_PART
                        ? {
                            partPaymentAmount: partPaymentInfo.partPaymentAmount,
                            partPaymentPhone: partPaymentInfo.phone
                        }
                        : {}
                ),
            }).then(async (obj) => {
                if (payments[0].type === PAY_MONO_PART || payments[0].type === PAY_PRIVAT_PART) {
                    WSConnection({id: OrderElem.id})
                }
                setOrders(order => order.map((OrderElement) => {
                    if (OrderElement.id === OrderElem.id) {
                        return {
                            ...OrderElement, ...obj
                        }
                    } else {
                        return {...OrderElement}
                    }
                }))
                toast(`Замовлення з ТТН створено`);
                onHide();
            }).catch(error => {
                toast(error.response?.data?.message)
            }).finally(() => {
                setLoading(false)
            })
        } catch (error) {
            toast.error(error.message);
            setLoading(false)
        }
    }

    const TTNOnChange = (value) => {
        if (Number(value) || value.length === 0) {
            setDeliveryData(prev => ({...prev, ttn: value}))
        }
    };

    function changeDeliveryData(obj) {
        setDeliveryData(prev => ({...prev, ...obj}));
    }

    return (<div className="modal_main">
        <div onClick={() => onHide()} className="modal_bg"/>
        <div className={'modal_container' + " " + classes.real_order_modal_body}>
            <div className="modal_header">
                <div>Створити ТТН</div>
                <svg onClick={() => onHide()} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none"
                     stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                </svg>
            </div>
            <div className="modal_body">
                <div>
                    <div className={classes.ttn_modal_block + ' ' + classes.ttn_modal_ratio_poshta}>
                        <div>
                            <div className={classes.product_input_drop}>
                                <div style={{width: "100%"}}>
                                    <input placeholder='Джерело замовлення'
                                           value={sourceArray.find(item => item.value === orderData.source)?.name || ""}
                                           type="text"
                                           maxLength={254}/>
                                    <div className={classes.product_drop_down}>
                                        {sourceArray.map((source) => {
                                            return (<div key={orderData.source.value}
                                                         onClick={() => setOrderData(prev => ({
                                                             ...prev, source: source.value, fop_id: source.value === 'prom' || source.value === 'rozetka' ? 2 : 1
                                                         }))}
                                                         className={classes.product_dropDown_item}>{source.name}</div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className={classes.product_input_drop}>
                                <div style={{width: "100%"}}>
                                    <input placeholder='ФОП'
                                           value={fopsList.find(item => item.id === orderData.fop_id)?.name || ""}
                                           type="text"
                                           maxLength={254}/>
                                    <div className={classes.product_drop_down}>
                                        {fopsList.map((fop) => {
                                            return (<div key={fop.id}
                                                         onClick={() => setOrderData(prev => ({
                                                             ...prev, fop_id: fop.id
                                                         }))}
                                                         className={classes.product_dropDown_item}>{fop.name}</div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{width: "auto", margin: "0"}} className={classes.ttn_modal_input_cont}>
                            <input value={deliveryData.ttn}
                                   maxLength="40"
                                   placeholder='Маркетплейс ТТН'
                                   onChange={(event) => TTNOnChange(event.target.value)}
                                   type='text'/>
                        </div>
                    </div>
                    <UserData userData={userData} setUserData={setUserData} source={orderData.source}/>

                    <DeliveryData language={false}
                                  changeDeliveryData={changeDeliveryData}
                                  deliveryData={deliveryData}
                                  totalPrice={OrderElem.totalPrice}
                                  />

                    <MinorTTNOption orderData={orderData} setOrderData={setOrderData} payments={payments}
                                    deliveryData={deliveryData}
                                    setPayments={setPayments} totalPrice={OrderElem.totalPrice}
                                    setDeliveryData={setDeliveryData}
                                    partPaymentInfo={partPaymentInfo} setPartPaymentInfo={setPartPaymentInfo}
                    />
                    <div className={classes.ttn_modal_block + " " + classes.ttn_modal_option_cont}>
                        <div className={classes.ttn_modal_option_block}>
                            <button disabled={loading}
                                    className="second_btn"
                                    onClick={() => CreateOrderWithOutPRRO()}>Без ПРРО
                            </button>
                        </div>
                    </div>
                </div>

                <div className={classes.real_order_btns}>
                    <button disabled={loading} className="custom_btn" onClick={() => {
                        CreateOrder()
                    }}>Підтвердити
                    </button>
                    <button className="second_btn" onClick={onHide}>Закрити</button>
                </div>
            </div>
        </div>
    </div>)
};

export default TTNOrderBlock;
