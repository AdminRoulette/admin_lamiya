import React, {useState} from 'react';
import classes from "@/pages/Blog/blog.module.scss";
import {toast} from "react-toastify";

const TikTokModal = ({closeModal, setText, textAreaRef}) => {
    const [link, setLink] = useState("");

    const addTikTokVideo = async () => {
        const splitLink = link.split('/')
        if(splitLink[splitLink.length -2] !== 'video' || isNaN(Number(splitLink[splitLink.length -1]))){
            toast.error("Невірний формат відео")
        }else{
            const textarea = textAreaRef.current;
            const start = textarea.selectionStart;
            const videoId = link.split('/')
            const wrappedText = `<div class="blog_tiktok"><div><blockquote class="tiktok-embed"
                        cite="${link}"
                        data-video-id="${videoId[videoId.length - 1]}"
                        style="width:320px; -webkit-border-radius:8px">
                <section>
                    <div>Завантажуємо</div>
                </section>
            </blockquote></div></div>`;

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
                    <div>Додати Тік-Ток відео</div>
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
                            <span className="text_field_placeholder">Посилання Тік-ток</span>
                        </label>
                        <p>Максимум 255 символів! <u>Формат: "https://www.tiktok.com/@lamiya.com.ua/video/7380833539379498245"</u></p>
                    </div>
                </div>
                <div className="modal_footer">
                    <button className='second_btn' onClick={() => closeModal()}>Закрити</button>
                    <button className='custom_btn' onClick={() => addTikTokVideo()}>Додати</button>
                </div>
            </div>
        </div>
    );
};

export default TikTokModal;