import React, {useEffect, useState} from 'react';
import classes from "@/pages/Supply/supply.module.scss";
import {toast} from "react-toastify";
import {getSupplyLongInfo} from "@/http/supplysApi";

const SupplyLongInfo = ({id}) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getSupplyLongInfo(new URLSearchParams({id})).then((data) => {
            setProducts(data);
        }).catch(error => {
            toast(error.response.data.message)
        });
    }, []);

    return (
        <div className={classes.supply_long_container}>
            {products.map((product) => {
                return (
                    <div className={classes.supply_long_item}>
                        <img alt={product.name} src={product.image}/>
                        <div>{product.name}</div>
                        <div>{product.price} ₴</div>
                        <div>{product.count} шт</div>
                    </div>
                )
            })}
        </div>
    );
};

export default SupplyLongInfo;