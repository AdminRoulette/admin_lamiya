import React, {useEffect} from 'react';
import "../../../PreviewPage/article.scss"
import addDevicetoBasket from "@/components/addDevicetoBasket";
import SliderItemProduct from "@/pages/Blog/CreateArticle/components/ProductPreview/SliderItemProduct";

const SliderProducts = ({infoProducts,deviceBasket,prev}) => {


    useEffect(() => {
        if (infoProducts.length > 4) {
            const nextBtn = document.querySelector('.slider_next_btn');
            nextBtn.style.display = "flex"
        }
    }, [infoProducts]);

    const nextProduct = async () => {
        const slider = document.querySelector('.slider_line');
        const regex = /translate3d\(([^,]+),/;
        const value = Number(slider.style.transform.match(regex)[1].replace("%", ""));
        let multiplier = window.screen.width < 951 ? 100 : 25;
        const newPosition = +value - multiplier;
        if (newPosition / -multiplier === infoProducts.length - (window.screen.width < 951 ? 1 :4)) {
            const nextBtn = document.querySelector('.slider_next_btn');
            nextBtn.style.display = "none"
        }
        const prevBtn = document.querySelector('.slider_prev_btn');
        if (prevBtn.style.display !== "flex") {
            prevBtn.style.display = "flex"
        }
        slider.style.transform = `translate3d(${newPosition}%, 0, 0)`
    }

    const prevProduct = async () => {
        const slider = document.querySelector('.slider_line');
        const regex = /translate3d\(([^,]+),/;
        const value = Number(slider.style.transform.match(regex)[1].replace("%", ""));
        let multiplier = window.screen.width < 951 ? 100 : 25;
        const newPosition = +value + multiplier;
        if (newPosition === 0) {
            const prevBtn = document.querySelector('.slider_prev_btn');
            prevBtn.style.display = "none"
        }
        if (newPosition / -300 < infoProducts.length + 4) {
            const nextBtn = document.querySelector('.slider_next_btn');
            if (nextBtn.style.display !== "flex") {
                nextBtn.style.display = "flex"
            }
        }
        slider.style.transform = `translate3d(${newPosition}%, 0, 0)`
    }
    return (
        <div className="blog_slider_product">
            <div onClick={prevProduct} className="slider_prev_btn slider_btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7"/>
                    <path d="M19 12H5"/>
                </svg>
            </div>
            <div className="slider_line_container">
                <ul style={{
                    transform: `translate3d(${infoProducts.length > 3 || prev ? "0" : (4 - infoProducts.length) * 12.5}%, 0, 0)`,
                }} className="slider_line">
                    {infoProducts.map((product) => {
                        return (
                            <SliderItemProduct info={product} deviceBasket={deviceBasket}/>
                        )
                    })}
                </ul>
            </div>
            <div className="slider_next_btn slider_btn">
                <svg onClick={nextProduct} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                </svg>
            </div>
        </div>
    );
};

export default SliderProducts;