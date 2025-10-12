import React, {useState} from 'react';
import {Minus, Plus} from "lucide-react";
import {toast} from "react-toastify";
import classes from "../../adminOrder.module.scss";

const DeviceListinEditModal = ({OrderDevElem, setOrderDeviceList, orderDeviceList}) => {
    const [price, setPrice] = useState(OrderDevElem.price || "");
    const [salePrice, setSalePrice] = useState(OrderDevElem.saleprice || "");

    const deleteOrderDevice = async (id) => {
        let newDeviceList = orderDeviceList.filter(i => i.id !== id);
        setOrderDeviceList(newDeviceList);
    };

    const changePrice = async (id, price) => {
        if (Number(price)) {
            setPrice(price)
            setOrderDeviceList(prevState =>
                prevState.map(item => {
                        if (item.id === id) {
                            return {...item, price: Number(price)}
                        } else {
                            return item
                        }
                    }
                )
            )
        }
    };

    const changeSalePrice = async (id, saleprice) => {
        if (Number(saleprice)) {
            setSalePrice(saleprice)
            setOrderDeviceList(prevState =>
                prevState.map(item => {
                        if (item.id === id) {
                            return {...item, saleprice: Number(saleprice)}
                        } else {
                            return item
                        }
                    }
                )
            )
        }
    };

    const ChangeCounter = async (value, id) => {
        let count = 0;
        if (value === true) {
            if (OrderDevElem.count >= 1) {
                count = OrderDevElem.count + 1;
                setOrderDeviceList(prevState =>
                    prevState.map(item =>
                        item.id === id
                            ? {...item, count: count}
                            : item
                    )
                )
            }
        } else {
            if (OrderDevElem.count > 1) {
                count = OrderDevElem.count - 1;
                setOrderDeviceList(prevState =>
                    prevState.map(item =>
                        item.id === id
                            ? {...item, count: count}
                            : item
                    )
                )
            }
        }
    }
    return (
        <div className={classes.edit_order_product_block}>
            <div className={classes.edit_order_product_img}>
                <img alt={OrderDevElem.product_name} src={OrderDevElem.image}/>
            </div>
            <div className={classes.edit_order_product_info}>
                <div className={classes.edit_order_name}>
                    <div>{`${OrderDevElem.product_name}`}</div>
                    <span className="material-symbols-outlined"
                          onClick={() => deleteOrderDevice(OrderDevElem.id)}>delete</span>
                </div>
                <div className={classes.edit_order_product_body}>
                    <div className={classes.edit_order_price_block}>
                        <div>
                            <span>Ціна:</span>
                            <input className={classes.edit_order_price_input}
                                   onChange={(e) => changePrice(OrderDevElem.id, e.target.value.trim())}
                                   value={price} type="text"/>грн
                        </div>
                        <div>
                            <span>Акція:</span>
                            <input className={classes.edit_order_price_input}
                                   onChange={(e) => changeSalePrice(OrderDevElem.id, e.target.value.trim())}
                                   value={salePrice} type="text"/>грн
                        </div>
                    </div>
                    <div className={classes.stepper_input}>
                        <div className={classes.stepper_btn} onClick={() =>
                            ChangeCounter(false, OrderDevElem.id)}>
                            <Minus/>
                        </div>
                        <div className={classes.stepper_input_content}>
                            <div className={classes.stepper_input_input}>{OrderDevElem.count}</div>
                        </div>
                        <div className={classes.stepper_btn} onClick={() =>
                            ChangeCounter(true, OrderDevElem.id)}>
                            <Plus/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceListinEditModal;
