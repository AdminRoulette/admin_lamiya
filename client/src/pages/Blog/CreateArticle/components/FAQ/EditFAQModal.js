import React, {useEffect, useState} from 'react';
import classes from "@/pages/Blog/blog.module.scss";
import CustomTextArea from "@/components/customTextArea";

const EditFaqModal = ({closeModal, editModal, setArticleInfo, language}) => {
    const [question, setQuestion] = useState(editModal.data.question ? editModal.data.question : "");
    const [text, setText] = useState(editModal.data.answer ? editModal.data.answer : "");

    const EditFaq = async () => {
        const faqKey = language ? 'faq_ru' : 'faq';
        setArticleInfo(prev => {
            const newFAQMenu = {...prev[faqKey]};
            if(editModal.isEdit){
                delete newFAQMenu[editModal.data.question];
            }
            newFAQMenu[question] = text;
            return {...prev, [faqKey]: newFAQMenu}
        });
        closeModal()
    }

    return (
        <div className="modal_main">
            <div id="close_cart" onClick={() => closeModal()} className="modal_bg"/>
            <div className={"modal_container"}>
                <div className="modal_header">
                    <div>{editModal.isEdit ? "Редагувати зміст" : "Додати питання"}</div>
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
                            <input placeholder="" value={question}
                                   onChange={(e) => setQuestion(e.target.value)} type="text"
                                   maxLength="255"/>
                            <span className="text_field_placeholder">Питання</span>
                        </label>
                        <p></p>
                    </div>
                    <div className="input_row">
                        <CustomTextArea onChange={(event) => setText(event.target.value)}
                                        maxLength={255} placeholder={"Відповідь"} value={text}/>
                    </div>
                </div>
                <div className="modal_footer">
                    <button className='second_btn' onClick={() => closeModal()}>Закрити</button>
                    <button className='custom_btn'
                            onClick={() => EditFaq()}>{editModal.isEdit ? "Редагувати" : "Додати"}</button>
                </div>
            </div>
        </div>
    );
};
export default EditFaqModal;