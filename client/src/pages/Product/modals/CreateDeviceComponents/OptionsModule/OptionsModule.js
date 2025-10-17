import React, {useContext} from "react";
import classes from '../../../productPage.module.scss';
import {Context} from "@/index";
import OptionCodes from "@/pages/Product/modals/CreateDeviceComponents/OptionsModule/components/OptionCodes";
import {toast} from "react-toastify";
import ImageBlock from "@/pages/Product/modals/CreateDeviceComponents/ImageModal/ImageBlock";

const OptionsModule = ({options, setOptions}) => {
    const {user} = useContext(Context);

    const changeInfo = (key, value, id) => {
        setOptions(options.map((item) => item.id === id ? {...item, [key]: value} : item));
    };

    const deleteNewOption = (id) => {
        if(id.toString().startsWith("new")){
            setOptions(options.filter((item) => item.id !== id));
        }else{
            toast("Опція не нова")
        }

    };
    return (<>
            {options.map((optionElem) => (
                <div className={classes.options_container}>
                    <div className={classes.option_card}>
                        <div className={classes.row}>
                            <div className={classes.options_id}>{optionElem.id.toString().startsWith("new") ? "Нова опція" : `ID: ${optionElem.id}`}</div>
                            {optionElem.id.toString().startsWith("new") && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                 onClick={() => {deleteNewOption(optionElem.id)}}
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                <path d="M3 6h18"/>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>}
                        </div>
                        <div className={classes.row}>
                            <label>
                                <input
                                    disabled={optionElem.sell_type === 'sell_bottle'}
                                    value={optionElem.optionName}
                                    onChange={(e) => changeInfo("optionName", e.target.value, optionElem.id)}
                                    placeholder="" type="text" maxLength="255"/>
                                <span className={classes.text_field_placeholder}>Назва опції (UA)</span>
                            </label>
                            <label>
                                <input
                                    disabled={optionElem.sell_type === 'sell_bottle'}
                                    value={optionElem.optionName_ru}
                                    onChange={(e) => changeInfo("optionName_ru", e.target.value, optionElem.id)}
                                    placeholder="" type="text" maxLength="255"/>
                                <span className={classes.text_field_placeholder}>Назва опції (RU)</span>
                            </label>
                            <label>

                                <input disabled={optionElem.sell_type === 'sell_bottle'}
                                       value={optionElem.weight}
                                       onChange={(e) => changeInfo("weight", e.target.value, optionElem.id)}
                                       placeholder="" type="number" maxLength="10"/>
                                <span className={classes.text_field_placeholder}>Вага (грам)</span>
                            </label>
                            <label>
                                <input
                                    value={optionElem.count}
                                    onChange={(e) => changeInfo("count", e.target.value, optionElem.id)}
                                    placeholder="" type="number" maxLength="10"/>
                                <span className={classes.text_field_placeholder}>К-сть</span>
                            </label>
                            <label>
                                <input value={optionElem.index}
                                       onChange={(e) => changeInfo("index", e.target.value, optionElem.id)}
                                       placeholder="" type="number" maxLength="10"/>
                                <span className={classes.text_field_placeholder}>Індекс</span>
                            </label>
                            <label>
                                <input
                                    value={optionElem.gtin}
                                    onChange={(e) => changeInfo("gtin", e.target.value, optionElem.id)}
                                    placeholder="" type="text" maxLength="255"/>
                                <span className={classes.text_field_placeholder}>GTIN</span>
                            </label>
                        </div>

                        <div className={classes.row}>
                            <label>
                                <input
                                    value={optionElem.startPrice}
                                    onChange={(e) => changeInfo("startPrice", e.target.value, optionElem.id)}
                                    placeholder="" type="number" maxLength="10"/>
                                <span className={classes.text_field_placeholder}>Закупка</span>
                            </label>
                            <label>
                                <input
                                    value={optionElem.price}
                                    onChange={(e) => changeInfo("price", e.target.value, optionElem.id)}
                                    placeholder="" type="number" maxLength="10"/>
                                <span className={classes.text_field_placeholder}>Ціна</span>
                            </label>
                            <label>
                                <input
                                    value={optionElem.saleprice}
                                    onChange={(e) => changeInfo("saleprice", e.target.value, optionElem.id)}
                                    placeholder="" type="number" maxLength="10"/>
                                <span className={classes.text_field_placeholder}>Знижка</span>
                            </label>
                            <label>
                                <input
                                    value={optionElem.marketPrice}
                                    onChange={(e) => changeInfo("marketPrice", e.target.value, optionElem.id)}
                                    placeholder="" type="number" maxLength="10"/>
                                <span className={classes.text_field_placeholder}>Маркет Ціна</span>
                            </label>
                            <label>
                                <input
                                    value={optionElem.marketOldPrice}
                                    onChange={(e) => changeInfo("marketOldPrice", e.target.value, optionElem.id)}
                                    placeholder="" type="number" maxLength="10"/>
                                <span className={classes.text_field_placeholder}>Маркет Стара Ціна</span>
                            </label>
                            <label>
                                <input
                                    value={optionElem.marketPromoPrice}
                                    onChange={(e) => changeInfo("marketPromoPrice", e.target.value, optionElem.id)}
                                    placeholder="" type="number" maxLength="10"/>
                                <span className={classes.text_field_placeholder}>Маркет Промо</span>
                            </label>
                        </div>
                        <div className={classes.row}>
                            <OptionCodes optionElem={optionElem} changeInfo={changeInfo}/>
                        </div>
                        <div className={classes.row}>
                            <div className={classes.product_img_block}>
                                <ImageBlock setOptions={setOptions} optionElem={optionElem}/>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
};

export default OptionsModule;
