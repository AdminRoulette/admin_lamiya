import React, {useState} from 'react';
import "../../../PreviewPage/article.scss"
import addDevicetoBasket from "@/components/addDevicetoBasket";
import {PROD_URL} from "@/utils/constants";

const SingleProduct = ({info, desc,deviceBasket}) => {
    const [inCart, setInCart] = useState(deviceBasket.deviceBaskets.some(product => product.deviceoptionId === info.id));
    const addToBasket = async () => {
        await addDevicetoBasket(info, deviceBasket).then(() => {
            setInCart(true)
        });
    }

    return (
        <div className="blog_solo_product">
            <div className="blog_product_img">
                <img alt={info.name} src={info.options[0].image}/>
            </div>
            <div className="solo_product_info">
                <div className="single_product_name_block">
                    <a className="blog_product_name" target="_blank" href={`${PROD_URL}/product/${info.link}`}>{info.name}</a>
                    <div className="blog_single_product_series">{info.series}</div>
                </div>
                <div>
                    <div className="blog_product_text" dangerouslySetInnerHTML={{__html: desc}}></div>
                </div>
                <div className="product_single_buy_btn">
                    {inCart?
                        <button disabled
                                className="disable_option_btn in_cart_btn">
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
                    <button onClick={addToBasket} className="custom_btn">Купити</button>}
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;