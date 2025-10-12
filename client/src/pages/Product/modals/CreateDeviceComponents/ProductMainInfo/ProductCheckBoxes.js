import React, {useContext} from 'react';
import classes from "@/pages/Product/productPage.module.scss";
import {Context} from "@/index";

const ProductCheckBoxes = ({deviceInfo,OnChangeDevice,setParfumePart,parfumePart, categories}) => {
    const {user} = useContext(Context);

    return (
        <div className={classes.product_edit_row}>
                <div className={classes.product_check_block}>
                    <b>Hit:</b>
                    <input type='checkbox' checked={deviceInfo.hit ? deviceInfo.hit : false}
                           onChange={(event) => OnChangeDevice(event.target.checked, 'hit')}/>

                </div>
                <div className={classes.product_check_block}>
                    <b>Ціна тижня:</b>
                    <input type='checkbox'
                           checked={deviceInfo.weekdiscount ? deviceInfo.weekdiscount : false}
                           onChange={(event) => OnChangeDevice(event.target.checked, 'weekdiscount')}/>
                </div>
                <div className={classes.product_check_block}>
                    <b>Активний?:</b>
                    <input disabled={user.user.email !== "qqalopruvet@gmail.com"} type='checkbox' checked={deviceInfo.active ? deviceInfo.active : false}
                           onChange={(event) => OnChangeDevice(event.target.checked, 'active')}/>
                </div>
        </div>
    );
};

export default ProductCheckBoxes;