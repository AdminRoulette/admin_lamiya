import React, {useEffect, useState} from 'react';
import {getBlogCategories} from "@/http/blogApi";
import {toast} from "react-toastify";
import classes from "@/pages/Blog/blog.module.scss";
import BlogCategoriesItem from "@/pages/Blog/BlogCategories/components/BlogCategoriesItem";
import CreateBlogCategoriesModal from "@/pages/Blog/BlogCategories/components/CreateBlogCategoriesModal";

const BlogCategories = () => {
    const [categoriesList, setCategoriesList] = useState([]);
    const [categoriesModal, setCategoriesModal] = useState(false);
    const [category, setCategory] = useState({});
    document.title = "Категорії статей"

    useEffect(() => {
        getBlogCategories().then(categoryList => {
            setCategoriesList(categoryList)
        }).catch((error) => {
            toast.error(error.response.data.message)
        })
    }, []);

    const closeModal = () => {
        setCategoriesModal(false)
        document.body.style.overflow = '';
    }

    const showModal = (type,category) => {
        setCategory({type,category})
        setCategoriesModal(true)
        document.body.style.overflow = 'hidden';
    }
    return (
        <div>
            {categoriesModal && <CreateBlogCategoriesModal setCategoriesList={setCategoriesList} closeModal={closeModal} category={category}/>}
            <div className={classes.author_header}>
                <button className="custom_btn" onClick={()=>showModal(true,{})}>Додати категорію</button>
            </div>
            <div>
                {categoriesList.map(categoryElem => {
                    return (
                        <BlogCategoriesItem showModal={showModal} category={categoryElem}/>
                    )
                })}
            </div>
        </div>
    );
};

export default BlogCategories;
