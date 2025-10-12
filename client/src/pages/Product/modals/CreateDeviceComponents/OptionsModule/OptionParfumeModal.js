import React, {useState} from 'react';
import classes_product from "../../../productPage.module.scss";
import {toast} from "react-toastify";
import GenerateOnTabOption from "@/pages/Product/modals/components/GenerateOnTabOption";

const OptionParfumeModal = ({closeModal, setOptions}) => {
    const [price, setPrice] = useState("");
    const [volume, setVolume] = useState("");

    const addProperty = async () => {
        const newValues3 = GenerateOnTabOption(3, +price/+volume);
        const newValues5 = GenerateOnTabOption(5, +price/+volume);
        const newValues10 = GenerateOnTabOption(10, +price/+volume);
        if (price && volume) {

            setOptions(prev => [...prev, {optionName_ru: `3 мл`,
                optionName: `3 мл`,
                weight: `3`,
                saleprice: `0`,
                count: `0`,
                id: `new_${Math.floor(Date.now() / 1000) + 1}`,
                index: 0,
                code: '',
                sell_type:"on_tab",
                marketPromoPrice: 0,
                marketOldPrice: 0,
                deviceimages:[],
                ...newValues3
            }, {optionName_ru: `5 мл`,
                optionName: `5 мл`,
                weight: `5`,
                saleprice: `0`,
                count: `0`,
                id: `new_${Math.floor(Date.now() / 1000) + 2}`,
                index: 1,
                code: '',
                sell_type:"on_tab",
                marketPromoPrice: 0,
                marketOldPrice: 0,
                deviceimages:[],
                ...newValues5
            }, {optionName_ru: `10 мл`,
                optionName: `10 мл`,
                weight: `10`,
                saleprice: `0`,
                count: `0`,
                id: `new_${Math.floor(Date.now() / 1000) + 3}`,
                index: 2,
                code: '',
                sell_type:"on_tab",
                marketPromoPrice: 0,
                marketOldPrice: 0,
                deviceimages:[],
                ...newValues10
            }
            ]);
            closeModal()
        } else {
            toast.error("Заповніть обидва поля")
        }
    };

    return (<div className={"modal_main" + " " + classes_product.option_parfume_modal}>
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
            <div className={"modal_body" + " " + classes_product.option_parfume_body}>
                <div className="input_row">
                    <label>
                        <input placeholder="" value={price}
                               onChange={(e) => setPrice(Number(e.target.value) ? e.target.value : "")} type="text"
                               maxLength="7"/>
                        <span className="text_field_placeholder">Ціна закупки флакона</span>
                    </label>
                    <p>Числове значення в грн</p>
                </div>
                <div className="input_row">
                    <label>
                        <input placeholder="" value={volume}
                               onChange={(e) => setVolume(Number(e.target.value) ? e.target.value : "")} type="text"
                               maxLength="7"/>
                        <span className="text_field_placeholder">Об'єм флакона</span>
                    </label>
                    <p>Числове значення в мл</p>
                </div>
            </div>
            <div className="modal_footer">
                <button className='second_btn' onClick={() => closeModal()}>Закрити</button>
                <button className='custom_btn' onClick={() => addProperty()}>Додати</button>
            </div>
        </div>
    </div>);
};

export default OptionParfumeModal;
