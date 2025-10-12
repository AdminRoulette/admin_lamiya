import React from 'react';
import classes from "@/pages/Blog/PreviewPage/article.module.scss";
import FaqItem from "@/pages/Blog/PreviewPage/components/FaqItem";

const FaqBlock = ({faq}) => {
    return (
        <div className={classes.block_container}>
            <div className={classes.article_title}>Питання та відповіді</div>
            {faq && <div className={classes.faq_block} itemScope="" itemType="https://schema.org/FAQPage">
                {Object.entries(faq).map(([question,answer]) => {
                    return (<FaqItem question={question} answer={answer}/>)
                })}
            </div>}
        </div>
    );
};

export default FaqBlock;