import React from 'react';
import classes from '../../../productPage.module.scss';
import ProductBrand from "@/pages/Product/modals/CreateDeviceComponents/ProductMainInfo/ProductBrand";
import ProductCountry from "@/pages/Product/modals/CreateDeviceComponents/ProductMainInfo/ProductCountry";
import ProductNames from "@/pages/Product/modals/CreateDeviceComponents/ProductMainInfo/ProductNames";
import ProductStatus from "@/pages/Product/modals/CreateDeviceComponents/ProductMainInfo/ProductStatus";
import ProductCheckBoxes from "@/pages/Product/modals/CreateDeviceComponents/ProductMainInfo/ProductCheckBoxes";
import SeriesField from "@/pages/Product/modals/CreateDeviceComponents/SeriesField";

const ProductInfo = ({deviceInfo, OnChangeDevice, setParfumePart, parfumePart, categories}) => {

    return (<>
        <div className={classes.product_edit_row}>
            <ProductBrand deviceInfo={deviceInfo} OnChangeDevice={OnChangeDevice}/>
            {/*<ProductCountry deviceInfo={deviceInfo} OnChangeDevice={OnChangeDevice}/>*/}
            <ProductStatus deviceInfo={deviceInfo} OnChangeDevice={OnChangeDevice}/>
        </div>
        <ProductNames deviceInfo={deviceInfo} OnChangeDevice={OnChangeDevice}/>
        {/*<div className={classes.product_edit_row}>*/}
        {/*    <div className={classes.product_series}>*/}
        {/*        <SeriesField OnChangeDevice={OnChangeDevice} deviceInfo={deviceInfo}/></div>*/}
        {/*</div>*/}
        <ProductCheckBoxes deviceInfo={deviceInfo} OnChangeDevice={OnChangeDevice} categories={categories}
                           setParfumePart={setParfumePart} parfumePart={parfumePart}/>
    </>);
};

export default ProductInfo;
