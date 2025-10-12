import React, {useContext} from 'react';
import classes from "@/pages/Product/productPage.module.scss";
import PriceSpace from "@/components/Functions/PriceSpace";
import addDevicetoBasket from "@/components/addDevicetoBasket";
import {toast} from "react-toastify";
import {Context} from "@/index";

const OptionItem = ({OptionsElem,deviceBasket}) => {
    const {user} = useContext(Context).user
    const adminProductToBasket = async (option) => {
        if(OptionsElem.stock) {
            window.scrollTo(0, 0);
            await addDevicetoBasket(option, deviceBasket).catch(error => {
                toast(error.message)
            })
        }
    };

    return (
        <div onClick={(e) => e.stopPropagation()} key={OptionsElem.id} className={`${classes.product_item_option}  ${!OptionsElem.stock ? classes.stock_out :""}`}>
            <div onClick={() => adminProductToBasket(OptionsElem)}
                 className={OptionsElem.saleprice ? classes.saleprice_block + ' ' + classes.product_item_option_content : classes.product_item_option_content}>
                <div onClick={(e) => {e.stopPropagation();adminProductToBasket(OptionsElem)}}
                     className={classes.option_pop + ' ' + classes.pop_up}>
                        <span
                            className="admin_blue_text">{OptionsElem.optionName} {OptionsElem.option} - {PriceSpace(OptionsElem.saleprice ? OptionsElem.saleprice : OptionsElem.price)} ₴</span>
                    <span className="admin_gray_text">Додати у кошик</span>
                </div>
                <div
                    className={`${classes.price} ${OptionsElem.saleprice ? classes.saleprice_sale:""}`}>
                    {OptionsElem.optionName} {OptionsElem.option} - {PriceSpace(OptionsElem.saleprice ? OptionsElem.saleprice : OptionsElem.price)} грн
                    {OptionsElem.count !== 0 ? ` (${OptionsElem.count} шт)` : ""}
                    {user.role?.includes("ADMIN") && OptionsElem.active_code ? ` (${OptionsElem.active_code})` : ""}
                </div>
            </div>
        </div>
    );
};

export default OptionItem;