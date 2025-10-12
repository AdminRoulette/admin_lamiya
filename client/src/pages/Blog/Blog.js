import React from 'react';
import {useParams} from "react-router-dom";
import ArticlesList from "@/pages/Blog/ArticleList/ArticlesList";
import CreateArticle from "@/pages/Blog/CreateArticle/CreateArticle";
import Authors from "@/pages/Blog/Authors/Authors";
import BlogCategories from "@/pages/Blog/BlogCategories/BlogCategories";

const Blog = () => {
    const {page} = useParams();
    return (
        <>
            {page === 'create' || page === 'edit'?
                    <CreateArticle page={page}/>
                :page === "authors"?<Authors/>
                    :page === "categories"?<BlogCategories />
                : <ArticlesList/>}
        </>
    );
};

export default Blog;