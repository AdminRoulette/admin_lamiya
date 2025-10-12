import React, {useEffect, useState} from 'react';
import {getOptionForEditOrder, getProductList, getStockHistory} from "@/http/Product/deviceAPI";
import classes from "@/pages/Product/productPage.module.scss";
import {toast} from "react-toastify";
import {getArticlesList} from "@/http/blogApi";

const HistoryOptionSelect = ({setOption,options}) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue("")
    }, [options]);

    const setInputValueOnSelect = async (option) => {
        setValue(option.optionName)
        setOption(option)
    };
    const clearValue = async () => {
        setValue("")
        setOption(null)
    };

    return (
        <div className={classes.product_info_dropdowns}>
            <div className={classes.product_input_drop}>
                <div style={{width:"100%",margin:"0"}}>
                    <input placeholder='Назва опції' value={value} type="text" maxLength={50}/>
                    {options?.length > 0 &&
                        <div className={classes.product_drop_down}>
                            <div key={'clear'}
                                 onClick={clearValue}
                                 className={classes.product_dropDown_item}>Очистити значення</div>
                            {options.map((item) => {
                                return (<div key={item.id}
                                             onClick={() => setInputValueOnSelect(item)}
                                             className={classes.product_dropDown_item}>{item.optionName}</div>)
                            })}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default HistoryOptionSelect;