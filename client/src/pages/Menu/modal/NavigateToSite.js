import React from 'react';
import classes from "../adminMenu.module.scss";

const NavigateToSite = ({onHide}) => {

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

    const goToSite = () => {
        closeModal()
        window.location.href = 'https://lamiya.com.ua'
    }

    return (
        <div className="modal_main">
            <div onClick={() => closeModal()} className="modal_bg"/>
            <div className={'modal_container' +' '+ classes.navigate_modal_container}>
                <div className="modal_header">
                    <div>Перейти на головний сайт</div>
                    <svg onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className={"modal_body" +" "+ classes.navigate_modal_body}>
                    <button className="custom_btn" onClick={goToSite}>Перейти</button>
                    <button className="second_btn" onClick={()=>closeModal()}>Закрити</button>
                </div>
            </div>
        </div>
    );
};

export default NavigateToSite;