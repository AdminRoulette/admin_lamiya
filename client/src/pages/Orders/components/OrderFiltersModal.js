import React, {useEffect, useRef, useState} from 'react';
import {ORDERS_ROUTE} from "@/utils/constants";
import classes from "@/pages/Orders/adminOrder.module.scss";
import {useNavigate} from "react-router-dom";

const OrderFiltersModal = ({onHide,orderParam}) => {
    const [ttn, setTtn] = useState("");
    const [id, setId] = useState("");
    const [productId, setProductId] = useState("");
    const [phone, setPhone] = useState("");
    const modalRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onHide()
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const ResetFilters = () => {
        navigate(`${ORDERS_ROUTE}/${orderParam}`)
        onHide();
    }

    const NavigateToFilters = () => {
        const searchParams = new URLSearchParams();

        if (id) searchParams.append('id', id);
        if (ttn) searchParams.append('ttn', ttn);
        if (phone) searchParams.append('phone', phone);
        if (productId) searchParams.append('product_id', productId);

        if (searchParams) {
            navigate(`${ORDERS_ROUTE}/${orderParam}?${searchParams.toString()}`)
        }
        onHide();
    }
    return (
        <div ref={modalRef} className={classes.orders_filter_container}>
            <div>
                <input value={id} onChange={(e) => setId(e.target.value)} type="text" placeholder="ID"/>
                <span>Повний ID замовлення</span>
            </div>
            <div>
                <input value={ttn} onChange={(e) => setTtn(e.target.value)} type="text"
                       placeholder="Номер ТТН"/>
                <span>Останні цифри або повністю ттн</span>
            </div>
            <div>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text"
                       placeholder="Номер телефону"/>
                <span>Останні цифри або повністю номер</span>
            </div>
            <div>
                <input value={productId} onChange={(e) => setProductId(e.target.value)} type="text"
                       placeholder="ID"/>
                <span>Повний ID товару в замовленні</span>
            </div>
            <div className={classes.filters_btns}>
                <button className="second_btn" onClick={ResetFilters}>Скинути</button>
                <button className="custom_btn" onClick={NavigateToFilters}>Показати</button>
            </div>
        </div>
    );
};

export default OrderFiltersModal;