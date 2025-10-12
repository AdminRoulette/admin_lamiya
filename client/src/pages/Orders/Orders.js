import React, {useState, useEffect, useTransition} from "react";
import {getAdminListOrders} from "@/http/Order/ordersApi";
import classes from "./adminOrder.module.scss"
import "../admin.scss"
import OrderInfo from "./OrderInfo";
import {useParams, useSearchParams} from "react-router-dom";
import OrderFilters from "@/pages/Orders/components/OrderFilters";

const Orders = () => {
        const {orderParam} = useParams();
        const [searchParams] = useSearchParams();
        const [orders, setOrders] = useState(null);

        useEffect(() => {
            getAdminListOrders({type: orderParam, query: searchParams}).then((data) => {
                setOrders(data);
            });
            document.title = orderParam === 'new' ? "Нові замовлення"
                : orderParam === 'in-progress' ? "В обробці замовлення"
                    : orderParam === 'delivering' ? "Доставляються замовлення"
                        : orderParam === 'failed' ? "Неуспішні замовлення"
                            : orderParam === 'canceled' ? "Відмінені замовлення"
                            : orderParam === 'all' ? "Усі замовлення"
                                : "Замовлення";

        }, [orderParam, searchParams]);



        return (
            <div className={classes.admin_orders_container}>
                <OrderFilters  orderParam={orderParam}/>
                {orders ?
                    orders.map((OrderElem) => {
                        return (
                            <OrderInfo key={OrderElem.id} setOrders={setOrders}
                                       OrderElem={OrderElem}>
                            </OrderInfo>)
                    })
                    : orders?.length === 0 ?
                        <div className={classes.admin_orders_empty_list}>Немає замовлень у розділі</div>
                        : <></>}
            </div>
        );
    }
;

export default Orders;
