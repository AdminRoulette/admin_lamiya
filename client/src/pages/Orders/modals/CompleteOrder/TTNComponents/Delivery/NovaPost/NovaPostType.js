import React from 'react';
import classes from "../Checkout.module.scss";
import {NP_DOOR, NP_POSTMACHINE, NP_WAREHOUSE} from "@/utils/constants";

const NovaPostType = ({postMethod,language,changePostType}) => {

    return (
        <div className={classes.choose_post_type}>
            <div onClick={(e)=>changePostType(NP_WAREHOUSE,e)} className={classes.delivery_input}>
                <input type="radio" onChange={()=>{}} checked={postMethod === NP_WAREHOUSE}/>
                {language ? "Отделение" : "Відділення"}</div>
            <div onClick={(e)=>changePostType(NP_POSTMACHINE,e)} className={classes.delivery_input}>
                <input type="radio" onChange={()=>{}} checked={postMethod === NP_POSTMACHINE}/>
                {language ? "Почтомат" : "Поштомат"}</div>
            <div onClick={(e)=>changePostType(NP_DOOR,e)} className={classes.delivery_input}>
                <input type="radio" onChange={()=>{}} checked={postMethod === NP_DOOR}/>
                {language ? "Курьер" : "Кур'єр"}</div>
        </div>
    );
};

export default NovaPostType;