import React from 'react';
import classes from "@/pages/Product/productPage.module.scss";

const ProductNames = ({OnChangeDevice,deviceInfo}) => {
    return (
        <div className={classes.product_name}>
            <div>
                <b>Назва:</b>
                <input
                    maxLength={254}
                    type="text"
                    className={!deviceInfo.name && classes.red_input}
                    placeholder="Назва товару"
                    value={deviceInfo.name || ''}
                    onChange={(event) => OnChangeDevice(event.target.value, 'name', 255)}
                />
            </div>
            <div>
                <b>RU Назва:</b>
                <input
                    maxLength={254}
                    type="text"
                    className={!deviceInfo.name_ru && classes.red_input}
                    placeholder="RU Назва товару"
                    value={deviceInfo.name_ru || ''}
                    onChange={(event) => OnChangeDevice(event.target.value, 'name_ru', 499)}
                />
            </div>
        </div>
    );
};

export default ProductNames;