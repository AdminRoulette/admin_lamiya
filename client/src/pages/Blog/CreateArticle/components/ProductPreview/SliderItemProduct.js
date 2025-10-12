import React, {useState} from 'react';
import PriceSpace from "@/components/Functions/PriceSpace";
import addDevicetoBasket from "@/components/addDevicetoBasket";
import {PROD_URL} from "@/utils/constants";

const SliderItemProduct = ({info,deviceBasket}) => {
    const [inCart, setInCart] = useState(deviceBasket.deviceBaskets.some(product => product.deviceoptionId === info.id));

    const addToBasket = async () => {
        await addDevicetoBasket(info.options[0], deviceBasket).then(() => {
            setInCart(true)
        });
    }

    return (
        <li key={info.id} className="slider_product_container">
            <a target="_blank" href={`${PROD_URL}/product/${info.link}`} className="slider_img">
                <img alt={info.name} src={info.options[0].image}/>
            </a>
            <div className="slider_product_name">
                <a target="_blank" href={`${PROD_URL}/product/${info.link}`}>{info.name}
                </a>
                <div className="blog_product_series">{info.series}</div>
            </div>
            <div className="slider_product_price">
                <span>{PriceSpace(info.options[0].price)} грн</span>
                {inCart?
                    <button disabled
                            className="disable_option_btn slider_product_buy in_cart_btn">
                        <svg
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <g strokeWidth={0}/>
                            <g strokeLinecap="round" strokeLinejoin="round"/>
                            <path
                                d="M18.22 17H9.8a2 2 0 0 1-2-1.55L5.2 4H3a1 1 0 0 1 0-2h2.2a2 2 0 0 1 2 1.55L9.8 15h8.42L20 7.76a1 1 0 0 1 2 .48l-1.81 7.25A2 2 0 0 1 18.22 17m-1.72 2a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5m-5 0a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5m3.21-9.29 4-4a1 1 0 1 0-1.42-1.42L14 7.59l-1.29-1.3a1 1 0 0 0-1.42 1.42l2 2a1 1 0 0 0 1.42 0"
                                style={{
                                    fill: "#0D9049",
                                }}
                            />
                        </svg>
                    </button>:
                    <button onClick={addToBasket} className="custom_btn slider_product_buy">Купити</button>}
            </div>
        </li>
    );
};

export default SliderItemProduct;