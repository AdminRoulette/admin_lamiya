import React, {useEffect, useState} from 'react';
import classes from "@/pages/Supply/supply.module.scss";
import {toast} from "react-toastify";
import {addProductToSupply, editProductToSupply, getSupplyLongInfo} from "@/http/supplysApi";

const SupplyProductOption = ({product, option, productsListInSupply}) => {
    const findProduct = productsListInSupply.find(item => item.option_id === option.id)
    const [addCount, setAddCount] = useState(findProduct ? findProduct.count : null);
    const [price, setPrice] = useState(findProduct ? findProduct.price : option?.startPrice);
    const [sell_price, setSell_price] = useState(findProduct ? findProduct.sell_price : option?.price);
    const [market_price, setMarket_price] = useState(findProduct ? findProduct.market_price : option?.marketPrice);
    const [isChanged, setIsChanged] = useState(false);
    const [inSupply, setInSupply] = useState(!!findProduct)

    const addProductSupply = async () => {
        if (!inSupply && price && addCount && addCount > 0) {
            await addProductToSupply({option_id: option.id, price, count: addCount, sell_price, market_price}).then(() => {
                setIsChanged(false);
                setInSupply(true)
            }).catch(error => {
                toast(error.response.data.message)
            });
        } else {
            toast("Вкажіть ціну та кількість")
        }
    };

    const editProductSupply = async () => {
        if (inSupply && price && addCount && addCount > 0) {
            await editProductToSupply({option_id: option.id, price, count: addCount, sell_price, market_price}).then(() => {
                setIsChanged(false);
            }).catch(error => {
                toast(error.response.data.message)
            });
        } else {
            toast("Вкажіть ціну та кількість")
        }
    };

    return (
        <div className={classes.supply_product_option}>
            <div>
                <img alt={product.name} src={option.image}/>
                <div>Опція: <b>{option.optionName}</b></div>
                <div>В наявності: <b><u>{option.count} шт</u></b></div>
                <div>Продано за 60 днів: <b>{option.sell_count} шт</b></div>
                <div>Закупка: <b>{option.startPrice} ₴</b></div>
                <div>Продаж: <b>{option.price} ₴</b></div>
                {option.marketPrice && <div>Маркет: <b>{option.marketPrice} ₴</b></div>}

            </div>
            <div>
                <label className="input_with_placeholder">
                    <input value={price || null} type="text" maxLength="100"
                           placeholder=""
                           onChange={(e) => {
                               setIsChanged(true);
                               setPrice(e.target.value)
                           }}/>
                    <span className="input_field_placeholder">Закупка</span>
                </label>
                <label className="input_with_placeholder">
                    <input value={addCount || null} type="text" maxLength="100"
                           placeholder=""
                           onChange={(e) => {
                               setIsChanged(true);
                               setAddCount(e.target.value)
                           }}/>
                    <span className="input_field_placeholder">{`Кількість ${(option.count < option.sell_count / 2) ? `(${Math.ceil(option.sell_count / 2 - option.count)})` : ""}`}</span>
                </label>
                <label className="input_with_placeholder">
                    <input value={sell_price || null} type="text" maxLength="100"
                           placeholder=""
                           onChange={(e) => {
                               setIsChanged(true);
                               setSell_price(e.target.value)
                           }}/>
                    <span
                        className="input_field_placeholder">Нова ціна ({Math.floor(price * 1.20)}-{Math.floor(price * 1.35)})</span>
                </label>
                <label className="input_with_placeholder">
                    <input value={market_price || null} type="text" maxLength="100"
                           placeholder=""
                           onChange={(e) => {
                               setIsChanged(true);
                               setMarket_price(e.target.value)
                           }}/>
                    <span
                        className="input_field_placeholder">Маркет (мін:{Math.floor(price * 1.18 > 5000 ? price * 1.18 * 0.895
                        : price * 1.18 > 2600 ? price * 1.18 * 0.928 : price * 1.18 > 600 ? price * 1.18 * 0.982:price * 1.18)})</span>
                </label>
                {inSupply
                    ? isChanged ? <button onClick={editProductSupply} className="second_btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                <path d="M3 3v5h5"/>
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                                <path d="M16 16h5v5"/>
                            </svg>
                        </button>
                        : <button className="second_btn">
                            <svg width={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M18.22 17H9.8a2 2 0 0 1-2-1.55L5.2 4H3a1 1 0 0 1 0-2h2.2a2 2 0 0 1 2 1.55L9.8 15h8.42L20 7.76a1 1 0 0 1 2 .48l-1.81 7.25A2 2 0 0 1 18.22 17m-1.72 2a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5m-5 0a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5m3.21-9.29 4-4a1 1 0 1 0-1.42-1.42L14 7.59l-1.29-1.3a1 1 0 0 0-1.42 1.42l2 2a1 1 0 0 0 1.42 0"
                                    style={{
                                        fill: "#0d9049",
                                    }}
                                />
                            </svg>
                        </button>
                    : <button onClick={addProductSupply} className="custom_btn">Додати</button>}
            </div>
        </div>
    );
};

export default SupplyProductOption;