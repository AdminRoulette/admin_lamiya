import React, {useRef, useState} from 'react';
import { getWarehouseList} from "@/http/ExternalApi/addressesAPI";
import classes from "../Checkout.module.scss";
import UkrPostWarehouse from "@/pages/Orders/modals/CompleteOrder/TTNComponents/Delivery/UkrPost/UkrPostWarehouse";
import UkrPostCity from "@/pages/Orders/modals/CompleteOrder/TTNComponents/Delivery/UkrPost/UkrPostCity";
import UkrPostType from "@/pages/Orders/modals/CompleteOrder/TTNComponents/Delivery/UkrPost/UkrPostType";

const ukrPostCheckout = ({
                             language,
                             changeDeliveryData,
                             deliveryData,
                             defaultUkrCityList
                         }) => {

    const input_REGEXP = /^[а-яА-ЯЬьЮюЇїІіЄєҐґёЁыЫэЭъЪ'\s-?!,.]+$/;

    const changePostType = async (value, e) => {
        e.stopPropagation()
        changeDeliveryData({postMethod:value,warehouseRef: ""})
    };

    return (
        <div className={classes.poshta_container}>
            <UkrPostType postMethod={deliveryData.postMethod} changePostType={changePostType} language={language}/>
            <UkrPostCity defaultUkrCityList={defaultUkrCityList} input_REGEXP={input_REGEXP}
                         language={language} changeDeliveryData={changeDeliveryData} deliveryData={deliveryData}/>
            {deliveryData.cityRef.length > 0 && <UkrPostWarehouse language={language} changeDeliveryData={changeDeliveryData}  deliveryData={deliveryData}/>}
        </div>
    )

};

export default ukrPostCheckout;