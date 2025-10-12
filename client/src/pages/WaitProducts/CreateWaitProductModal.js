import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import {addWaitProduct, editWaitProducts, getUserWishList, getWaitProducts} from "@/http/waitProductApi";
import classes from "./WaitProduct.module.scss"

const CreateWaitProductModal = ({onHide, setAdminWaitList, waitModal}) => {
    const [productInput, setProductInput] = useState(waitModal.product ? waitModal.product : "");
    const [placeInput, setPlaceInput] = useState(waitModal.place ? waitModal.place : "");
    const [waitType, setWaitType] = useState(waitModal.type ? waitModal.type : "Косметика");

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

    const addWaitList = async () => {
        if (productInput.length > 2 && placeInput.length > 2) {
            if (waitModal.status === "edit") {
                await editWaitProducts({id: waitModal.id, product: productInput, place: placeInput,type:waitType}).then((res) => {
                    closeModal();
                    setAdminWaitList(prev =>
                        prev.map((prevElem) => {
                            if(prevElem.id === waitModal.id){
                               return {...prevElem,product: productInput, place: placeInput,type:waitType}
                            }else{
                                return {...prevElem}
                            }
                        }))
                }).catch(error => {
                    toast.error(error.response.data.message)
                })
            } else {
                await addWaitProduct({product: productInput, place: placeInput,type:waitType}).then((res) => {
                    closeModal();
                    setAdminWaitList((prev) => {
                        const updatedList = [...prev, res];

                        return updatedList.sort((a, b) => {
                            const typeA = a.type || '';
                            const typeB = b.type || '';
                            return typeA.localeCompare(typeB, 'uk');
                        });
                    });
                }).catch(error => {
                    toast.error(error.response.data.message)
                })
            }
        } else {
            toast.error("Заповніть поля")
        }
    }

    return (
        <div className="modal_main">
            <div onClick={() => closeModal()} className="modal_bg"/>
            <div className='modal_container'>
                <div className="modal_header">
                    <div>{waitModal.status === 'edit' ? "Редагувати очікування" : "Додати в лист очікування"}</div>
                    <svg onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className="modal_body">
                    <div className={classes.wait_modal_inputs}>
                        <select
                            value={waitType}
                            multiple={false}
                            onChange={(event) => {
                                setWaitType(event.target.value)
                            }}
                        >
                            <option value="Косметика">Косметика</option>
                            <option value="Оригінали">Оригінали</option>
                            <option value="Залишки">Залишки</option>
                            <option value="Аналоги">Аналоги</option>

                        </select>
                        <div>
                            <b>Назва товару</b>
                            <input maxLength={254} onChange={(e) => setProductInput(e.target.value)} type="text"
                                   value={productInput}/>
                        </div>
                        <div>
                            <b>Кто і де чекає?</b>
                            <input maxLength={254} onChange={(e) => setPlaceInput(e.target.value)} type="text"
                                   value={placeInput}/>
                        </div>
                    </div>
                    <div className={classes.wait_modal_btn}>
                        <button onClick={() => closeModal()} className="second_btn">Закрити</button>
                        <button onClick={() => addWaitList()}
                                className="custom_btn">{waitModal.status === 'edit' ? "Редагувати" : "Додати в лист"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateWaitProductModal;
