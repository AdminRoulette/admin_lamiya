import React, {useState} from 'react';
import classes from "@/pages/Blog/blog.module.scss";

const InstagramModal = ({closeModal, setText, textAreaRef}) => {
    const [link, setLink] = useState("");

    const addInstagramPost = async () => {
        const textarea = textAreaRef.current;
        const start = textarea.selectionStart;
        const wrappedText = `<div class="blog_instagram"><div><blockquote
            class="instagram-media"
            data-instgrm-permalink="${link}"
            data-instgrm-version="12"
            style="background:#FFF; border:0; border-radius:8px;
             box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15);
             margin:1px; max-width:100%; min-width:326px;
              padding:0; width:99.375%; max-height:100%;">
            </blockquote></div></div>`;

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
                    <div>Додати інстаграм пост</div>
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
                            <span className="text_field_placeholder">Посилання на пост\профіль</span>
                        </label>
                        <p>Максимум 255 символів! <u>Формат: "https://www.instagram.com/p/C81cgaIM5my/"</u></p>
                    </div>
                </div>
                <div className="modal_footer">
                    <button className='second_btn' onClick={() => closeModal()}>Закрити</button>
                    <button className='custom_btn' onClick={() => addInstagramPost()}>Додати</button>
                </div>
            </div>
        </div>
    );
};

export default InstagramModal;