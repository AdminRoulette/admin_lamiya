import React, {useEffect, useRef, useState} from 'react';
import EditModalPage from "../modals/EditModalPage";
import CancelOrderModal from "../modals/CancelOrderModal";
import {getZebraTTN} from "@/http/Order/ordersApi";
import classes from "../adminOrder.module.scss"
import PriceSpace from "@/components/Functions/PriceSpace";
import CheckOrderModal from "@/pages/Orders/modals/CheckOrderModal";
import OrderActionModal from "@/pages/Orders/modals/OrderActionModal";
import RealOrderBlock from "@/pages/Orders/modals/CompleteOrder/RealOrder/RealOrderBlock";
import TTNOrderBlock from "@/pages/Orders/modals/CompleteOrder/TTNOrderBlock";
import {toast} from "react-toastify";
import {PHYSICAL_STORE} from "@/utils/constants";

const OrderShortBlock = ({setOrders, OrderElem, openOrderInfo, showFullOrder, user, orderInfoCopy}) => {
    const [CancelModal, setCancelModal] = useState(false);
    const [checkModal, setCheckModal] = useState(false);
    const [editOrderModal, setEditOrderModal] = useState(false);
    const [orderStatusModal, setOrderStatusModal] = useState(false);
    const [isRealOrderModal, setIsRealOrderModal] = useState(false);
    const [isTTNOrderModal, setIsTTNOrderModal] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, []);


    const WSConnection = ({id}) => {
        const ws = new WebSocket(process.env.NODE_ENV === "production" ? 'wss://admin.lamiya.com.ua:8080' : 'ws://localhost:8080');
        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: 'part_payment',
                orderId: id
            }));
        };
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setOrders(order => order.map((OrderElement) => {
                if (OrderElement.id === OrderElem.id) {
                    return {
                        ...OrderElement,
                        ...data
                    }
                } else {
                    return {...OrderElement}
                }
            }))
        };
        socketRef.current = ws;
    };
    const AlertTTN = (event) => {
        if (OrderElem.ttn) {
            navigator.clipboard.writeText(`Дякуємо за замовлення 🥰\nТТН: ${OrderElem.ttn} \nБудь-ласка, при отриманні замовлення обов'язково перевіряйте цілісність та вміст замовлення на пошті.`);
            toast("ТТН Скопійована");
        } else {
            toast.error("ТТН відсутня");
        }
        event.stopPropagation();
    };
    const OpenActionModal = async (event) => {
        event.stopPropagation();
        setOrderStatusModal(prev => !prev);
    }

    const closeCheckModal = async () => {
        setCheckModal(false);
        document.body.style.overflow = '';
    }

    const showCheckModal = (event) => {
        setCheckModal(true);
        document.body.style.overflow = 'hidden';
        event.stopPropagation();
    }

    const showEditModal = (event) => {
        setEditOrderModal(true);
        document.body.style.overflow = 'hidden';
        event.stopPropagation();
    }

    const PrintTTN = async (event) => {
        event.stopPropagation();
        const response = await getZebraTTN({orderId: OrderElem.id})
        let file = new Blob([response], {type: 'application/pdf'});
        let fileURL = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `${OrderElem.ttn}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (<>
        <div onClick={showFullOrder} className={`${classes.order_short_block} ${openOrderInfo && classes.opened}`}>
            <div className={classes.order_short_info_container}>
                <svg className={classes.orders_short_arrow} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
                <div className={classes.order_short_info}>
                    <div className="admin_gray_text">{`#${OrderElem.id} від ${OrderElem.created_date}`}</div>

                    {OrderElem.ttn && openOrderInfo ? <div className={"admin_gray_text" + " " + classes.order_short_ttn}
                                                           onClick={(e) => {
                                                               orderInfoCopy(OrderElem.ttn, "ТТН скопійована", e)
                                                           }}>
                        {OrderElem.postMethod.startsWith('ukr') ? <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -5 50 80"
                            height={15}
                            width={15}
                            xmlSpace="preserve"
                        >
                            <path
                                d="m404.246 262.023-203.687 46.094c-60.707 13.738-98.789 74.09-85.055 134.801 13.742 60.711 74.094 98.785 134.801 85.051 60.711-13.739 98.789-74.09 85.054-134.797-6.882-30.395-25.449-55.094-49.894-70.481-.004 0-.063-.05-.086-.062a2.827 2.827 0 0 1-1.184-2.301c0-1.324.914-2.437 2.149-2.734.004-.004 90.605-20.492 90.621-20.492a5.624 5.624 0 0 1 5.719 2.093c.007.016.004.004.004.004 24.96 33.028 39.953 74.239 39.953 118.813 0 104.972-82.012 190.758-185.457 196.851-.922.051-6.528.27-8.422.297-45.801.719-92.239-12.414-132.621-40.695C-5.84 503.059-30.617 362.508 40.78 260.531L221.988 1.738A4.236 4.236 0 0 1 225.406 0c1.41 0 2.66.695 3.43 1.758l177.957 253.785c.453.672.723 1.488.723 2.363a4.22 4.22 0 0 1-3.27 4.117"
                                transform="matrix(.13 0 0 -.13 0 76.9)"
                                style={{
                                    fill: "#fabc26", fillOpacity: 1, fillRule: "nonzero", stroke: "none",
                                }}
                            />
                        </svg> : OrderElem.postMethod.startsWith('np') ? <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={15}
                            height={15}
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="var(--special-fill, #f23c32)"
                                clipRule="evenodd"
                                d="M1.707 11.293a1 1 0 0 0 0 1.414L6 17V7l-4.293 4.293ZM7 6h3v4h4V6h3l-4.293-4.293a1 1 0 0 0-1.414 0L7 6Zm11 1v10l4.293-4.293a1 1 0 0 0 0-1.414L18 7Zm-1 11h-3v-4h-4v4H7l4.293 4.293a1 1 0 0 0 1.414 0L17 18Z"
                            />
                        </svg> : <></>}
                        ТТН: {OrderElem.ttn}</div> : OrderElem.postMethod === PHYSICAL_STORE &&
                        <div className={"admin_gray_text" + " " + classes.order_short_ttn}>Самовивіз з магазину</div>}
                    <div className={classes.order_status_block}>
                        <div onClick={(event) => OpenActionModal(event)}
                             className={classes.order_short_status + ' ' + classes.underline + " " +
                                 (OrderElem.status_id === 'cancelled' || OrderElem.status_id === 'refused' || OrderElem.status_id === 'refused-return' || OrderElem.status_id === 'cancelled-us'
                                     ? classes.color_red : OrderElem.status_id === 'completed' ? classes.color_green : "")}>
                            {orderStatusModal && <OrderActionModal setIsTTNOrderModal={setIsTTNOrderModal}
                                                                   setIsRealOrderModal={setIsRealOrderModal}
                                                                   setOrders={setOrders}
                                                                   role={user.user.role}
                                                                   setCancelModal={setCancelModal}
                                                                   onHide={(event) => OpenActionModal(event)}
                                                                   OrderElem={OrderElem}/>}
                            <div>{OrderElem.status}</div>
                        </div>
                    </div>
                </div>
            </div>
            {openOrderInfo && <div className={classes.order_short_user_info_block}>
                <div className={classes.order_short_user_info}>
                    {(OrderElem?.firstName && OrderElem?.lastName) &&
                        <div onClick={(e) => {
                            orderInfoCopy(`${OrderElem.lastName} ${OrderElem.firstName}`, "ФІО скопійовано", e)
                        }} className={classes.order_short_user_name}>
                            <div>{OrderElem.lastName}</div>
                            <div>{OrderElem.firstName}</div>
                        </div>}
                    {OrderElem?.mobile && <div onClick={(e) => {
                        orderInfoCopy(OrderElem.mobile, "Мобільний номер скопійовано", e)
                    }} className={`${classes.order_short_mobile} admin_gray_text`}>{OrderElem.mobile}</div>}
                    {OrderElem.source &&
                        <div className={classes.ref_block}>Джерело:
                            {OrderElem.source === 'inst' ? <svg
                                    width={16}
                                    height={16}
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g strokeWidth={0}/>
                                    <g strokeLinecap="round" strokeLinejoin="round"/>
                                    <rect x={2} y={2} width={28} height={28} rx={6} fill="url(#a)"/>
                                    <rect x={2} y={2} width={28} height={28} rx={6} fill="url(#b)"/>
                                    <rect x={2} y={2} width={28} height={28} rx={6} fill="url(#c)"/>
                                    <path d="M23 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" fill="#fff"/>
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M16 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10m0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6"
                                        fill="#fff"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6 15.6c0-3.36 0-5.04.654-6.324a6 6 0 0 1 2.622-2.622C10.56 6 12.24 6 15.6 6h.8c3.36 0 5.04 0 6.324.654a6 6 0 0 1 2.622 2.622C26 10.56 26 12.24 26 15.6v.8c0 3.36 0 5.04-.654 6.324a6 6 0 0 1-2.622 2.622C21.44 26 19.76 26 16.4 26h-.8c-3.36 0-5.04 0-6.324-.654a6 6 0 0 1-2.622-2.622C6 21.44 6 19.76 6 16.4zM15.6 8h.8c1.713 0 2.878.002 3.778.075.877.072 1.325.202 1.638.361a4 4 0 0 1 1.748 1.748c.16.313.29.761.36 1.638.074.9.076 2.065.076 3.778v.8c0 1.713-.002 2.878-.075 3.778-.072.877-.202 1.325-.361 1.638a4 4 0 0 1-1.748 1.748c-.313.16-.761.29-1.638.36-.9.074-2.065.076-3.778.076h-.8c-1.713 0-2.878-.002-3.778-.075-.877-.072-1.325-.202-1.638-.361a4 4 0 0 1-1.748-1.748c-.16-.313-.29-.761-.36-1.638C8.001 19.278 8 18.113 8 16.4v-.8c0-1.713.002-2.878.075-3.778.072-.877.202-1.325.361-1.638a4 4 0 0 1 1.748-1.748c.313-.16.761-.29 1.638-.36.9-.074 2.065-.076 3.778-.076"
                                        fill="#fff"
                                    />
                                    <defs>
                                        <radialGradient
                                            id="a"
                                            cx={0}
                                            cy={0}
                                            r={1}
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="rotate(-55.376 27.916 .066)scale(25.5196)"
                                        >
                                            <stop stopColor="#B13589"/>
                                            <stop offset={0.793} stopColor="#C62F94"/>
                                            <stop offset={1} stopColor="#8A3AC8"/>
                                        </radialGradient>
                                        <radialGradient
                                            id="b"
                                            cx={0}
                                            cy={0}
                                            r={1}
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="rotate(-65.136 29.766 6.89)scale(22.5942)"
                                        >
                                            <stop stopColor="#E0E8B7"/>
                                            <stop offset={0.445} stopColor="#FB8A2E"/>
                                            <stop offset={0.715} stopColor="#E2425C"/>
                                            <stop offset={1} stopColor="#E2425C" stopOpacity={0}/>
                                        </radialGradient>
                                        <radialGradient
                                            id="c"
                                            cx={0}
                                            cy={0}
                                            r={1}
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="matrix(38.50003 -5.5 1.1764 8.23476 .5 3)"
                                        >
                                            <stop offset={0.157} stopColor="#406ADC"/>
                                            <stop offset={0.468} stopColor="#6A45BE"/>
                                            <stop offset={1} stopColor="#6A45BE" stopOpacity={0}/>
                                        </radialGradient>
                                    </defs>
                                </svg>
                                : OrderElem.source === 'tiktok' ?
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 44.952 16"
                                        width={44.952}
                                        height={16}
                                    >
                                        <path
                                            fill="#25F4EE"
                                            d="M3.762 6.416V5.99a3 3 0 0 0-.448-.032A3.317 3.317 0 0 0 0 9.275a3.31 3.31 0 0 0 1.416 2.718 3.3 3.3 0 0 1-.89-2.26 3.32 3.32 0 0 1 3.236-3.317"
                                        />
                                        <path
                                            fill="#25F4EE"
                                            d="M3.842 11.248c.815 0 1.482-.65 1.511-1.459l.002-7.226h1.319a3 3 0 0 1-.042-.458h-1.8L4.83 9.331a1.516 1.516 0 0 1-1.511 1.459 1.5 1.5 0 0 1-.703-.175 1.5 1.5 0 0 0 1.227.633M9.14 5.016v-.402a2.5 2.5 0 0 1-1.365-.407 2.5 2.5 0 0 0 1.365.809"
                                        />
                                        <path
                                            fill="#FE2C55"
                                            d="M7.775 4.207a2.5 2.5 0 0 1-.616-1.644h-.482a2.5 2.5 0 0 0 1.097 1.644M3.317 7.758a1.516 1.516 0 0 0-1.514 1.515c0 .582.331 1.089.813 1.342a1.5 1.5 0 0 1-.287-.884 1.516 1.516 0 0 1 1.514-1.515c.156 0 .307.027.448.07V6.445a3 3 0 0 0-.448-.032l-.078.002v1.413a1.5 1.5 0 0 0-.448-.07"
                                        />
                                        <path
                                            fill="#FE2C55"
                                            d="M9.14 5.016v1.4a4.3 4.3 0 0 1-2.507-.806v3.665a3.32 3.32 0 0 1-3.317 3.319 3.3 3.3 0 0 1-1.9-.602 3.3 3.3 0 0 0 2.426 1.059 3.323 3.323 0 0 0 3.317-3.32V6.066a4.3 4.3 0 0 0 2.506.806V5.07q-.274-.001-.526-.056"
                                        />
                                        <path
                                            d="M6.633 9.275V5.61a4.3 4.3 0 0 0 2.507.806v-1.4a2.5 2.5 0 0 1-1.365-.809 2.5 2.5 0 0 1-1.1-1.644H5.356l-.002 7.226a1.516 1.516 0 0 1-1.511 1.459 1.52 1.52 0 0 1-1.23-.631A1.52 1.52 0 0 1 1.8 9.275a1.516 1.516 0 0 1 1.514-1.514c.156 0 .307.027.448.07V6.418a3.316 3.316 0 0 0-2.345 5.575 3.3 3.3 0 0 0 1.9.602 3.324 3.324 0 0 0 3.317-3.32m4.813-4.255h5.629l-.516 1.612H15.1v5.96h-1.82v-5.96l-1.83.002zm14.851 0h5.76l-.516 1.612h-1.589v5.96H28.13v-5.96l-1.83.002zm-8.877 2.409h1.803v5.163H17.43zm2.521-2.428h1.803v3.526l1.786-1.756h2.151l-2.261 2.194 2.531 3.627h-1.986l-1.689-2.514-.535.519v1.995h-1.803V5.001zm19.102 0h1.803v3.526l1.786-1.756h2.151l-2.261 2.194 2.531 3.627h-1.983l-1.689-2.514-.535.519v1.995h-1.803zM18.322 6.839a.91.91 0 0 0 .907-.908.908.908 0 1 0-.907.908"/>
                                        <path
                                            fill="#25F4EE"
                                            d="M31.826 9.502a3.09 3.09 0 0 1 2.847-3.081 3 3 0 0 0-.27-.01 3.09 3.09 0 0 0-3.088 3.091 3.09 3.09 0 0 0 3.358 3.081 3.09 3.09 0 0 1-2.848-3.081"
                                        />
                                        <path
                                            fill="#FE2C55"
                                            d="M35.374 6.411c-.083 0-.192.005-.273.01a3.09 3.09 0 0 1 2.845 3.081 3.09 3.09 0 0 1-2.845 3.081 3.09 3.09 0 0 0 3.361-3.081 3.09 3.09 0 0 0-3.088-3.091"
                                        />
                                        <path
                                            d="M34.887 11.004a1.5 1.5 0 0 1-1.501-1.503 1.501 1.501 0 1 1 3.003 0c0 .83-.674 1.503-1.502 1.503m0-4.593a3.09 3.09 0 0 0-3.088 3.091 3.089 3.089 0 1 0 6.176 0 3.09 3.09 0 0 0-3.088-3.091"/>
                                    </svg>
                                    : OrderElem.source === 'rozetka' ? <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={96}
                                            height={16}
                                            viewBox="0 0 96 16"
                                            fill="none"
                                        >
                                            <path
                                                d="M16.41 8.035c-.018 4.419-3.714 7.983-8.241 7.965S-.018 12.384 0 7.965 3.714-.018 8.241 0c4.536.018 8.187 3.616 8.169 8.035"
                                                fill="#221F1F"
                                            />
                                            <path
                                                d="M11.16 11.96c-.867 1.517-1.943 2.761-3.144 2.734-.75-.018-1.464-.291-2.115-.723.208-.37 1.518-2.222 5.26-2.011m5.034-3.925c-.018 4.296-3.615 7.771-8.024 7.744C3.759 15.762.217 12.26.217 7.965A7.47 7.47 0 0 1 3 2.099c1.663-1.314 2.792-.309 3.19.459-.045-.326-.18-1.261-.551-1.932A7.9 7.9 0 0 1 8.242.212c4.41.027 7.97 3.52 7.952 7.824M7.78 3.555c1.157-.768 3.154-1.191 4.211.414C11.35.3 8.576 2.408 7.78 3.555M6.172 7.021c.244-.264.524-.529.849-.767 1.446-1.085 3.027-1.358 3.542-.6.199.291.208.697.054 1.138.515-.829.678-1.596.362-2.02-.533-.706-2.187-.22-3.696 1.085a6.7 6.7 0 0 0-1.112 1.164m-2.522.653c.732.132 1.527-.776 1.771-2.046s-.144-2.399-.876-2.54c-.732-.132-1.527.776-1.771 2.046-.244 1.261.144 2.399.876 2.54m10.175-1.535C6.823 10.717 1.988 8.397 1.988 8.397c-.072 1.588 2.72 6.465 6.045 6.527 3.334.062 5.792-8.785 5.792-8.785M2.973 5.16c.226-1.164.913-2.011 1.536-1.888.624.115.949 1.156.732 2.32-.226 1.164-.912 2.011-1.536 1.888-.633-.115-.958-1.156-.732-2.32m1.328.988c.28.062.588-.274.696-.741s-.036-.9-.316-.952c-.19-.044-.389.097-.533.335a.27.27 0 0 1 .126.353.27.27 0 0 1-.307.158c-.054.415.081.785.334.847"
                                                fill="#05BC52"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M33.951 8.044c0-2.858 2.19-4.207 5.685-4.207 3.513 0 5.694 1.358 5.694 4.207s-2.18 4.216-5.694 4.216c-3.505 0-5.685-1.358-5.685-4.216m2.869-.009c0 1.517 1.068 2.117 2.816 2.117 1.739 0 2.825-.591 2.825-2.117s-1.086-2.108-2.825-2.108c-1.748 0-2.816.582-2.816 2.108"
                                                fill="#000"
                                            />
                                            <path
                                                d="M54.714 5.46V4.031h-8.863v2.055h4.767l-4.838 4.542v1.42h8.96V9.984h-4.811zm8.51 3.378h-4.705v1.226h5.703v1.984H55.88V4.031h8.148v2.02H58.52v1.182h4.705zm1.677-2.752h3.328v5.962h2.737V6.086h3.328V4.031h-9.393z"
                                                fill="#000"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M92.266 4.031H88.7l-3.743 8.018h2.984l.644-1.57h3.778l.644 1.57H96zm-3.019 4.842 1.236-2.999 1.227 2.999zm-56.108-1.94c0-1.694-1.086-2.902-3.672-2.902H23.87v8.018h2.701V9.782h1.739l1.942 2.267h3.372l-2.26-2.602c1.13-.494 1.774-1.535 1.774-2.514M26.57 5.919h2.657c.821 0 1.148.441 1.148 1.006 0 .379-.23 1.076-1.192 1.076H26.57z"
                                                fill="#000"
                                            />
                                            <path
                                                d="m77.965 6.959 3.319-2.928h3.514L80.94 7.303l3.726 4.745h-3.372L78.981 8.97l-1.015.864v2.214h-2.701V4.031h2.701z"
                                                fill="#000"
                                            />
                                        </svg>
                                        : OrderElem.source === 'kasta' ? <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={88.667}
                                                height={16}
                                                viewBox="0 0 88.667 16"
                                            >
                                                <path
                                                    d="M55.593 2.512h6.249v13.044h2.523V2.512h6.248V0h-15.02zm-7.149 2.855h-4.686a1.43 1.43 0 0 1-1.422-1.427 1.43 1.43 0 0 1 1.422-1.427h6.228V0h-6.228c-2.163 0-3.925 1.769-3.925 3.939s1.763 3.939 3.925 3.939h4.687a2.573 2.573 0 0 1 2.563 2.572 2.573 2.573 0 0 1-2.563 2.573h-7.692v2.512h7.69c2.804 0 5.087-2.291 5.087-5.105 0-2.773-2.283-5.065-5.087-5.065zM27.636 0h-4.987v2.512h4.987c2.563 0 4.647 2.071 4.687 4.623-1.302-1.105-2.984-1.749-4.687-1.749h-7.749v2.935c0 3.979 3.224 7.215 7.189 7.215h7.75V7.215C34.825 3.235 31.601 0 27.636 0m-5.247 7.919h5.247c2.583 0 4.687 2.11 4.687 4.703v.422h-5.247c-2.584 0-4.687-2.11-4.687-4.703zM81.067 0H76.1v2.512h4.987c2.563 0 4.646 2.071 4.686 4.623-1.302-1.105-2.984-1.749-4.687-1.749h-7.75v2.935c0 3.979 3.225 7.215 7.19 7.215h7.75V7.215C88.256 3.235 85.032 0 81.067 0m4.685 12.621v.422h-5.247c-2.583 0-4.686-2.11-4.686-4.703v-.422h5.247c2.583 0 4.687 2.11 4.687 4.703zM9.813 6.552C12.095 5.165 13.737 2.833 14.198 0h-2.563c-.68 3.115-3.484 5.407-6.708 5.407H2.503V0H0v15.556h2.503V7.919h2.624c4.185 0 7.59 3.417 7.59 7.617h2.503c.02-3.879-2.183-7.276-5.407-8.984"/>
                                            </svg>
                                            : OrderElem.source === 'epicenter' ? <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 75.504 16"
                                                    xmlSpace="preserve"
                                                    width={75.504}
                                                    height={16}
                                                >
                                                    <path
                                                        d="M8.36 2.174V1.028C8.36.455 7.89 0 7.317 0S6.289.47 6.289 1.028v1.131c-3.351.5-5.936 3.38-5.936 6.862 0 3.82 3.115 6.935 6.935 6.935s6.935-3.115 6.935-6.935c-.015-3.453-2.556-6.318-5.862-6.847M7.287 14.692a5.674 5.674 0 0 1-5.671-5.671 5.66 5.66 0 0 1 4.672-5.568v1.234c0 .338.162.646.411.837v1.043H4.364a.78.78 0 0 0-.661.367.76.76 0 0 0-.015.749l2.953 5.627c.132.25.397.411.676.411a.76.76 0 0 0 .676-.411l2.953-5.627a.76.76 0 0 0-.029-.749.77.77 0 0 0-.646-.367H7.934V5.524c.264-.191.426-.5.426-.837V3.453c2.615.514 4.584 2.821 4.584 5.568 0 3.129-2.542 5.671-5.657 5.671m42.108-2.424h-2.277V9.521h1.939v-2.41h-1.939V4.746h2.057V2.219h-5.157v12.577h5.377zM25.947 4.731h.97v10.05h3.085V2.219h-7.14v12.562h3.085zm-4.114 7.552h-2.292V9.521h1.954v-2.41h-1.954V4.716h2.101V2.218h-5.23V14.78h5.421zM53.51 9.536h.955v5.26h3.1V2.233h-3.1v4.511h-.955V2.233h-3.085v12.562h3.085zm6.905 5.26H63.5V4.746h1.851V2.233h-6.773v2.512h1.837zM34.116 2.219h-3.085v12.562h3.085zm8.889 10.05h-.661V2.219h-3.115v10.05h-.97V2.219h-3.115v12.547h5.701V16h2.16zm29.928-8.272a2.07 2.07 0 0 0-.455-.955c-.235-.264-.573-.47-1.028-.602-.455-.147-1.102-.206-1.939-.206h-3.129v12.562h3.085v-5.07h.837c.676 0 1.234-.103 1.646-.294.426-.191.705-.485.867-.852s.235-.955.235-1.748V5.73c0-.779-.044-1.366-.118-1.734m-3.159 3.335c-.896 0-1.631-.735-1.631-1.631s.735-1.631 1.631-1.631 1.631.735 1.631 1.631c0 .911-.735 1.631-1.631 1.631"/>
                                                    <path
                                                        d="M69.774 4.466c-.691 0-1.249.558-1.249 1.234 0 .691.558 1.234 1.249 1.234s1.249-.558 1.249-1.234a1.264 1.264 0 0 0-1.249-1.234m.22 2.057-.353-.676v.676h-.514V4.907h.514v.691l.338-.691h.602l-.441.808.5.823zm5.025-2.924-.162-.264a.4.4 0 0 0-.103-.118.3.3 0 0 0 .118-.073c.059-.059.073-.132.073-.206q0-.088-.044-.176c-.029-.059-.073-.088-.132-.118a.8.8 0 0 0-.22-.029h-.485v1.073h.25v-.426h.147c.015 0 .029.015.044.015q.022 0 .044.044.044.044.088.132l.132.191.015.029h.294zm-.323-.602c-.015.015-.029.029-.044.029-.029.015-.059.015-.118.015h-.22v-.206h.25c.059 0 .103.015.118.029s.029.044.029.073c0 .015-.015.029-.015.059"/>
                                                    <path
                                                        d="M75.298 3.159c0 .426-.353.779-.779.779s-.779-.353-.779-.779.353-.779.779-.779a.766.766 0 0 1 .779.779m-.779-.984a.984.984 0 1 0 .984.984.993.993 0 0 0-.984-.984"/>
                                                </svg>
                                                : <div>{OrderElem.source}</div>}
                        </div>
                    }
                </div>
            </div>}

            {openOrderInfo && <div className={classes.order_short_payment}>
                <div className={classes.order_sum}>Сума: <span>{PriceSpace(OrderElem.totalPrice)} ₴</span></div>

                {OrderElem.payment_status === "not_paid"
                    ?  <div className={classes.color_red + ' ' + "f12_text"}>Не оплачено</div>
                    : OrderElem.payment_status === "paid" ? <div className={classes.color_green + ' ' + "f12_text"}>Оплачено</div>
                        : OrderElem.payment_status === "failure" ? <div className={classes.color_red + ' ' + "f12_text"}>Помилка оплати</div>
                            : OrderElem.payment_status === "processing" ? <div className="f12_text">Очікуємо підтвердження</div>
                                : OrderElem.payment_status === "moneyback" ? <div className="f12_text">Післяплата</div> : ""}

                {OrderElem.warning_msg && <span className={classes.order_warning_msg}>{OrderElem.warning_msg}</span>}
                {OrderElem.privacy_comment && <div className={classes.ttn_modal_user_info_coment + " " + classes.ttn_modal_privacy_comment}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                         strokeLinejoin="round">
                        <path
                            d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>
                        <path d="M8 12h.01"/>
                        <path d="M12 12h.01"/>
                        <path d="M16 12h.01"/>
                    </svg>
                    {OrderElem.privacy_comment}
                </div>}
                {OrderElem.comment && <div className={classes.ttn_modal_user_info_coment}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                         strokeLinejoin="round">
                        <path
                            d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>
                        <path d="M8 12h.01"/>
                        <path d="M12 12h.01"/>
                        <path d="M16 12h.01"/>
                    </svg>
                    {OrderElem.comment}
                </div>}
            </div>}


            {openOrderInfo && <div className={classes.order_short_imgs_block}>
                <div className={classes.order_short_imgs}>
                    {OrderElem.products.sort((a, b) => b.count - a.count).map((orderDevice, index) => {
                        if (index < 3) {
                            return (
                                <div className={classes.order_short_img}>
                                    <img key={index} alt={orderDevice.name} title={orderDevice.name}
                                         src={orderDevice.image}/>
                                    {orderDevice.count > 1 && <span>x{orderDevice.count}</span>}
                                </div>
                            )
                        }
                        if (index === 3) {
                            return (<div key={index}
                                         className={classes.order_short_img_text}>+ {OrderElem.products.length - 3}</div>)
                        }
                    })}
                </div>
            </div>}
            {!openOrderInfo &&
                (<div className={classes.order_short_icons}>
                    {(OrderElem.ttn && OrderElem.postMethod.startsWith('np')) && <span onClick={PrintTTN}
                                                                               className={classes.icon_item + ' ' + "material-symbols-outlined"}>print</span>}
                    {OrderElem?.checkuuid_list?.length > 0 && <div className={classes.icon_item}
                                                                   onClick={(event) => showCheckModal(event)}>
                        <span className="material-symbols-outlined">receipt</span>
                    </div>}
                    {OrderElem.ttn && <span onClick={(e) => AlertTTN(e)}
                                            className={classes.icon_item + ' ' + "material-symbols-outlined"}>content_copy</span>}
                    {OrderElem.status_id === 'new' &&
                        <div className={classes.icon_item} onClick={(event) => showEditModal(event)}>
                            <span className="material-symbols-outlined">edit</span>
                        </div>}
                </div>)
            }
        </div>
        {isRealOrderModal && <RealOrderBlock setOrders={setOrders} OrderElem={OrderElem} WSConnection={WSConnection}
                                             onHide={() => {
                                                 setIsRealOrderModal(false);
                                                 document.body.style.overflow = '';
                                             }}/>}
        {isTTNOrderModal && <TTNOrderBlock setOrders={setOrders} OrderElem={OrderElem} WSConnection={WSConnection}
                                           onHide={() => {
                                               setIsTTNOrderModal(false);
                                               document.body.style.overflow = '';
                                           }}/>}
        {editOrderModal && <EditModalPage orderId={OrderElem.id} setOrders={setOrders}
                                          OrderElem={OrderElem}
                                          hideOrderEditModal={() => {
                                              setEditOrderModal(false);
                                              document.body.style.overflow = ''
                                          }}/>}
        {CancelModal && <CancelOrderModal orderId={OrderElem.id} setOrders={setOrders} status_id={OrderElem.status_id}
                                          setCancelModal={setCancelModal}/>}
        {checkModal && <CheckOrderModal closeCheckModal={closeCheckModal} checks={OrderElem.checkuuid_list}/>}

    </>);
};

export default OrderShortBlock;
