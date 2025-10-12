import React, {useState} from 'react';
import classes from "@/pages/Blog/blog.module.scss";
import {toast} from "react-toastify";
import AddProduct from "@/pages/Blog/CreateArticle/components/BlogProductModal/addProduct";

const BlogProductModal = ({closeModal, setText, textAreaRef}) => {
    const [type, setType] = useState(true);
    const [productIdList, setProductIdList] = useState([]);
    const [productDesc, setProductDesc] = useState("");

    const addProducts = async () => {
        if (!productIdList) {
            toast.error("Додайте товар")
        } else {
            const textarea = textAreaRef.current;
            const start = textarea.selectionStart;
            const wrappedText = `<div><div class="blog_product_list" data-products="${productIdList}" data-type="${type?"single":"slider"}" data-desc="${productDesc}"/></div>`;

            textarea.value = textarea.value.substring(0, start) + wrappedText + textarea.value.substring(start);
            const event = new Event('input', {bubbles: true});
            setText(textarea.value);
            textarea.dispatchEvent(event);
            closeModal()
        }
    }

    return (
        <div className="modal_main">
            <div id="close_cart" onClick={() => closeModal()} className="modal_bg"/>
            <div className={"modal_container"}>
                <div className="modal_header">
                    <div>Додати товар</div>
                    <svg id="close_cart" onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className={"modal_body" + " " + classes.product_modal_body}>
                    <div className={classes.product_ratio_container}>
                        <div>
                            <span>Один товар з описом</span>
                            <input name="delivery"
                                   id="np" type="radio" onChange={() => {setType(!type)}}
                                   checked={type}/>
                        </div>

                        <div>
                            <span>Товари в колесі</span>
                            <input name="delivery"
                                   id="np" type="radio" onChange={() => {setType(!type)}}
                                   checked={!type}/>
                        </div>
                    </div>
                    <AddProduct type={type} productDesc={productDesc} setProductDesc={setProductDesc}
                                setProductIdList={setProductIdList} productIdList={productIdList}/>
                </div>
                <div className="modal_footer">
                    <button className='second_btn' onClick={() => closeModal()}>Закрити</button>
                    <button className='custom_btn' onClick={() => addProducts()}>Додати</button>
                </div>
            </div>
        </div>
    );
};

export default BlogProductModal;