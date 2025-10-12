import React, {useContext, useEffect, useState} from 'react';
import classes from "../../../blog.module.scss";
import {getProducts, getProductsInfo} from "@/http/blogApi";
import CustomTextArea from "@/components/customTextArea";
import {createRoot} from "react-dom/client";
import SingleProduct from "@/pages/Blog/CreateArticle/components/ProductPreview/SingleProduct";
import SliderProducts from "@/pages/Blog/CreateArticle/components/ProductPreview/SliderProducts";
import {Context} from "@/index";
import {toast} from "react-toastify";

const AddProduct = ({type,setProductDesc,productDesc,setProductIdList,productIdList}) => {
    const [productList, setProductList] = useState([]);
    const [filterProductList, setFilterProductList] = useState([]);
    const [productName, setProductName] = useState("");
    const {deviceBasket} = useContext(Context);

    useEffect(() => {
        if(productIdList.length > 0) {
            const productsElem = document.querySelector('#prevId');
            getProductsInfo(productIdList,false).then(infoProducts => {
                if (type) {
                    const info = infoProducts[0];
                    const root = createRoot(productsElem);
                    root.render(<SingleProduct info={info} desc={productDesc} deviceBasket={deviceBasket}/>);
                } else if (!type) {
                    const root = createRoot(productsElem);
                    root.render(<SliderProducts infoProducts={infoProducts} deviceBasket={deviceBasket}/>);
                }
            }).catch((error) => {
                toast.error(error.response?.data.message)
            })
        }
    }, [productIdList]);

    const chooseProduct = async (product) => {
        if(type){
            setProductIdList([product.id])
        }else{
            setProductIdList(prev => [...prev,product.id])
        }
        setProductName("")
        setFilterProductList([])
        setProductList([])
    };

    const productOnChange = async (value) => {
        setProductName(value)
        if(value.length > 2) {
            getProducts(value).then((productElems) => {
                setProductList(productElems);
                setFilterProductList(productElems);
            })
        }
    };

    return (
        <div className={classes.blog_new_product}>
            {type && <CustomTextArea onChange={(event)=>setProductDesc(event.target.value)}
                            maxLength={1000} placeholder={"Опис товара"} value={productDesc}/>}
            <div className={classes.product_input_drop}>
                <div className="input_row">
                    <label>
                        <input className={classes.product_input} value={productName}
                               onChange={(e) => productOnChange(e.target.value)} placeholder="" type="text" maxLength="100"/>
                        <span className="text_field_placeholder">Вкажіть назву товару</span>
                        {productList.length > 0
                            ? <div className={classes.product_drop_down}>
                                {filterProductList.map((deviceElem,index) => {
                                    return (<div key={index} title={deviceElem.name}
                                                 onClick={() => chooseProduct(deviceElem)}
                                                 className={classes.product_dropDown_item}>{deviceElem.name}</div>)
                                })}
                            </div>
                            : <div></div>}
                    </label>
                    <p>Можна вказати ід, серію, назву чи бренд</p>
                </div>

                <div className="product_add_prev" id='prevId'></div>
            </div>
        </div>
    );
};

export default AddProduct;