import React, {useContext, useState} from "react";
import OrderShortBlock from "./components/OrderShortBlock";
import OrderLongBlock from "./components/OrderLongBlock";
import classes from "./adminOrder.module.scss"
import {Context} from "@/index";
import {toast} from "react-toastify";

const OrderInfo = ({OrderElem,setOrders}) => {
    const {language} = useContext(Context)
    const [openOrderInfo, setOpenOrderInfo] = useState(true);
    const {user} = useContext(Context);

    const showFullOrder = () => {
        setOpenOrderInfo((value) => !value);
    };
    const orderInfoCopy = (value, text, event) => {
        navigator.clipboard.writeText(value)
        toast(text);
        event.stopPropagation();
    };

    return (<div className={classes.order_container}>
        <OrderShortBlock orderInfoCopy={orderInfoCopy} openOrderInfo={openOrderInfo} user={user} setOrders={setOrders} OrderElem={OrderElem} showFullOrder={showFullOrder}/>
        <OrderLongBlock setOrders={setOrders} orderInfoCopy={orderInfoCopy} user={user} language={language} OrderElem={OrderElem} openOrderInfo={openOrderInfo}/>
    </div>)
};
export default OrderInfo;
