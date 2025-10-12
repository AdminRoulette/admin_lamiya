import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getArticle, getProductsInfo} from "@/http/blogApi";
import SingleProduct from "@/pages/Blog/CreateArticle/components/ProductPreview/SingleProduct";
import SliderProducts from "@/pages/Blog/CreateArticle/components/ProductPreview/SliderProducts";
import {createRoot} from "react-dom/client";
import {toast} from "react-toastify";
import Loader from "@/components/Loader/Loader";
import {BLOG_ROUTE} from "@/utils/constants";
import {Context} from "@/index";
import {getSeo} from "@/http/seoAPI";
import CommentBlock from "@/pages/Blog/PreviewPage/components/CommentBlock";
import BlogShare from "@/pages/Blog/PreviewPage/components/BlogShare";
import './article.scss'
import classes from "./article.module.scss";
import FaqBlock from "@/pages/Blog/PreviewPage/components/FaqBlock";


const PreviewPage = () => {
    const {link} = useParams();
    const {deviceBasket, user, language} = useContext(Context);
    const [article, setArticle] = useState("");
    const [loading, setLoading] = useState(true);
    const dateOptions = {day: '2-digit', month: '2-digit', year: 'numeric'};
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true)
        getSeo(window.location.href).then((seo) => {

        });
        getArticle(link, false).then((articleRes) => {
            setArticle(articleRes)
            // let blog = document.createElement("script");
            // blog.type = "application/ld+json";
            // let BlogData = {
            //     "@context": "https://schema.org",
            //     "@type": "Article",
            //     "@id": `https://lamiya.com.ua${BLOG_ROUTE}/${articleRes.link}`,
            //     "headline": `${articleRes.header}`,
            //     "image": [`${articleRes.main_image}`],
            //     "author": {
            //         "@type": "Person",
            //         "name": `${articleRes.blog_author.name}`,
            //         "url": `https://lamiya.com.ua${BLOG_ROUTE}/author/${articleRes.blog_author.code}`
            //     },
            //     "wordCount": `${articleRes.word_count}`,
            //     "commentCount": `${articleRes.comments}`,
            //     "inLanguage": "uk",
            //     "isFamilyFriendly": true,
            //     "datePublished": `${articleRes.createdAt}`,
            //     "dateModified": `${articleRes.updatedAt}`,
            //     "description": `${articleRes.sub_header}`,
            //     "articleBody": `${articleRes.text}`,
            //     "articleSection": `${articleRes.blog_category.name}`,
            //     "mainEntityOfPage": {
            //         "@type": "WebPage", "@id": `https://lamiya.com.ua${BLOG_ROUTE}/${articleRes.link}`
            //     },
            //     "publisher": {
            //         "@type": "Organization", "name": "Lamiya", "logo": {
            //             "@type": "ImageObject", "url": "https://lamiya.com.ua/logo.png"
            //         }
            //     }
            // }
            // blog.innerHTML = `${JSON.stringify(BlogData)}`;
            // document.head.appendChild(blog);
        }).catch((error) => {
            toast.error(error.response.data.message)
        }).finally(() => {
            setLoading(false)
        })
    }, []);


    useEffect(() => {
        const productsElems = document.querySelectorAll('[data-products]');
        const observers = [];

        for (const productElem of productsElems) {
            const observer = new IntersectionObserver(
                (entries, observerInstance) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            getProductsInfo(productElem.dataset.products, false)
                                .then(infoProducts => {
                                    productElem.classList.add('blog_loaded_product');
                                    const root = createRoot(productElem);
                                    if (productElem.dataset.type === 'single') {
                                        root.render(
                                            <SingleProduct
                                                deviceBasket={deviceBasket}
                                                info={infoProducts[0]}
                                                desc={productElem.dataset.desc}
                                            />
                                        );
                                    } else if (productElem.dataset.type === 'slider') {
                                        root.render(
                                            <SliderProducts
                                                deviceBasket={deviceBasket}
                                                infoProducts={infoProducts}
                                            />
                                        );
                                    }
                                    observerInstance.unobserve(productElem);
                                })
                                .catch((error) => {
                                });
                        }
                    });
                },
                {threshold: 0.1}
            );

            observer.observe(productElem);
            observers.push(observer);
        }

        const instagramFrame = document.querySelectorAll('.instagram-media');
        if (instagramFrame) {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            } else {
                const script = document.createElement('script');
                script.src = 'https://www.instagram.com/embed.js';
                script.async = true;
                script.onload = () => window.instgrm.Embeds.process();
                document.body.appendChild(script);
            }
        }
        const tiktokFrame = document.querySelectorAll('.tiktok-embed');
        if (tiktokFrame) {
            if (!document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) {
                const script = document.createElement('script');
                script.src = 'https://www.tiktok.com/embed.js';
                script.async = true;
                document.body.appendChild(script);
            }
        }

        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, [article]);


    return !loading ? (<div className={classes.blog_container}>
        <div className={classes.blog_breadcrumbs}>
            <a onClick={(e) => {
                e.preventDefault();
                navigate(`${BLOG_ROUTE}`)
            }}
               href={`${BLOG_ROUTE}`}><span>Блог</span></a>
            <a onClick={(e) => {
                e.preventDefault();
                navigate(`${BLOG_ROUTE}/c/${article.blog_category.code}`)
            }}
               href={`${BLOG_ROUTE}/c/${article.blog_category.code}`}>
                <span>{article.blog_category.name}</span></a>
            <span>{article.header}</span>
        </div>
        <h1 className={classes.h1_header}>{article.header}</h1>
        <img className={classes.main_poster} alt={article.header} src={article.image}/>
        <div className={classes.minor_info_container}>
            <div className={classes.blog_content_list}>
                <div className={classes.blog_content_header}>Зміст</div>
                <ul>
                    {Object.entries(article.content_menu).map(([key, value]) => {
                        return (
                            <ol id="content_menu_id">
                                <li><a href={`#${value}`}>{key}</a></li>
                            </ol>
                        )
                    })}
                </ul>
            </div>
            <div className={classes.minor_info_block}>
                <div className={classes.blog_date}>Дата
                    публікації: <span>{new Date().toLocaleDateString('uk-UA', dateOptions)}</span></div>
                <div className={classes.blog_author}>Автор: <a onClick={(e) => {
                    e.preventDefault();
                    navigate(`${BLOG_ROUTE}/author/${article.blog_author.code}`);
                }} href={`${BLOG_ROUTE}/author/${article.blog_author.code}`}>
                    <span>{article.blog_author.name}</span>
                </a></div>
            </div>
        </div>
        <div className={classes.article_body} dangerouslySetInnerHTML={{__html: article.text}}></div>
        <BlogShare article={article}/>
        <CommentBlock user={user} language={true}/>
        <FaqBlock faq={article.faq}/>
        {/*<ArticlePopular article={article} navigate={navigate}/>*/}
    </div>) : (<Loader/>)
};

export default PreviewPage;