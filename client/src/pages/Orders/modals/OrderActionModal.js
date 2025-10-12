import React, {useEffect, useRef, useState} from 'react';
import classes from "@/pages/Orders/adminOrder.module.scss";
import {toast} from "react-toastify";
import {
    ApprovalPayment,
    CompleteRealStatus,
    DeliveryReady,
    PackingStatus
} from "@/http/Order/ordersApi";
import {PHYSICAL_STORE} from "@/utils/constants";

const OrderActionModal = ({OrderElem, onHide, setOrders, setIsRealOrderModal, setIsTTNOrderModal, setCancelModal, role}) => {
    const [status, setStatus] = useState('');
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onHide(event)
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const UpdateOrderList = (res) => {
        setOrders(order => order.map((OrderElement) => {
            if (OrderElement.id === OrderElem.id) {
                return {
                    ...OrderElement, ...res
                }
            } else {
                return {...OrderElement}
            }
        }))
    }

    const clickPaymentApproval = async () => {
        await ApprovalPayment({orderId: OrderElem.id}).then((orderInfo) => {
            UpdateOrderList(orderInfo)
            toast("Оплату внесено");
        }).catch(error => {
            toast(error?.response?.data.message)
        })
    }

    const clickDeliveryReady = async () => {
        await DeliveryReady({orderId: OrderElem.id}).then((orderInfo) => {
            UpdateOrderList(orderInfo)
            toast("Статус оновлено");
        }).catch(error => {
            toast(error?.response?.data.message)
        })
    }

    const ClickPacking = async () => {
        await PackingStatus({orderId: OrderElem.id}).then((orderInfo) => {
            UpdateOrderList(orderInfo)
            toast("Статус оновлено");
        }).catch(error => {
            toast(error?.response?.data.message)
        })
    }

    const ClickRealComplete = async () => {
        await CompleteRealStatus({orderId: OrderElem.id}).then((orderInfo) => {
            UpdateOrderList(orderInfo)
            toast("Статус оновлено");
        }).catch(error => {
            toast(error?.response?.data.message)
        })
    }

    const ChangeStatusType = async (type, event) => {
        event.stopPropagation()
        setStatus(type)
    }

    const ChangeStatus = async (event) => {
        if (status === 'ttn') {
            setIsTTNOrderModal(true);
            document.body.style.overflow = 'hidden';
            onHide(event);
        } else if (status === PHYSICAL_STORE) {
            setIsRealOrderModal(true);
            document.body.style.overflow = 'hidden';
            onHide(event);
        } else if (status === 'approve-payment') {
            await clickPaymentApproval();
        } else if (status === 'store-complete') {
            await ClickRealComplete();
        } else if (status === "delivery-ready") {
            await clickDeliveryReady();
        } else if (status === "packing") {
            await ClickPacking();
        } else if (status === "cancel") {
            setCancelModal(true);
            document.body.style.overflow = 'hidden';
        }

    }
    return (
        <>
            <div ref={modalRef} className={classes.status_modal_container}>
                <div className={classes.status_modal_header}>
                    <span>Змінити статус</span>
                    <svg onClick={(e) => onHide(e)} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>

                <div className={classes.status_modal_body}>
                    {(OrderElem.status_id === "new"  || (OrderElem.status_id === "in_store" && OrderElem?.payment_status === "moneyback")) &&
                        <label onClick={(e) => ChangeStatusType(PHYSICAL_STORE, e)} className={classes.custom_status_checkbox}>
                            <input checked={status === PHYSICAL_STORE} type="checkbox"/>
                            <div className={classes.status_checkbox_wrapper}></div>
                            <span>Самовивіз</span>
                        </label>}
                    {(OrderElem.status_id === "in_store" && OrderElem?.payment_status === "paid") &&
                        <label onClick={(e) => ChangeStatusType("store-complete", e)} className={classes.custom_status_checkbox}>
                            <input checked={status === "store-complete"} type="checkbox"/>
                            <div className={classes.status_checkbox_wrapper}></div>
                            <span>Підтвердити вручення</span>
                        </label>}

                    {OrderElem.status_id === "new" &&
                        <label onClick={(e) => ChangeStatusType('ttn', e)} className={classes.custom_status_checkbox}>
                            <input checked={status === 'ttn'} type="checkbox"/>
                            <div className={classes.status_checkbox_wrapper}></div>
                            <span>Створити ТТН</span>
                        </label>}
                    {(!(OrderElem?.payment_status === "paid" || OrderElem?.payment_status === "moneyback") && OrderElem.status_id !== 'new') && <label onClick={(e) => ChangeStatusType('approve-payment', e)}
                                                            className={classes.custom_status_checkbox}>
                        <input checked={status === 'approve-payment'} type="checkbox"/>
                        <div className={classes.status_checkbox_wrapper}></div>
                        <span>Підтвердити оплату</span>
                    </label>}
                    {(OrderElem.status_id === 'created' || OrderElem.status_id === 'ready-delivery' || OrderElem.status_id === 'in_store') &&
                        <label onClick={(e) => ChangeStatusType('packing', e)}
                               className={classes.custom_status_checkbox}>
                        <input checked={status === 'packing'} type="checkbox"/>
                        <div className={classes.status_checkbox_wrapper}></div>
                        <span>Комплектується</span>
                    </label>}
                    {OrderElem.status_id === 'packing' && <label onClick={(e) => ChangeStatusType('delivery-ready', e)}
                                                            className={classes.custom_status_checkbox}>
                        <input checked={status === 'delivery-ready'} type="checkbox"/>
                        <div className={classes.status_checkbox_wrapper}></div>
                        <span>{OrderElem.postMethod !== PHYSICAL_STORE ? "Готове до відправки" : "Готове до вручення"}</span>
                    </label>}
                    {role?.includes('ADMIN') && <label onClick={(e) => ChangeStatusType('cancel', e)}
                           className={classes.custom_status_checkbox}>
                        <input checked={status === 'cancel'} type="checkbox"/>
                        <div className={classes.status_checkbox_wrapper}></div>
                        <span>Скасувати</span>
                    </label>}
                </div>


                <div className={classes.status_modal_footer}>
                    <span onClick={(e) => onHide(e)}>Закрити</span>
                    <button onClick={ChangeStatus} disabled={!status} className="custom_btn">Змінити</button>
                </div>
            </div>
        </>
    );
};

export default OrderActionModal;