import React, {useEffect, useState} from 'react';
import classes from "@/pages/Product/productPage.module.scss";

const ProductStatus = ({OnChangeDevice, deviceInfo}) => {
    const statusList = [
        {name: "Активний", value: "active"},
        {name: "Потрібна дія", value: "moderation"},
        {name: "Готовий до публікації", value: "ready"},
        {name: "Знятий з виробництва", value: "discontinued"},
        {name: "Прихований", value: "hidden"}
    ];
    const [value, setValue] = useState("");

    useEffect(() => {
        const name = statusList.find(status => status.value === deviceInfo.status)
        if(name) setValue(name.name)
    }, []);

    const setInputValueOnSelect = async (status) => {
        OnChangeDevice(status.value, "status", 255)
        setValue(status.name)
    };

    return (
        <div className={classes.product_info_dropdowns}>
            <div><b>Статус:</b></div>
            <div className={classes.product_input_drop}>
                <div style={{width: "100%"}}>
                    <input placeholder='Вкажіть статус' value={value} type="text" maxLength={254}/>
                    <div className={classes.product_drop_down}>
                        {statusList.map((statusElem) => {
                            return (<div key={statusElem.value}
                                         onClick={() => setInputValueOnSelect(statusElem)}
                                         className={classes.product_dropDown_item}>{statusElem.name}</div>)
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductStatus;