import React, {useState} from 'react';
import classes from "@/pages/Seo/seoPage.module.scss";
import SeoLong from "@/pages/Seo/components/SeoLong";
import SeoEdit from "@/pages/Seo/components/SeoEdit";

const SeoItem = ({seoElem,setSeoList}) => {
    const [showLongInfo, setShowLongInfo] = useState(false);
    const [showEdit, setShowEdit] = useState(false);


    const showLong = (value) => {
        setShowLongInfo(value)
    }

    const showEditModal = () => {
        setShowEdit(true)
        document.body.style.overflow = 'hidden';
    }

    return (
        <div className={classes.block}>
            {showEdit?<SeoEdit type={"edit"} setSeoList={setSeoList} seoElem={seoElem} onHide={() => setShowEdit(false)}/> : <></>}
            <div className={classes.shortInfo}>
                <div className={classes.svgBlock}>
                    <svg onClick={() => showLong(!showLongInfo)} xmlns="http://www.w3.org/2000/svg"
                         width="24" height="24" viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                    </svg>
                </div>
                <b>#{seoElem.id}</b>
                {seoElem.url.includes("{") ?
                    <div className={classes.url_text}><span>lamiya.com.ua</span>{seoElem.url.split("{")[0]}<b>{"{" + seoElem.url.split("{")[1]}</b></div> :
                    <div className={classes.url_text}><span>lamiya.com.ua</span>{seoElem.url}</div>}
                <div className={classes.svgBlock +' '+classes.edit_btn}>
                    <svg onClick={()=>showEditModal()} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                        <path d="m15 5 4 4"/>
                    </svg>
                </div>
                <a href={seoElem.url} target="_blank" className={classes.svgBlock +' '+classes.link_btn}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6"/>
                    <path d="M10 14 21 3"/>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                </svg>
                </a>
            </div>
            {showLongInfo ?
                <SeoLong seoElem={seoElem}/>
                : <></>}
        </div>
    );
};

export default SeoItem;