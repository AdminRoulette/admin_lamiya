import React from 'react';
import classes from "../productPage.module.scss"
import {getLongProductInfo, OpenAnalogueBottle} from "@/http/Product/deviceAPI";
import {toast} from "react-toastify";

const ProductBotInfo = ({deviceElem, openDisc}) => {
    
    return (
        <>
            {openDisc ?
                <div className={classes.product_info_cont}>
                    {deviceElem?.country &&
                        <div><div><b>Країна</b></div><div>{deviceElem?.country}</div></div>}
                    {deviceElem.filters.map(filter => {
                        return <div><div><b>{filter.name}</b></div><div>{filter.values.map(value => value.name).join(', ')}</div></div>
                    })}

                    {deviceElem?.disc ? <div className={classes.product_info_d}><b>Опис аромату:</b>
                        <div dangerouslySetInnerHTML={{__html: `${deviceElem.disc}`}}></div>
                    </div> : <></>}

                    {deviceElem.bodycarepart?.applicationmethod ? <div className={classes.product_info_n}>
                        <div><b>Застосування:</b> {deviceElem.bodycarepart?.applicationmethod}</div>
                    </div> : <></>}

                    {deviceElem.bodycarepart?.activecomponents ?
                        <div className={classes.product_info_t}><b>Активні компоненти:</b>
                            <div dangerouslySetInnerHTML={{__html: `${deviceElem.bodycarepart.activecomponents}`}}></div>
                        </div> : <></>}

                    {deviceElem.bodycarepart?.composition
                        ? <div className={classes.product_info_s}><b>Склад:</b> {deviceElem.bodycarepart?.composition}
                        </div> : <></>}
                </div>
                : <></>}
        </>
    );
};

export default ProductBotInfo;
