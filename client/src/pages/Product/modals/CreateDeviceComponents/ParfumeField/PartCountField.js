import React from "react";
import classes from "../../../productPage.module.scss";
import {toast} from "react-toastify";
import GenerateOnTabOption from "@/pages/Product/modals/components/GenerateOnTabOption";


const PartCountField = ({parfumePart,setParfumePart, setOptions}) => {

    const OnChangeParfumePart = (value, field, length) => {
        if (typeof value === 'string' && value.length > length) {
            value = value.slice(0, length);
        }
        setParfumePart(prev => ({...prev, [field]: value}))
    }

    const calculateOnTabOptions = () => {
        if (!parfumePart.on_tab_price) {
            toast.error("Ціна за мл невірна")
            return;
        }
        setOptions(prev => prev.map((option) => {
            if (option.optionName === '3 мл' && option.sell_type === "on_tab") {
                const newValues = GenerateOnTabOption(3, +parfumePart.on_tab_price);
                return {
                    ...option,
                    ...newValues
                };
            } else if (option.optionName === '5 мл' && option.sell_type === "on_tab") {
                const newValues = GenerateOnTabOption(5, +parfumePart.on_tab_price);
                return {
                    ...option,
                    ...newValues
                };
            } else if (option.optionName === '10 мл' && option.sell_type === "on_tab") {
                const newValues = GenerateOnTabOption(10, +parfumePart.on_tab_price);
                return {
                    ...option,
                    ...newValues
                };
            } else {
                return option;
            }
        }))
    };

    return (
        <div>
            <div>
                <b>У флаконі мл:</b>
                <input style={{height: "30px"}}
                       maxLength={15}
                       placeholder="У флаконі мл"
                       type="text"
                       value={parfumePart.partcount}
                       onChange={(event) =>
                           OnChangeParfumePart(event.target.value, "partcount")
                       }
                />
            </div>
            <div>
                <b>Розпив мл:</b>
                <input style={{height: "30px"}}
                       maxLength={15}
                       placeholder="Розпив мл"
                       type="text"
                       value={parfumePart.refund_count}
                       onChange={(event) =>
                           OnChangeParfumePart(event.target.value, "refund_count")
                       }
                />
            </div>
            <div className={classes.product_on_tab_block}>
                <div>
                    <b>Ціна закупки за 1 мл розпива:</b>
                    <input style={{height: "30px"}}
                           maxLength={15}
                           placeholder="Ціна закупки"
                           type="text"
                           value={parfumePart.on_tab_price}
                           onChange={(event) =>
                               OnChangeParfumePart(event.target.value, "on_tab_price", 255)
                           }
                    />
                </div>
                <button onClick={calculateOnTabOptions} className="second_btn">Розрахувати</button>
            </div>
        </div>
    );
};

export default PartCountField;
