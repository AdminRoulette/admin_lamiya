import React, {useState} from 'react';
import classes from "@/pages/Supply/supply.module.scss";
import {toast} from "react-toastify";
import {deleteProductSupply, editProductToSupply} from "@/http/supplysApi";

const CreateSupplyProductItem = ({product,setProducts}) => {
    const [price, setPrice] = useState(product?.price || "");
    const [count, setCount] = useState(product?.count || "");
    const [sell_price, setSell_price] = useState(product.sell_price || "");
    const [market_price, setMarket_price] = useState(product.market_price || "");
    const [isChanged, setIsChanged] = useState(false);

    const editProduct = async () => {
        if(product.id && price && count) {
            await editProductToSupply({
                id: product.id,
                price,
                count,
                sell_price: sell_price ? sell_price : 0,
                market_price: market_price ? market_price : 0
            }).then(() => {
                setIsChanged(false)
            }).catch(error => {
                toast(error.response.data.message)
            });
        }else{
            toast("Вкажіть ціну і кількість")
        }
    };

    const DeleteProductById = async () => {
        await deleteProductSupply({id:product.id}).then((data) => {
            setProducts(prev => prev.filter(item => item.id !== product.id));
        }).catch(error => {
            toast(error.response.data.message)
        });
    };

    return (
        <div className={classes.supply_modal_product_item} key={product.name}>
            <img src={product.image} alt=""/>
            <div>{product.name}</div>
            <label className="input_with_placeholder">
                <input value={price} type="text" maxLength="100"
                       placeholder=""
                       onChange={(e) => {
                           setIsChanged(true);
                           setPrice(e.target.value)
                       }}/>
                <span className="input_field_placeholder">Ціна</span>
            </label>
            <label className="input_with_placeholder">
                <input value={count} type="text" maxLength="100"
                       placeholder=""
                       onChange={(e) => {
                           setIsChanged(true);
                           setCount(e.target.value)
                       }}/>
                <span className="input_field_placeholder">Кількість</span>
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
            {isChanged ? <button onClick={editProduct} className="second_btn">
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
                    </button>}
            <span onClick={DeleteProductById}
                  className="material-symbols-outlined">delete</span>
        </div>
    );
};

export default CreateSupplyProductItem;