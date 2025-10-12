import React, {useState} from 'react';
import classes from "../seoPage.module.scss";
import {seoCreate, seoEdit} from "@/http/seoAPI";
import {toast} from "react-toastify";
import CustomTextArea from "@/components/customTextArea";


const SeoEdit = ({type, seoElem, onHide, setSeoList,setFilterList}) => {
    const [url, setUrl] = useState(seoElem?.url ? seoElem.url : "");
    const [title, setTitle] = useState(seoElem?.title ? seoElem.title : "");
    const [desc, setDesc] = useState(seoElem?.desc ? seoElem.desc : "");
    const [keywords, setKeywords] = useState(seoElem?.keywords ? seoElem.keywords : "");
    const [article, setArticle] = useState(seoElem?.article ? seoElem.article : "");
    const [header, setHeader] = useState(seoElem?.header ? seoElem.header : "");

    const closeModal = () => {
        const modal = document.getElementById('modalId');
        if (modal) {
            modal.classList.add('closingModal');
            window.setTimeout(() => {
                onHide();
            }, 480);
        } else {
            onHide();
        }
        document.body.style.overflow = '';
    }
    const edit = async () => {
        if (type === 'edit') {
            await seoEdit({id: seoElem.id, url, title, desc, keywords, article,header}).then((date) => {
                closeModal();
                setSeoList(list => list.map((seoItem) => {
                    if (seoItem.id === seoElem.id) {
                        return ({
                            article: article,
                            id: seoElem.id,
                            desc: desc,
                            title: title,
                            keywords: keywords,
                            url: url
                        })
                    } else {
                        return {...seoItem}
                    }
                }))
            }).catch(error =>{
                toast(error.message)
            })
        } else {
            await seoCreate({url, title, desc, keywords, article,header}).then((date) => {
                setFilterList([])
                setSeoList(list => [date, ...list]);
                closeModal();
            }).catch(error =>{
                toast(error.message)
            })
        }

    }

    return (
        <div className="modal_main" id='modalId'>
            <div onClick={() => closeModal()} className="modal_bg"/>
            <div className={"modal_container"  + " " +  classes.modal_container_seo}>
                <div className="modal_header">
                    <div>Редагування</div>
                    <svg onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className={"modal_body" + ' ' + classes.modal_body_seo}>
                    <div>
                        <b>URL:</b>
                        <div className={classes.url_text}><span>https://lamiya.com.ua</span>
                        <input type="text" maxLength={255} placeholder="/url" value={url}
                               onChange={(e) => setUrl(e.target.value)}/>
                        </div>
                    </div>
                    <div>
                        <b>Title:</b>
                        <textarea className={classes.short_textarea} maxLength={255} placeholder="title" value={title}
                                  onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    <div>
                        <b>Заголовок h1(Тільки якщо потрібно кастомний):</b>
                        <textarea className={classes.short_textarea} maxLength={255} placeholder="" value={header}
                                  onChange={(e) => setHeader(e.target.value)}/>
                    </div>
                    <div>
                        <b>Keywords:</b>
                        <textarea className={classes.short_textarea} maxLength={999} placeholder="keywords" value={keywords}
                                  onChange={(e) => setKeywords(e.target.value)}/>
                    </div>
                    <div>
                        <b>Description:</b>
                        <textarea className={classes.long_textarea} maxLength={999} placeholder="Description" value={desc}
                                  onChange={(e) => setDesc(e.target.value)}/>
                    </div>
                    <div className={classes.article_container}>
                        <b>Article:</b>
                        <CustomTextArea onChange={(event)=>setArticle(event.target.value)}
                                        maxLength={9999} placeholder={"article"} value={article}/>
                    </div>
                    <div className={classes.footer}>
                        <button className={"second_btn"} onClick={() => closeModal()}>
                            <span>Закрити</span>
                        </button>
                        <button className="custom_btn" onClick={edit}>
                            <span>Редагувати</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeoEdit;
