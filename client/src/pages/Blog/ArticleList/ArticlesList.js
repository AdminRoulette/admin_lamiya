import React, {useEffect, useState} from 'react';
import {getArticlesList} from "@/http/blogApi";
import classes from '../blog.module.scss'
import {useNavigate} from "react-router-dom";
import {BLOG_ROUTE, PROD_URL} from "@/utils/constants";

const ArticlesList = () => {
    const navigate = useNavigate();
    const [articlesList, setArticlesList] = useState([]);

    useEffect(() => {
        document.title = "Статті для блога";
        getArticlesList().then((articles) => {
            setArticlesList(articles);
        });
    }, []);


    return (
        <div className={classes.blog_container}>
            <div className={classes.create_article_button}>
                <button onClick={() => navigate(`${BLOG_ROUTE}/create`)} className="custom_btn">Написати статтю</button>
            </div>
            {articlesList.map((article) => {
                return (
                    <div key={article.id} className={classes.blog_list_item}>
                        <div className={classes.blog_img_block}>
                            <img alt={article.header} src={article.image}/>
                            <div className={classes.svg_block}>
                                <div className={classes.svg_info}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                    {article.views_count}</div>
                                <div className={classes.svg_info}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                                        <path d="M8 12h.01"/>
                                        <path d="M12 12h.01"/>
                                        <path d="M16 12h.01"/>
                                    </svg>
                                    {article.comments_count}</div>
                                <div className={classes.svg_info}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                    <span>{article.read_time} хв</span>
                                </div>
                            </div>
                        </div>

                        <div className={classes.header_block}>
                            <a href={`/blog/preview/${article.link}`} className={classes.blog_list_header}>{article.header}</a>
                            <div>{article.sub_header}</div>
                            <div>Дата публікації: {new Date(article.createdAt).toLocaleString('uk-UA', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric'
                            })}</div>
                            <div>Категорія: <b>{article.blog_category.name}</b></div>
                            <a target="_blank" href={`${PROD_URL}${BLOG_ROUTE}/author/${article.blog_author.code}`}>Автор: <u>{article.blog_author.name}</u></a>
                            <div>Популярні: <b>{article.popular ? "Так" : "Ні"}</b></div>
                            <div>Опублікована: <b>{article.active ? "Так" : "Ні"}</b></div>
                        </div>
                        <div className={classes.author_svg_block}>
                            <div className={classes.author_svg} onClick={()=>{
                                navigate(`${BLOG_ROUTE}/edit/${article.link}`)
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <path
                                        d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                                    <path d="m15 5 4 4"/>
                                </svg>
                            </div>
                            <a className={classes.author_svg} href={`${PROD_URL}${BLOG_ROUTE}/${article.link}`} target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round" className="lucide lucide-external-link">
                                    <path d="M15 3h6v6"/>
                                    <path d="M10 14 21 3"/>
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                </svg>
                            </a>
                        </div>
                    </div>)
            })}
        </div>
    );
};

export default ArticlesList;