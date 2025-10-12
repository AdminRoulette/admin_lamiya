import React, {useState} from 'react';
import classes from '../../Categories/moderation.module.scss';
import {createPromoCode} from "@/http/promoCodesAPI";
import {Shuffle} from "lucide-react";
import {toast} from "react-toastify";

const CreatePromo = ({onHide}) => {
    const [code, setCode] = useState("");
    const [privacy, setPrivacy] = useState(false);
    const [percent, setPercent] = useState(false);
    const [sum, setSum] = useState(0);
    const [count, setCount] = useState(0);
    const [minOrder, setMinOrder] = useState(0);
    const [expdate, setExpdate] = useState("");

    const addPromo = async () => {
        await createPromoCode({code, privacy, percent, sum, count, expdate,minOrder}).then(() => {
            setMinOrder(0);
            setExpdate("");
            setCount(0);
            setSum(0);
            setPercent(false);
            setPrivacy(false);
            setCode("");
            closeModal();
        }).catch(error => {
            toast(error.message)
        })
    }

    const GenerateCode = async () => {
        let charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let newCode = '';
        for (let i = 0, n = charset.length; i < 14; ++i) {
            if(i === 4 || i === 9){
                newCode += "-";
            }else{
                newCode += charset.charAt(Math.floor(Math.random() * n));
            }
        }
        setCode(newCode);
    }
    const closeModal = () => {
        const modal = document.getElementById('modalId');
        if (modal) {
            modal.classList.add('closingModal');
            window.setTimeout(() => {
                onHide();
            }, 500);
        }else{
            onHide();
        }
        document.body.style.overflow = '';
    }
    return (
        <div className="modal_main">
            <div onClick={() => closeModal()} className="modal_bg"/>
            <div className={'modal_container' +' '+ classes.brand_modal_container}>
                <div className="modal_header">
                    <div>Додати новий промокод</div>
                    <svg onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className={"modal_body" +" "+ classes.brand_modal_body}>
                    {/*<div className={classes.Promo_modal_checkboxBlock}>*/}
                    {/*    <label>Приватний</label>*/}
                    {/*    <input className={classes.Promo_modal-checkbox} value={privacy} onChange={() => {*/}
                    {/*        setPrivacy(!privacy)*/}
                    {/*    }} type="checkbox"/>*/}
                    {/*</div>*/}
                    <div className={classes.promo_modal_check_cont}>
                        <label>Валюта коду: % чи Грн?</label>
                        <input className={classes.promo_modal_check} value={percent} onChange={() => {
                            setPercent(!percent)
                        }} type="checkbox"/>
                    </div>
                    <div className={classes.promo_modal_block}>
                        <label>Промокод(меньше 25сим)</label>
                        <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Вкажіть промокод"
                               type="text"/>
                        <Shuffle onClick={()=>GenerateCode()} className={classes.promo_modal_roll_svg}/>
                    </div>

                    <div className={classes.promo_modal_block}>
                        <label>{percent ? `Сума знижки у %` : `Сума знижки в грн`}</label>
                        <input value={sum} onChange={(event) => setSum(event.target.value)} placeholder="Вкажіть суму"
                               type="text"/>
                    </div>
                    <div className={classes.promo_modal_block}>
                        <label>Кількість використань</label>
                        <input value={count} onChange={(event) => setCount(event.target.value)} placeholder="Вкажіть кількість"
                               type="text"/>
                    </div>
                    <div className={classes.promo_modal_block}>
                        <label>Мін. сума замовлення</label>
                        <input value={minOrder} onChange={(event) => setMinOrder(event.target.value)} placeholder="Вкажіть мінімальну суму"
                               type="text"/>
                    </div>
                    <div className={classes.promo_modal_block}>
                        <label>Дата закінчення дії</label>
                        <input value={expdate} onChange={(event) => setExpdate(event.target.value)}
                               placeholder="Вкажіть дату"
                               type="date"/>
                    </div>
                </div>
                <div className={classes.brand_modal_footer}>
                    <button className="second_btn" onClick={()=>closeModal()} >Закрити</button>
                    <button className="custom_btn" onClick={addPromo}
                            disabled={!(code.length > 4 && Number(sum) > 0 && Number(count) > 0 && expdate.length > 0)}
                    >Створити</button>
                </div>
            </div>
        </div>
    );
};

export default CreatePromo;