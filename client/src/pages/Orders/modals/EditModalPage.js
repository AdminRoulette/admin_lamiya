import React, {useEffect, useState} from 'react';
import DeviceListinEditModal from "./editComponents/DeviceListinEditModal";
import AddDevicetoEdit from "./editComponents/addDevicetoEdit";
import {EditOrder, getOrderEdit} from "@/http/Order/ordersApi";
import {toast} from "react-toastify";
import classes from "../adminOrder.module.scss";

const EditModalPage = ({hideOrderEditModal, orderId, setOrders, OrderElem}) => {
    const [orderDeviceList, setOrderDeviceList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getOrderEdit(orderId).then((OrderElement) => {
            setOrderDeviceList(OrderElement);
        })
    }, []);

    const clickEditOrder = async () => {
        setLoading(true)
        if (orderDeviceList.length < 1) {
            toast.error(`Замовлення має мати хоча б 1 товар`);
            setLoading(false)
            return;
        }
        await EditOrder({orderDevices: orderDeviceList, orderId}).then((editRes) => {
            setOrders(order => order.map((OrderElem) => {
                if (OrderElem.id === orderId) {
                    return {
                        ...OrderElem, ...editRes
                    }
                } else {
                    return {...OrderElem}
                }
            }))
            toast(`Замовлення успішно редаговано`);
            hideOrderEditModal();
        }).catch(error => {
            toast.error(error?.response?.data?.message)
        }).finally(() => {
            setLoading(false)
        })

    }

    return (<div className="modal_main">
        <div onClick={() => hideOrderEditModal()} className="modal_bg"/>
        <div className='modal_container'>
            <div className="modal_header">
                <div>{`Редагування замовлення #${orderId}`}</div>
                <svg onClick={() => hideOrderEditModal()} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none"
                     stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                </svg>
            </div>
            <div className="modal_body">
                <div className={classes.edit_modal_body}>
                    <div className={classes.edit_order_product_cont + " " + classes.edit_order_block}>
                        <h3>Список товарів:</h3>
                        {orderDeviceList.map(OrderDevElem => {
                            return (<DeviceListinEditModal setOrderDeviceList={setOrderDeviceList}
                                                           orderDeviceList={orderDeviceList} key={OrderDevElem.id}
                                                           OrderDevElem={OrderDevElem}/>)
                        })}
                    </div>
                    <div className={classes.edit_order_block}>
                        <AddDevicetoEdit orderDeviceList={orderDeviceList} setOrderDeviceList={setOrderDeviceList}/>
                    </div>
                </div>
                <div className="modal_footer">
                    <button className={'second_btn' + ' ' + classes.edit_order_buttons}
                            onClick={() => hideOrderEditModal()}>Закрити
                    </button>
                    <button disabled={loading} className={'custom_btn' + ' ' + classes.edit_order_buttons}
                            onClick={() => clickEditOrder()}>Редагувати
                    </button>
                </div>
            </div>
        </div>
    </div>)
};

export default EditModalPage;


//







