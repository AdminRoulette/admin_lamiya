import React, {useEffect, useState} from 'react';
import classes from "./Checkout.module.scss";
import NovaPoshtaCheckout
    from "@/pages/Orders/modals/CompleteOrder/TTNComponents/Delivery/NovaPost/novaPoshtaCheckout";
import {getDefaultCity} from "@/http/ExternalApi/addressesAPI";
import {NP_WAREHOUSE, PHYSICAL_STORE, UKR_EXPRESS} from "@/utils/constants";
import UkrPoshtaCheckout from "@/pages/Orders/modals/CompleteOrder/TTNComponents/Delivery/UkrPost/UkrPoshtaCheckout";

const DeliveryData = ({ language,changeDeliveryData, deliveryData, totalPrice}) => {

    const [defaultNpCityList, setDefaultNpCityList] = useState([]);
    const [defaultUkrCityList, setDefaultUkrCityList] = useState([]);

    useEffect(() => {
        getDefaultCity(language).then(list => {
            setDefaultNpCityList(list[0])
            setDefaultUkrCityList(list[1])
        })
    }, []);

    const OnClickRadio = (value) => {
        changeDeliveryData({postMethod: value});
    }

    return (
        <div className={classes.delivery_data} id="deliveryId">
            <div className={classes.delivery_h2}>Доставка</div>
            <div className={classes.input_delivery}>
                <div id="novaPoshtaInput" className={deliveryData.postMethod.startsWith('np') ? classes.active_delivery_block : classes.disable_delivery_block}>
                    <div className={classes.delivery_input_block} onClick={() => OnClickRadio(NP_WAREHOUSE)}>
                        <div  className={classes.delivery_input}>
                            <input type="radio" onChange={()=>{}} checked={deliveryData.postMethod.startsWith('np')}/>
                            <svg viewBox="0 0 24 24" width={20} height={20}>
                                <path
                                    d="m23.8 11.5-4.4-4.8c-.1-.1-.2-.2-.3-.2s-.1.1-.1.3v10.3c0 .2 0 .3.1.4.1 0 .2 0 .3-.1l4.4-4.9c.3-.3.3-.7 0-1M13.9 18v-4H10v4H7s-1 0 0 1.5c0 0 4 4.5 5 4.5s5-4.5 5-4.5c1-1.4 0-1.4 0-1.4zm0-12v4H10V6H7S6 6 7 4.5c0 0 4-4.5 5-4.5s5 4.5 5 4.5c1 1.4 0 1.4 0 1.4zm-9.4.6L.2 11.5c-.2.3-.2.7 0 .9l4.3 4.9c.1.1.2.1.3.1s.1-.1.1-.3V6.8c0-.2 0-.3-.1-.3 0 0-.1 0-.3.1"
                                    fill="red"
                                />
                            </svg>
                            {language ? "Новая почта" : "Нова пошта"}
                        </div>
                        {totalPrice > 799?<span className={classes.delivery_price_free}>{language ? "Бесплатно" : "Безкоштовно"}</span>
                            :<span className={classes.delivery_price}>Від 85 ₴</span>}
                    </div>
                    {deliveryData.postMethod.startsWith('np') ?
                        <NovaPoshtaCheckout language={language} changeDeliveryData={changeDeliveryData} deliveryData={deliveryData} defaultNpCityList={defaultNpCityList}/>
                        : <></>}
                </div>


                <div id="ukrPoshtaInput" className={deliveryData.postMethod.startsWith('ukr') ? classes.active_delivery_block : classes.disable_delivery_block}>
                    <div className={classes.delivery_input_block} onClick={() => OnClickRadio(UKR_EXPRESS)}>
                        <div  className={classes.delivery_input}>
                            <input type="radio" onChange={()=>{}} checked={deliveryData.postMethod.startsWith('ukr')}/>
                            <svg viewBox="0 0 37 50" width={20} height={20}>
                                <path
                                    xmlns="http://www.w3.org/2000/svg"
                                    d="m33.401 28.553-16.39-3.728c-4.224-.958-7.185-4.781-7.072-9.13.113-4.347 3.27-8.01 7.537-8.744 4.268-.734 8.458 1.663 10.006 5.725s.023 8.657-3.643 10.973a.229.229 0 0 0 .079.404l7.292 1.658a.45.45 0 0 0 .462-.167A15.99 15.99 0 0 0 33.431 9.26 15.86 15.86 0 0 0 19.962.026h-.68a18.13 18.13 0 0 0-16.3 9.664 18.29 18.29 0 0 0 1.139 18.977l14.583 20.92a.34.34 0 0 0 .55 0L33.61 29.106a.343.343 0 0 0-.21-.552"
                                    fill="#FFC627"
                                />
                            </svg>
                            {language ? "Укрпочта" : "Укрпошта"}</div>
                        {totalPrice > 799?<span className={classes.delivery_price_free}>{language ? "Бесплатно" : "Безкоштовно"}</span>
                            :<span className={classes.delivery_price}>Від 60 ₴</span>}
                    </div>
                    {deliveryData.postMethod.startsWith('ukr') ?
                        <UkrPoshtaCheckout defaultUkrCityList={defaultUkrCityList} language={language} changeDeliveryData={changeDeliveryData} deliveryData={deliveryData}/>
                        : <></>}
                </div>

                <div onClick={() => OnClickRadio(PHYSICAL_STORE)}
                     className={deliveryData.postMethod === PHYSICAL_STORE ? classes.active_delivery_block : classes.disable_delivery_block}>
                    <div className={classes.delivery_input_block}>
                        <div  className={classes.delivery_input}>
                            <input type="radio" onChange={()=>{}} checked={deliveryData.postMethod === PHYSICAL_STORE}/>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={25}
                                height={25}
                                viewBox="0 0 18.75 18.75">
                                <path d="M4.063 9.479v6.25h10.833v-1.354H6.667V10h6.458V8.646H6.667V4.583h8.229V3.229H4.063z" />
                            </svg>
                            {language ? "Самовывоз из магазина" : "Самовивіз з магазину"}</div>
                        <span className={classes.delivery_price_free}>{language ? "Бесплатно" : "Безкоштовно"}</span>
                    </div>
                    {deliveryData.postMethod === PHYSICAL_STORE ?
                        <div className={classes.payment_info}>
                            {language ? "Вы можете получить заказ в магазине Lamiya в городе Вольногорск"
                                : "Ви можете отримати замовлення в магазині Lamiya у місті Вільногірськ"}</div> : <></>}
                </div>
            </div>
        </div>
    );
};

export default DeliveryData;
