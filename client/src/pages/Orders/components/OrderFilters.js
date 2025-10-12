import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import classes from "../adminOrder.module.scss"
import {ORDERS_ROUTE} from "@/utils/constants";
import OrderFiltersModal from "@/pages/Orders/components/OrderFiltersModal";

const OrderFilters = ({orderParam}) => {

    const [showFilters, setShowFilters] = useState(false);

    function CheckModalStatus (event) {
        event.stopPropagation();
        if(showFilters){
            setShowFilters(false);
        }else{
            setShowFilters(true);
        }
    }



    return (
        <div className={classes.admin_orders_filters_btn}>
            <button onClick={CheckModalStatus} className="second_btn">ФІЛЬТРИ</button>
            {showFilters && <OrderFiltersModal onHide={()=>setShowFilters(false)} orderParam={orderParam}/>}
        </div>
    );
};

export default OrderFilters;
