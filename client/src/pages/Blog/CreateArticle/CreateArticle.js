import React, {useEffect, useState} from 'react';
import classes from '../blog.module.scss'
import BlogPreview from "@/pages/Blog/CreateArticle/components/BlogPreview";
import {getArticle, getBlogAuthor, getBlogCategories} from "@/http/blogApi";
import {toast} from "react-toastify";
import CreateArticleModal from "@/pages/Blog/CreateArticle/CreateArticleModal";
import {useParams} from "react-router-dom";

const CreateArticle = ({page}) => {
    const {link} = useParams();
    const [articleInfo, setArticleInfo] = useState({
        text: "",
        text_ru: "",
        sub_header: "",
        sub_header_ru: "",
        header: "",
        header_ru: "",
        image: {src:'',binary:null},
        popular: false,
        read_time:1,
        content_menu: {},
        content_menu_ru: {},
        faq:``,
        faq_ru:``

    });
    const [author, setAuthor] = useState(articleInfo.blog_author?.name?articleInfo.blog_author?.name:"");
    const [authorsList, setAuthorsList] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    document.title = "Створення статті для блогу";

    useEffect(() => {
        getBlogAuthor().then(authorList => {
            setAuthorsList(authorList)
        }).catch((error) => {
            toast.error(error.response.data.message)
        })
        getBlogCategories().then(categoriesList => {
            setCategoriesList(categoriesList)
        }).catch((error) => {
            toast.error(error.response.data.message)
        })
        if(link){
            getArticle(link).then(article => {
                setArticleInfo({...article,image: {src:article.image,binary:null}})
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
        }
    }, []);


    return (
        <div className={classes.create_container}>
            <CreateArticleModal authorsList={authorsList}  categoriesList={categoriesList} articleInfo={articleInfo}
                                setArticleInfo={setArticleInfo} page={page}
                                setAuthor={setAuthor} author={author} link={link}/>
            <BlogPreview articleInfo={articleInfo} author={author}/>
        </div>
    );
};

export default CreateArticle;