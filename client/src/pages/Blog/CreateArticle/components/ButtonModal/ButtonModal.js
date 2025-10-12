import React, {useState} from 'react';
import classes from "@/pages/Blog/blog.module.scss";

const ButtonModal = ({closeModal, setText, textAreaRef}) => {
    const [link, setLink] = useState("");
    const [buttonName, setButtonName] = useState("");

    const addButtonPost = async () => {
        const textarea = textAreaRef.current;
        const start = textarea.selectionStart;
        const wrappedText = `<div class="button_row"><a href="${link}" target="_blank"><button class="custom_btn">${buttonName}</button></a></div>`;

        textarea.value = textarea.value.substring(0, start) + wrappedText + textarea.value.substring(start);
        const event = new Event('input', {bubbles: true});
        setText(textarea.value);
        textarea.dispatchEvent(event);
        closeModal()
    }

    return (
        <div className="modal_main">
            <div id="close_cart" onClick={() => closeModal()} className="modal_bg"/>
            <div className={"modal_container"}>
                <div className="modal_header">
                    <div>Додати кнопку з посиланням</div>
                    <svg id="close_cart" onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className={"modal_body" + " " + classes.image_modal_body}>
                    <div className="input_row">
                        <label>
                            <input placeholder="" value={link} onChange={(e) => setLink(e.target.value)} type="text"
                                   maxLength="255"/>
                            <span className="text_field_placeholder">Посилання на сторінку</span>
                        </label>
                        <p>Максимум 255 символів!</p>
                    </div>
                    <div className="input_row">
                        <label>
                            <input placeholder="" value={buttonName} onChange={(e) => setButtonName(e.target.value)} type="text"
                                   maxLength="40"/>
                            <span className="text_field_placeholder">Текст кнопки</span>
                        </label>
                        <p>Максимум 40 символів!</p>
                    </div>
                </div>
                <div className="modal_footer">
                    <button className='second_btn' onClick={() => closeModal()}>Закрити</button>
                    <button className='custom_btn' onClick={() => addButtonPost()}>Додати</button>
                </div>
            </div>
        </div>
    );
};

export default ButtonModal;