import React, {useEffect, useState} from 'react';
import {
    ELUNE_PRODUCT_ROUTE, LAMIYA_PRODUCT_ROUTE,
    NP_DOOR,
    NP_POSTMACHINE,
    NP_WAREHOUSE,
    ORDERS_ROUTE, PHYSICAL_STORE,
    PRODUCT_ROUTE, UKR_EXPRESS, UKR_STANDART
} from "@/utils/constants";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import classes from "../adminOrder.module.scss"
import UrlLanguage from "@/components/Functions/UrlLanguage";
import PriceSpace from "@/components/Functions/PriceSpace";
import OrderPaymentText from "@/pages/Orders/components/OrderPaymentText";
import {EditPrivacyComment, getAdminListOrders} from "@/http/Order/ordersApi";
import {getUserStats} from "@/http/userApi";

const OrderLongBlock = ({OrderElem, openOrderInfo, user, orderInfoCopy,setOrders}) => {
    const navigate = useNavigate();
    const [userStats, setUserStats] = useState(null);
    const [comment, setComment] = useState(OrderElem.privacy_comment || "");
    const [searchTimeout, setSearchTimeout] = useState(false);
    useEffect(() => {
        if (!userStats && !openOrderInfo && OrderElem?.mobile) {
            getUserStats({phone:OrderElem.mobile}).then((data) => {
                setUserStats(data)
            }).catch(() => {
            })
        }
    }, [openOrderInfo]);

    const AlertOrder = () => {
        let arrOrderList = [];
        OrderElem.products.forEach((orderDeviceElem) => {
            arrOrderList.push(`\n${orderDeviceElem.name} - ${orderDeviceElem.count}шт по ${orderDeviceElem.saleprice > 0 ? orderDeviceElem.saleprice : orderDeviceElem.price} грн`)
        })
        navigator.clipboard.writeText(`Ваше замовлення:${arrOrderList} \nНа суму: ${OrderElem.totalPrice}грн`)
        toast("Список товарів скопійовано");
    };

    const ChangeCommentHandle = async(value) => {
        await EditPrivacyComment({orderId:OrderElem.id,comment:value}).then(()=>{
            setOrders(order => order.map((OrderElement) => {
                if (OrderElement.id === OrderElem.id) {
                    return {
                        ...OrderElement,
                        privacy_comment: value
                    }
                } else {
                    return {...OrderElement}
                }
            }))
            toast("Коментар оновлено");
        }).catch(()=>{
            setComment(OrderElem.privacy_comment)
        })
    };

    const OnChangeComment = async (e) => {
            if (e.target.value.length < 255) {
                setComment(e.target.value);
                if (searchTimeout !== false) {
                    clearTimeout(searchTimeout);
                }
                setSearchTimeout(setTimeout(ChangeCommentHandle, 1500, e.target.value));
            }else{
                toast.error("Занадто довгий коментар");
            }
    };

    return (
        <>
            <div className={`${openOrderInfo ? classes.closed : ""} ${classes.order_long_container}`}>
                <div className={classes.order_long_row}>
                    <div className={classes.order_long_header}>
                        <div>Список товарів</div>
                        <span onClick={() => AlertOrder()}
                              className={"material-symbols-outlined" + ' ' + classes.icon_item}>content_copy</span>
                    </div>
                    {OrderElem.products.map((orderDeviceElem, index) => {
                        return (
                            <div className={classes.order_long_product_item} key={index}>
                                <img alt={orderDeviceElem.name} title={orderDeviceElem.name}
                                     className={classes.admin_orders_short_img}
                                     src={orderDeviceElem.image}/>
                                <div className={classes.order_product_info_block}>
                                    <div className={classes.order_product_links}>
                                        <div>
                                            <a className={classes.order_product_name}
                                               onClick={(e) => {
                                                   e.preventDefault();
                                                   navigate(`${PRODUCT_ROUTE}/${orderDeviceElem.deviceId}`)
                                               }}
                                               href={`${PRODUCT_ROUTE}/${orderDeviceElem.deviceId}`}>{orderDeviceElem.name}</a>
                                            <div
                                                className="font_default admin_gray_text"> {orderDeviceElem.series}</div>
                                            {orderDeviceElem.special_type && <div className={classes.order_product_preorder}>{
                                                orderDeviceElem.special_type === "preorder" ?"Предзамовлення":
                                                    orderDeviceElem.special_type === "on_tab" ?"Розпив":
                                                        orderDeviceElem.special_type === "sell_bottle" ?"Залишок у флаконі":
                                                            orderDeviceElem.special_type === "storage" ?"Зі складу": ""}
                                                    </div>}
                                        </div>
                                        <a href={`https://lamiya.com.ua${LAMIYA_PRODUCT_ROUTE}/${orderDeviceElem.link}`}
                                           target="_blank">
                                            <span
                                                className={"material-symbols-outlined" + ' ' + classes.icon_item}>open_in_new</span>
                                        </a>
                                    </div>
                                    <div className={classes.order_product_info}>
                                        <div className="admin_gray_text">Код товару: {orderDeviceElem.deviceId} Код
                                            опції: {orderDeviceElem.option_id}</div>
                                        <div
                                            className={orderDeviceElem.count > 1 ? classes.order_count_color : ""}>{PriceSpace(orderDeviceElem.count)} шт.
                                        </div>

                                        {orderDeviceElem.saleprice
                                            ? <div className={classes.saleprice_block}>
                                                <div
                                                    className={classes.saleprice_old_price}>{PriceSpace(orderDeviceElem.price)} ₴
                                                </div>
                                                <div
                                                    className={"f16_text" + ' ' + classes.saleprice_sale}> {PriceSpace(orderDeviceElem.saleprice)} ₴
                                                </div>
                                            </div>
                                            : <div
                                                className="f16_text">{PriceSpace(orderDeviceElem.price)} ₴
                                            </div>}
                                    </div>
                                </div>
                            </div>);
                    })}
                </div>

                <ul className={`${classes.order_long_row} ${classes.order_long_row_info}`}>
                    <li className={classes.order_long_delivery_container}>
                        <div className={classes.order_long_header}>
                            <div>Доставка</div>
                        </div>
                        <div className={classes.order_long_delivery_block}>
                            <div className={classes.order_long_delivery}>
                                {OrderElem.deliveryDate ?
                                    <div>
                                        <span className="admin_gray_text">Дата прибуття</span>
                                        {OrderElem.deliveryDate}
                                    </div> : <></>}
                                {OrderElem.deliveryPrice ?
                                    <div>
                                        <span className="admin_gray_text">Вартість доставки</span>
                                        {OrderElem.deliveryPrice} грн
                                    </div> : <></>}
                                {OrderElem.deliveryPay && <div>
                                    <span className="admin_gray_text">Сплачує доставку</span>
                                    {OrderElem.deliveryPay === 'recipient' ? "Отримувач" : "Відправник"}
                                </div>}
                                {OrderElem.moneyBack &&
                                    <div>
                                        <span className="admin_gray_text">Накладений</span>
                                        {PriceSpace(OrderElem.moneyBack)} грн
                                    </div>}
                                {OrderElem.postMethod &&
                                    <div>
                                        <span className="admin_gray_text">Спосіб доставки</span>
                                        {OrderElem.postMethod === NP_WAREHOUSE ? "Відділення Нової пошти"
                                            : OrderElem.postMethod === NP_DOOR ? "Кур'єр Нової пошти"
                                                : OrderElem.postMethod === NP_POSTMACHINE ? "Поштомат Нової пошти"
                                                    : OrderElem.postMethod === UKR_STANDART ? "Стандарт Укр пошта"
                                                        : OrderElem.postMethod === UKR_EXPRESS ? "Експрес Укр пошта"
                                                            : OrderElem.postMethod === PHYSICAL_STORE ? "Самовивіз з магазину" : ""}
                                    </div>}
                                {OrderElem.address &&
                                    <div>
                                        <span className="admin_gray_text">Адреса доставки</span>
                                        {OrderElem.address}
                                    </div>}

                                {OrderElem?.ttn &&
                                    <div>
                                        <span className="admin_gray_text">ТТН</span>
                                        <div onClick={(e) => orderInfoCopy(OrderElem.ttn, "ТТН скопійована", e)}>
                                            {OrderElem.ttn}
                                            <a target="_blank"
                                               href={OrderElem.postMethod.startsWith("np")? `https://novapost.com/uk-ua/tracking/${OrderElem.ttn}`
                                                   : OrderElem.postMethod.startsWith("ukr")
                                                       ? `https://track.ukrposhta.ua/tracking_UA.html?barcode=${OrderElem.ttn}` : ""}>
                                                <span
                                                    className={"material-symbols-outlined" + ' ' + classes.icon_item}>open_in_new</span>
                                            </a>
                                        </div>
                                    </div>}
                            </div>
                        </div>
                    </li>
                    <li className={classes.order_long_delivery_container}>
                        <div className={classes.order_long_header}>
                            <div>Оплата</div>
                        </div>
                        <div className={classes.order_long_delivery_block}>
                            <div className={classes.order_long_delivery}>
                                <div>
                                    <span className="admin_gray_text">Сума замовлення</span>
                                    {PriceSpace(OrderElem.totalPrice)} ₴
                                    ({PriceSpace(OrderElem.moneyCard)} ₴)
                                </div>
                                {user.user.role?.includes('ADMIN') && <div>
                                    <span className="admin_gray_text">Чистий дохід</span>
                                    {PriceSpace(OrderElem.totalProfit)} грн
                                </div>}
                                {OrderElem.paymentMethods?.length > 0 &&
                                    <div>
                                        <span className="admin_gray_text">Спосіб оплати</span>
                                        <OrderPaymentText paymentMethods={OrderElem.paymentMethods}/>
                                    </div>}
                                {OrderElem.payment_status &&
                                    <div>
                                        <span className="admin_gray_text">Статус оплати</span>
                                        {OrderElem.payment_status === "not_paid"
                                                ?  <div className={classes.color_red}>Не оплачено</div>
                                                : OrderElem.payment_status === "paid" ? <div className={classes.color_green}>Оплачено</div>
                                                    : OrderElem.payment_status === "failure" ? <div className={classes.color_red}>Помилка оплати</div>
                                                        : OrderElem.payment_status === "processing" ? <div>Очікуємо підтвердження</div>
                                                            : OrderElem.payment_status === "moneyback" ? <div>Післяплата</div> : ""}
                                    </div>}
                                {OrderElem.moneyLose !== 0 &&
                                    <div>
                                        <span className="admin_gray_text">Витрати</span>
                                        {PriceSpace(OrderElem.moneyLose)} грн
                                    </div>}
                                {OrderElem.promo &&
                                    <div>
                                        <span className="admin_gray_text">Промокод</span>
                                        <div className={classes.color_red}>{OrderElem.promo}</div>
                                    </div>}
                                {(user.user.role?.includes('ADMIN') && OrderElem.fop) &&
                                    <div>
                                        <span className="admin_gray_text">Фоп</span>
                                        <div>{OrderElem.fop}</div>
                                    </div>}

                            </div>
                        </div>
                    </li>
                    <li className={classes.order_long_delivery_container}>
                        <div className={classes.order_long_header}>
                            <div>Покупець</div>
                        </div>
                        <div className={classes.order_long_delivery_block}>
                            <div className={classes.order_long_delivery}>
                                {(OrderElem?.firstName && OrderElem?.lastName) &&
                                    <div
                                        onClick={(e) => orderInfoCopy(`${OrderElem.lastName} ${OrderElem.firstName}`, "ФІО скопійовано", e)}>
                                        <span className="admin_gray_text">Отримувач</span>
                                        {`${OrderElem.lastName} ${OrderElem.firstName}`}
                                    </div>}
                                {OrderElem?.mobile &&
                                    <div onClick={(e) => orderInfoCopy(OrderElem.mobile, "Телефон скопійовано", e)}>
                                        <span className="admin_gray_text">Телефон</span>
                                        {OrderElem.mobile}
                                    </div>}
                                {userStats && <div>
                                    <span className="admin_gray_text">Статистика користувача</span>
                                    <div className={classes.ttn_modal_user_info_cont}>
                                        <div className={classes.ttn_modal_user_info_block}>
                                            <span>Замовлення</span>
                                            <div>
                                                <div className={classes.ttn_modal_user_info_item}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24"
                                                         fill="none" stroke="#00A046" strokeWidth="3"
                                                         strokeLinecap="round"
                                                         strokeLinejoin="round">
                                                        <path d="M20 6 9 17l-5-5"/>
                                                    </svg>
                                                    {userStats.completed_orders}
                                                </div>
                                                <div className={classes.ttn_modal_user_info_item}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24"
                                                         fill="none" stroke="#F84147" strokeWidth="3"
                                                         strokeLinecap="round"
                                                         strokeLinejoin="round">
                                                        <path d="M18 6 6 18"/>
                                                        <path d="m6 6 12 12"/>
                                                    </svg>
                                                    {userStats.failed_orders}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={classes.ttn_modal_user_info_block}>
                                            <span>Відсоток викупу</span>
                                            <div>
                                                <div className={classes.ttn_modal_user_info_item}>
                                                    {userStats.completed_percent} %
                                                </div>
                                            </div>
                                        </div>
                                        <div className={classes.ttn_modal_user_info_item}>
                                            <a target="_blank" href={`${ORDERS_ROUTE}/all?phone=${OrderElem.mobile}`}>
                                <span
                                    className={"material-symbols-outlined" + ' ' + classes.icon_item}>open_in_new</span>
                                            </a>

                                        </div>
                                    </div>
                                    {userStats.comment && <div className={classes.ttn_modal_user_info_coment}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                             strokeLinejoin="round">
                                            <path
                                                d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>
                                            <path d="M8 12h.01"/>
                                            <path d="M12 12h.01"/>
                                            <path d="M16 12h.01"/>
                                        </svg>
                                        {userStats.comment}
                                    </div>}
                                </div>}
                                <div>
                                    <span className="admin_gray_text">Приватний коментар</span>
                                    <textarea className={classes.ttn_modal_textarea_comment} value={comment} onChange={(e)=>OnChangeComment(e)}/>
                                </div>

                                {OrderElem?.comment &&
                                    <div>
                                        <span className="admin_gray_text">Коментар користувача</span>
                                        {OrderElem.comment}
                                    </div>}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default OrderLongBlock;
