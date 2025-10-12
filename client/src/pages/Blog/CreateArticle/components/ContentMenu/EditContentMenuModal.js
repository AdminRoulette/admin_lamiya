import React, {useEffect, useState} from 'react';
import classes from "@/pages/Blog/blog.module.scss";

const EditContentMenuModal = ({closeModal,setArticleInfo,editData,language}) => {
    const [link, setLink] = useState(editData.link?editData.link:"");
    const [text, setText] = useState(editData.text?editData.text:"");

    useEffect(() => {
        setLink(editData.link?editData.link:"")
        setText(editData.text?editData.text:"")
    }, [editData]);

    const editContentName = async () => {
        const menuKey = language ? 'content_menu_ru' : 'content_menu';
        setArticleInfo(prev => {
            const newContextMenu = {...prev[menuKey]};
            delete newContextMenu[editData.text];
            newContextMenu[text] = link;
            return {...prev, [menuKey]: newContextMenu}
        });
            closeModal()
    }

    return (
        <div className="modal_main">
            <div id="close_cart" onClick={() => closeModal()} className="modal_bg"/>
            <div className={"modal_container"}>
                <div className="modal_header">
                    <div>Редагувати зміст</div>
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
                            <input placeholder="" value={text} onChange={(e) => setText(e.target.value)} type="text"
                                   maxLength="255"/>
                            <span className="text_field_placeholder">Назва у змісті</span>
                        </label>
                        <p></p>
                    </div>
                    <div className="input_row">
                        <label>
                            <input disabled placeholder="" value={decodeURIComponent(link)} onChange={(e) => setLink(e.target.value)} type="text"
                                   maxLength="255"/>
                            <span className="text_field_placeholder">Посилання</span>
                        </label>
                        <p></p>
                    </div>
                </div>
                <div className="modal_footer">
                    <button className='second_btn' onClick={() => closeModal()}>Закрити</button>
                    <button className='custom_btn' onClick={() => editContentName()}>Додати</button>
                </div>
            </div>
        </div>
    );
};


export default EditContentMenuModal;