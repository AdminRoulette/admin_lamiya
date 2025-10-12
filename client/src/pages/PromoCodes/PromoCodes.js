import React, {useEffect, useState} from 'react';
import {getAllPromoCodes} from "@/http/promoCodesAPI";
import CreatePromo from "./components/CreatePromo";
import classes from "../Categories/moderation.module.scss";
import {toast} from "react-toastify";

const PromoCodes = () => {
    const [loading, setLoading] = useState(true);
    const [promoList, setPromoList] = useState([]);
    const [promoVisible, setPromoVisible] = useState(false);

    useEffect(() => {
        setLoading(true);
        getAllPromoCodes().then((PromoList) => {
            setPromoList(PromoList)
        }).catch(error => {
            toast(error.message)
        }).finally(()=>{
            setTimeout(() => setLoading(false), 100);
        })
        document.title = "Промо-коди"
    }, []);

    return (
        <div>
            <div className={classes.promo_list_btn}>
                <button className="custom_btn" onClick={() => {
                    setPromoVisible(true);
                    document.body.style.overflow = 'hidden';
                }}>Створити промокод
                </button>
            </div>
            <div className={classes.promo_list_container}>{promoList.map((promoElem) => {
                return (
                    <div
                        className={promoElem.count === 0 || new Date().getTime() > new Date(promoElem.expdate).getTime()
                            ? classes.promo_expire + ' ' + classes.promo_list_block : classes.promo_list_block}>
                        <div>{promoElem.code}</div>
                        <div>Знижка: {promoElem.sum}{promoElem.percent ? "%" : " грн"}</div>
                        <div>Кіл-сть: {promoElem.count}</div>
                        <div>Мін сума: {promoElem.minOrder}</div>
                        <div>Закіниться: {promoElem.expdate}</div>
                        <div>{promoElem.privacy ? "Приватний" : "Загальний"}</div>
                    </div>
                )
            })}</div>
            {promoVisible
                ? <CreatePromo
                    onHide={() => setPromoVisible(false)}/>
                : <></>}
        </div>
    );
};

export default PromoCodes;