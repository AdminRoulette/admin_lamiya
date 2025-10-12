import React, {useEffect, useState} from 'react';
import EditFaqModal from "@/pages/Blog/CreateArticle/components/FAQ/EditFAQModal";
import classes from "../../../blog.module.scss";

const Faq = ({setArticleInfo,faq,language}) => {
    const [editModal, setEditModal] = useState({isOpen:false,data:{question:"",answer:""}});

    const ShowEditModal = ({answer,question,isEdit}) => {
        setEditModal({isOpen:true,isEdit,data:{question,answer}})
        document.body.style.overflow = 'hidden'
    };

    const CloseEditModal = () => {
        setEditModal({isOpen:false,data:{question:"",answer:""}})
        document.body.style.overflow = ''
    };


    return (
        <div className={classes.content_menu_container}>
            {editModal.isOpen && <EditFaqModal language={language} closeModal={CloseEditModal} editModal={editModal} setArticleInfo={setArticleInfo}/>}
            <b>{language ?'Питання та відповіді російською':"Питання та відповіді"}</b>
            <button onClick={()=>ShowEditModal({question:"",answer:"",isEdit:false})} className={"second_btn" +" "+ classes.faq_btn}>Додати питання</button>
            {Object.entries(faq).map(([question, answer]) =>{
                return (
                    <div key={question} className={classes.content_menu_item}>
                        <div className={classes.content_menu_item_info}>
                            <div>
                                Питання: {question}
                            </div>
                            <div>
                                Відповідь: <div  dangerouslySetInnerHTML={{__html: answer}}/>
                            </div>
                        </div>
                        <div onClick={()=>ShowEditModal({question:question,answer:answer,isEdit:true})}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path
                                    d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                                <path d="m15 5 4 4"/>
                            </svg>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default Faq;
