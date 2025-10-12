import React, {useContext, useEffect, useState} from "react";
import {Minus, Plus, Trash2} from 'lucide-react';
import {useNavigate} from "react-router-dom"
import {ChangeCount, deleteDeviceFromBasket} from "@/http/basketApi";
import {runInAction} from "mobx";
import classes from '../Cart.module.scss';
import {toast} from "react-toastify";
import {Context} from "@/index";
import PriceSpace from "@/components/Functions/PriceSpace";
import {PRODUCT_ROUTE} from "@/utils/constants";

const CartItem = ({deviceBaskElem, closeModal, index}) => {

    const {deviceBasket, user} = useContext(Context);
    const [deviceCount, setDeviceCount] = useState(deviceBaskElem.count);
    const navigate = useNavigate();

    useEffect(() => {
        setDeviceCount(deviceBaskElem.count);
    }, [deviceBaskElem.count])

    const Delete = async (id) => {
        if (user.isAuth) {
            await deleteDeviceFromBasket(id).then(async () => {
                runInAction(async () => {
                    await deviceBasket.setDeleteItemDeviceBasket(id);
                })
                window.dataLayer = window.dataLayer || [];

                function gtag() {
                    window.dataLayer.push(arguments);
                }

                let itemsList = [];
                itemsList.push({
                    item_id: deviceBaskElem.gtin,
                    item_name: deviceBaskElem.name,
                    discount: deviceBaskElem.saleprice > 0 ? deviceBaskElem.price - deviceBaskElem.saleprice : 0,
                    item_brand: deviceBaskElem.brand,
                    item_category: deviceBaskElem.category,
                    item_variant: deviceBaskElem.option,
                    price: deviceBaskElem.price,
                    quantity: deviceBaskElem.count
                })
                gtag("event", "remove_from_cart", {
                    items: itemsList
                });
            }).catch(error => {
                toast(error.message)
            });
        } else {
            let storageData = JSON.parse(localStorage.getItem("cart"));
            for (let i = 0, len = storageData.length; i < len; i++) {
                if (storageData[i].deviceoptionId === id) {
                    storageData.splice(i, 1);
                    await deviceBasket.setDeleteItemDeviceBasket(id);
                    break;
                }
            }
            localStorage.setItem("cart", JSON.stringify(storageData));
        }
    };

    const plusCount = async (value) => {
        if (value >= 1) {
                await ChangeCount({optionId: deviceBaskElem.deviceoptionId, count: value}).then((res) => {
                    if (res.error || res.error === 0) {
                        toast(`Недостатня кі-сть, в наявності: ${res.error}`)
                    } else {
                        setDeviceCount(value);
                        runInAction(async () => {
                            await deviceBasket.ChangeDeviceBasketCount({
                                deviceoptionId: deviceBaskElem.deviceoptionId,
                                count: 1
                            });
                        })
                    }
                }).catch(error => {
                    toast(error.message)
                })

        }
    };

    const minusCount = async (value) => {
        if (value >= 1) {
                await ChangeCount({optionId: deviceBaskElem.deviceoptionId, count: value}).then((res) => {
                    if (res.error || res.error === 0) {
                        toast(`Недостатня кі-сть, в наявності": ${res.error}`)
                    } else {
                        setDeviceCount(value);
                        runInAction(async () => {
                            await deviceBasket.ChangeDeviceBasketCount({
                                deviceoptionId: deviceBaskElem.deviceoptionId,
                                count: -1
                            });
                        })
                    }
                }).catch(error => {
                    toast(error.message)
                })
        }
    };

    const goToDevicePage = async (id, e) => {
        e.preventDefault();
        closeModal();
        navigate(`${PRODUCT_ROUTE}/${id}`)
    };

    function onError(e) {
        e.target.src =
            "https://lamiya.s3.eu-central-1.amazonaws.com/MinorImages/ErrorDevice.jpg";
    }

    return (
        <div className={classes.card_body_container} id={`mainBody${index}`} key={deviceBaskElem.id}>
            <div className={classes.img_block}>
                <img className={classes.card_img} onError={(e) => onError(e)}
                     alt={deviceBaskElem.name}
                     title={deviceBaskElem.name}
                     src={deviceBaskElem.img}/>
            </div>
            <div className={classes.name_block}>
                <a href={`/`}
                   //href={`${DEVICE_ROUTE}/${deviceBaskElem.deviceId}/${deviceBaskElem.deviceoptionId}`}
                   className={classes.cart_name}
                   onClick={(e) => goToDevicePage(deviceBaskElem.deviceId, e)}
                   title={deviceBaskElem.name}
                >
                    {deviceBaskElem.name}
                </a>
                <div className={classes.cart_series}
                     title={deviceBaskElem.series}>
                    {deviceBaskElem.series}
                </div>

            </div>
            <div className={classes.product_count_cont}>
                <div className={classes.product_count_block}>
                    <div className={classes.stepper_input}>
                        <div
                            className={deviceCount === 1 ? `${classes.minus_btn_disable} ${classes.minus_btn}` : classes.minus_btn}
                            onClick={(e) => {
                                minusCount(deviceCount - 1)
                                e.preventDefault();
                            }}>
                            <Minus/>
                        </div>
                        <div className={classes.stepper_input__content}>
                            <div className={classes.stepper_input__input}>{deviceCount}</div>
                        </div>
                        <div className={classes.plus_btn} onClick={(e) => {
                            plusCount(deviceCount + 1)
                            e.preventDefault();
                        }}>
                            <Plus/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.cart_price}>
                {deviceBaskElem.saleprice === 0
                    ? <>
                        {PriceSpace(deviceBaskElem.price * deviceCount)} ₴
                    </>
                    : <>
                            <span
                                className={classes.old_price}>{PriceSpace(deviceBaskElem.price * deviceCount)} ₴</span>
                        <span
                            className={classes.sale_price}>{PriceSpace(deviceBaskElem.saleprice * deviceCount)} ₴</span>
                    </>}
            </div>
            <div onClick={() => Delete(deviceBaskElem.deviceoptionId)} className={classes.delete_button}>
                <Trash2 stroke={deviceBaskElem.stock ? "#343434" : "#ff0909"} strokeWidth="1.5"/>
            </div>
            {!deviceBaskElem.stock ?
                <div className={classes.cart_stock_out}><span>Немає в наявності</span></div> : <></>}
        </div>
    );

};

export default CartItem;
