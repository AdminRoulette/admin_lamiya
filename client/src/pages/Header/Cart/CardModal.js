import React, {useContext, useEffect, useRef} from 'react';
import CartItem from "./Components/CartItem";
import {observer} from "mobx-react";
import {ArrowLeft} from "lucide-react";
import classes from "./Cart.module.scss";
import {Context} from "@/index";
import PriceSpace from "@/components/Functions/PriceSpace";
import {barcodeToBasket} from "@/http/basketApi";
import {toast} from "react-toastify";
import {CreateOrder} from "@/http/Order/ordersApi";
import {ORDERS_ROUTE} from "@/utils/constants";
import {useNavigate} from "react-router-dom";

const CardModal = observer(({onHide}) => {
    const {deviceBasket} = useContext(Context);
    const navigate = useNavigate();
    const ref = useRef(null);
    useEffect(() => {
        document.addEventListener('keypress', handleKeyPress);
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, []);

    let TotalSum = 0;
    let barcode = '';
    let interval;

    function handleKeyPress(event) {
        if (interval) {
            clearTimeout(interval);
        }
        barcode += event.key;
        interval = setTimeout(async () => {
            if (barcode) {
                await barcodeToBasket(barcode).then(async basket => {
                    if(basket.type === 'create'){
                        await deviceBasket.addDeviceBasket({option:basket.option, count:1});
                    }else{
                        await deviceBasket.ChangeDeviceBasketCount({deviceoptionId:basket.id,count:1});
                    }
                }).catch(error => {
                    toast(error.response.data.message)
                }).finally(() => {
                    barcode = '';
                })
            }
        }, 200);
    }

    const closeModal = () => {
        const modal = document.getElementById('modalId');
        if (modal) {
            modal.classList.add('closingModal');
            window.setTimeout(() => {
                onHide();
            }, 480);
        } else {
            onHide();
        }
        document.body.style.overflow = '';
    }

    const AnimationCreateOrder = async () => {
            ref.current.disabled = true;
            await CreateOrder().then(() => {
                deviceBasket.setDeviceBaskets([]);
                ref.current.disabled = false;
                navigate(`${ORDERS_ROUTE}/new`);
                closeModal()
            }).catch((error) => {
                toast.error(error.response.data.message);
            })
    }

    return (
        <div className="modal_main" id='modalId'>
            <div id="close_cart" onClick={() => closeModal()} className="modal_bg"/>
            <div className={"modal_container" + " " + classes.cart_container}>
                <div className="modal_header">
                    <div>Кошик</div>
                    <svg id="close_cart" onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className="modal_body">
                    {deviceBasket.deviceBaskets?.length > 0
                        ? <>
                            <div>
                                {deviceBasket.deviceBaskets.map((deviceBaskElem, index) => {
                                    if (deviceBaskElem.saleprice > 0) {
                                        TotalSum += deviceBaskElem.saleprice * deviceBaskElem.count;
                                    } else {
                                        TotalSum += deviceBaskElem.price * deviceBaskElem.count;
                                    }
                                    return (<CartItem index={index} key={index} closeModal={closeModal}
                                                      deviceBaskElem={deviceBaskElem}/>)
                                })}
                            </div>

                            <div className={classes.card_footer}>
                                <div className={classes.card_footer_btns}>
                                    <button className={"second_btn" + " " + classes.close_cart_btn}
                                            onClick={() => closeModal()}>
                                        <span><ArrowLeft/>Продовжити покупки</span>
                                    </button>
                                    <div className={classes.next_step_btn}>
                                <span className={classes.total_price}>
                                    <div className={classes.card_sum}>Разом:</div>
                                    {PriceSpace(TotalSum)} ₴</span>
                                    </div>
                                    <button ref={ref} className="custom_btn"
                                            onClick={() => AnimationCreateOrder()}>Створити замовлення
                                    </button>
                                </div>
                            </div>
                        </>
                        :
                        <div className={classes.empty_basket_block}>
                            <div className={classes.empty_basket}>Кошик порожній
                            </div>
                            <button id="close_cart" className={"second_btn" + " " + classes.close_cart_btn}
                                    onClick={() => closeModal()}>
                                <span><ArrowLeft/>Продовжити покупки</span>
                            </button>
                        </div>}
                </div>
            </div>
        </div>
    );
});

export default CardModal;
