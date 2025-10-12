import React from 'react';
import classes from "../Checkout.module.scss";
import {UKR_EXPRESS, UKR_STANDART} from "@/utils/constants";

const UkrPostType = ({postMethod,language,changePostType}) => {

    return (
        <div className={classes.choose_post_type}>
            <div onClick={(e)=>changePostType(UKR_EXPRESS,e)} className={classes.delivery_input}>
                <input type="radio" onChange={()=>{}} checked={postMethod === UKR_EXPRESS}/>
                {language ? "Экспресс" : "Експрес"}</div>
            <div onClick={(e)=>changePostType(UKR_STANDART,e)} className={classes.delivery_input}>
                <input type="radio" onChange={()=>{}} checked={postMethod === UKR_STANDART}/>
                {language ? "Стандарт" : "Стандарт"}</div>
        </div>
    );
};

export default UkrPostType;