import React, {useContext, useEffect, useRef} from 'react';
import "../../PreviewPage/article.scss"
import preview from "../../PreviewPage/article.module.scss"
import classes from '../../blog.module.scss'
import {getProductsInfo} from "@/http/blogApi";
import {createRoot} from 'react-dom/client';
import SingleProduct from "@/pages/Blog/CreateArticle/components/ProductPreview/SingleProduct";
import SliderProducts from "@/pages/Blog/CreateArticle/components/ProductPreview/SliderProducts";
import {Context} from "@/index";
import FaqItem from "@/pages/Blog/PreviewPage/components/FaqItem";
import BlogShare from "@/pages/Blog/PreviewPage/components/BlogShare";
import CommentBlock from "@/pages/Blog/PreviewPage/components/CommentBlock";
import FaqBlock from "@/pages/Blog/PreviewPage/components/FaqBlock";

const BlogPreview = ({articleInfo,author}) => {
    const dateOptions = {day: '2-digit', month: '2-digit', year: 'numeric'};
    const blogBodyRef = useRef(null);
    const {deviceBasket, user, language} = useContext(Context);

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
        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, [articleInfo.text]);

    useEffect(() => {
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
    }, []);

    return (

        <div className={classes.preview_container}>
            {articleInfo.header && <h1 className={preview.h1_header}>{articleInfo.header}</h1>}
            {articleInfo.image.src &&
                <img className={preview.main_poster} alt={articleInfo.header} src={articleInfo.image.src}/>}
            <div className={preview.minor_info_container}>
                <div className={preview.blog_content_list}>
                    <div className={preview.blog_content_header}>Зміст</div>
                    {Object.entries(articleInfo.content_menu).map(([key,value]) =>{
                        return (
                            <ol id="content_menu_id">
                                <li><a href={`#${value}`}>{key}</a></li>
                            </ol>
                        )
                    })}
                </div>
                <div className={preview.minor_info_block}>
                    <div className={preview.blog_date}>Дата
                        публікації: <span>{new Date().toLocaleDateString('uk-UA', dateOptions)}</span></div>
                    <div className={preview.blog_author}>Автор: <a target="_blank" href={`/`}>
                        <span>{author}</span>
                    </a></div>
                </div>
            </div>
            <div className={preview.article_body} ref={blogBodyRef} dangerouslySetInnerHTML={{__html: articleInfo.text}}></div>
            <BlogShare article={articleInfo}/>
            <CommentBlock user={user} language={true}/>
            <FaqBlock faq={articleInfo.faq}/>

            {/*<CommentBlock user={user} language={true}/>*/}
        </div>
    );
};

export default BlogPreview;