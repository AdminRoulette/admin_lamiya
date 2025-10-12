import React, {useEffect, useState} from 'react';
import EditContentMenuModal from "@/pages/Blog/CreateArticle/components/ContentMenu/EditContentMenuModal";
import classes from "../../../blog.module.scss";

const ContentMenu = ({content_menu, setArticleInfo,language}) => {
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({});

    const ShowEditModal = ({text, link}) => {
        setEditData({text, link})
        document.body.style.overflow = 'hidden'
        setEditModal(true)
    };

    const CloseEditModal = () => {
        setEditData({})
        document.body.style.overflow = ''
        setEditModal(false)
    };

    const deleteContentName = async (key) => {
        const menuKey = language ? 'content_menu_ru' : 'content_menu';
        setArticleInfo(prev => {
            const newContextMenu = {...prev[menuKey]};
            delete newContextMenu[key];
            return {...prev, [menuKey]: newContextMenu}
        });
    }

    return (
        <div className={classes.content_menu_container}>
            {editModal &&
                <EditContentMenuModal editData={editData} setArticleInfo={setArticleInfo}
                                      closeModal={CloseEditModal} language={language}/>}
            <b>{language ?'Зміст російською':"Зміст"} (Редагувати за потреби останнім, бо оновлюється з текстом)</b>
            {Object.entries(content_menu).map(([text, link]) => {
                return (
                    <div key={text} className={classes.content_menu_item}>
                        <div className={classes.content_menu_item_info}>
                            <div>
                                {text}
                            </div>
                            <div>
                                Посилання: <b>{decodeURIComponent(link)}</b>
                            </div>
                        </div>
                        <div className={classes.content_menu_svg}>
                            <svg onClick={() => ShowEditModal({text: text, link: link})}
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path
                                    d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                                <path d="m15 5 4 4"/>
                            </svg>
                            <svg onClick={() => deleteContentName(text)} xmlns="http://www.w3.org/2000/svg" width="24"
                                 height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                <line x1="10" x2="10" y1="11" y2="17"/>
                                <line x1="14" x2="14" y1="11" y2="17"/>
                            </svg>
                        </div>
                    </div>
                )
            })}

        </div>
    );
};

export default ContentMenu;
