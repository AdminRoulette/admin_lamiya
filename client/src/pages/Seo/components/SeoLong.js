import React from 'react';
import classes from "@/pages/Seo/seoPage.module.scss";

const SeoLong = ({seoElem}) => {
    return (
        <div className={classes.longBLock}>
            <div><b>h1:</b> {seoElem.header}</div>
            <div><b>Title:</b> {seoElem.title}</div>
            <div><b>Description:</b> {seoElem.desc}</div>
            <div><b>Keywords:</b> {seoElem.keywords}</div>
            <div><b>Article:</b> {seoElem.article}</div>
        </div>
    );
};

export default SeoLong;