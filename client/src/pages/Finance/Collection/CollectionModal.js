import React, {useState} from 'react';
import {toast} from "react-toastify";
import classes from "../../Supply/supply.module.scss";
import {createCollection} from "@/http/financeApi";

const CollectionModal = ({onHide, setCollectionList}) => {
    const [cash, setCash] = useState(0);
    const [shopId, setShopId] = useState(0);
    const [comment, setComment] = useState("");

    const create = async () => {
        if (cash > 0 && shopId >= 0) {
            await createCollection({
                shop_id: shopId,
                cash_count: cash,
                comment
            }).then(collection => {
                setCollectionList(prev => [collection, ...prev]);
                closeModal();
            }).catch(error => {
                toast(error.message)
            })
        } else {
            toast.error(`Заповніть бренд, суму та назву поставки`);

        }
    }

    const closeModal = () => {
        const modal = document.getElementById('modalId');
        if (modal) {
            modal.classList.add('closingModal');
            window.setTimeout(() => {
                onHide();
            }, 500);
        } else {
            onHide();
        }
        document.body.style.overflow = '';
    }

    return (
        <div className="modal_main">
            <div onClick={() => closeModal()} className="modal_bg"/>
            <div className='modal_container'>
                <div className="modal_header">
                    <div>Додати інкасацію</div>
                    <svg onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className="modal_body">
                    <div className="custom-select">
                        <select value={shopId || ""}
                                onChange={(event) => setShopId(+event.target.value)}>
                            <option disabled value="">Оберіть магазин</option>
                            <option value={0}>м. Вільногірськ, 55</option>
                        </select>
                    </div>
                    <label className="input_with_placeholder">
                        <input value={cash} type="text" maxLength="100"
                               placeholder=""
                               onChange={(event) => setCash(Number(event.target.value) ? +event.target.value : "")}/>
                        <span className="input_field_placeholder">Сума інкасації</span>
                    </label>
                    <div>Коментар:
                        <textarea value={comment}
                                  onChange={(event) => setComment(event.target.value)}
                                  placeholder="Коментар"/></div>
                </div>
                <div className="modal_footer">
                    <button onClick={onHide} className="second_btn">Закрить</button>
                    <button onClick={create} className="custom_btn">Додати
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CollectionModal;