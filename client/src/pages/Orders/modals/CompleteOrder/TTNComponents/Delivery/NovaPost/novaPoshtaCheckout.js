import React from 'react';
import classes from "../Checkout.module.scss";
import NovaPostType from "@/pages/Orders/modals/CompleteOrder/TTNComponents/Delivery/NovaPost/NovaPostType";
import NovaPostCity from "@/pages/Orders/modals/CompleteOrder/TTNComponents/Delivery/NovaPost/NovaPostCity";
import NovaPostWarehouse from "@/pages/Orders/modals/CompleteOrder/TTNComponents/Delivery/NovaPost/NovaPostWarehouse";
import {NP_DOOR} from "@/utils/constants";
import NovaPostDoor from "@/pages/Orders/modals/CompleteOrder/TTNComponents/Delivery/NovaPost/NovaPostDoor";

const NovaPoshtaCheckout = ({
                                language,
                                changeDeliveryData,
                                deliveryData,
                                defaultNpCityList
                            }) => {
    const input_REGEXP = /^[а-яА-ЯЬьЮюЇїІіЄєҐґёЁыЫэЭъЪ'\s-?!,.]+$/;

    const changePostType = async (value, e) => {
        e.stopPropagation()
        changeDeliveryData({postMethod:value,warehouseRef: ""})
    };

    return (
        <div className={classes.poshta_container}>
            <NovaPostType postMethod={deliveryData.postMethod} changePostType={changePostType} language={language}/>
            <NovaPostCity defaultNpCityList={defaultNpCityList} input_REGEXP={input_REGEXP}
                          language={language} changeDeliveryData={changeDeliveryData} deliveryData={deliveryData}
            />
            {deliveryData.cityRef.length > 0 ? deliveryData.postMethod === NP_DOOR ?
                    <NovaPostDoor language={language} changeDeliveryData={changeDeliveryData}  deliveryData={deliveryData} input_REGEXP={input_REGEXP}/>
                    :
                    <NovaPostWarehouse language={language} changeDeliveryData={changeDeliveryData}  deliveryData={deliveryData}/>
                : <></>}
        </div>)

};

export default NovaPoshtaCheckout;
