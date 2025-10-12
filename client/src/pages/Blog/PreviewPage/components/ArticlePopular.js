import React from 'react';
import {BLOG_ROUTE} from "@/utils/constants";
import classes from "../article.module.scss";

const ArticlePopular = ({article,navigate}) => {
    return (
        <div className={classes.popular_container}>
            <div className={classes.popular_title}><span>Популярні статті</span></div>
            <div className={classes.popular_items_list}>
                <div className={classes.popular_item}>
                    <img className={classes.popular_image} alt={article.header} src={article.image}/>
                    <div  className={classes.popular_text_container}>
                        <div className={classes.popular_tags}>{article.tags}</div>
                        <a className={classes.popular_header} href={`${BLOG_ROUTE}/${article.link}`}
                           onClick={(e) => {
                               e.preventDefault();
                               navigate(`${BLOG_ROUTE}/${article.link}`)
                           }}>{article.header}</a>
                        <div className={classes.popular_info}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <path
                                        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                                </svg>
                                {article.likes_count}</div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                {article.views_count}</div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                                <span>{article.read_time} хв</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticlePopular;