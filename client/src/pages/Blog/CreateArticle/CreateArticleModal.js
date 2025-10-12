import React, {useEffect, useState} from 'react';
import classes from "@/pages/Blog/blog.module.scss";
import BlogAuthor from "@/pages/Blog/CreateArticle/components/BlogAuthor";
import BlogCategory from "@/pages/Blog/CreateArticle/components/BlogCategory";
import UploadBlogImage from "@/pages/Blog/CreateArticle/components/UploadBlogImage";
import BlogTextArea from "@/pages/Blog/CreateArticle/components/BlogTextArea";
import {createArticle, editArticle} from "@/http/blogApi";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {BLOG_ROUTE} from "@/utils/constants";
import ContentMenu from "@/pages/Blog/CreateArticle/components/ContentMenu/ContentMenu";
import FAQ from "@/pages/Blog/CreateArticle/components/FAQ/FAQ";

const CreateArticleModal = ({authorsList,categoriesList,articleInfo,setArticleInfo,page,author,setAuthor,link}) => {
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(page === 'edit'){
            setAuthor(articleInfo?.blog_author?.name)
            setCategory(articleInfo?.blog_category?.name)
        }
    }, [articleInfo]);

    const FormDataAppend = (author_id,category_id) => {
        const formData = new FormData();
        if(articleInfo.link){
            formData.append('link', articleInfo.link);
        }
        formData.append('author_id', author_id);
        formData.append('category_id', category_id);
        formData.append('text', articleInfo.text);
        formData.append('text_ru', articleInfo.text_ru);
        formData.append('sub_header', articleInfo.sub_header);
        formData.append('sub_header_ru', articleInfo.sub_header_ru);
        formData.append('header', articleInfo.header);
        formData.append('header_ru', articleInfo.header_ru);
        if(articleInfo.image?.binary){
            formData.append('image', articleInfo.image?.binary);
        }
        formData.append('popular', articleInfo.popular);
        formData.append('read_time', +articleInfo.read_time);
        formData.append('content_menu', JSON.stringify(articleInfo.content_menu));
        formData.append('content_menu_ru', JSON.stringify(articleInfo.content_menu_ru));
        formData.append('faq', JSON.stringify(articleInfo.faq));
        formData.append('faq_ru', JSON.stringify(articleInfo.faq_ru));

        return formData;
    };

    const postArticle = async () => {
        setLoading(true)
        const author_id = authorsList.find((item) => item.name === author)?.id;
        const category_id = categoriesList.find((item) => item.name === category)?.id;
        const FormData = FormDataAppend(author_id,category_id);
        if(author_id && category_id && articleInfo.sub_header.length > 10 && articleInfo.header.length > 10) {
            if (page === 'create') {
                await createArticle(FormData).then(() => {
                    toast("Статтю збережено")
                    navigate(`${BLOG_ROUTE}/list`)
                }).finally(()=>{
                    setLoading(false)
                }).catch((error) => {
                    toast.error(error.response.data.message)
                })
            } else if (page === 'edit') {
                await editArticle(FormData).then(() => {
                    toast("Статтю збережено")
                    navigate(`${BLOG_ROUTE}/list`)
                }).finally(()=>{
                    setLoading(false)
                }).catch((error) => {
                    toast.error(error.response.data.message)
                })
            }
        }else{
            toast.error("Заповніть заголовок, підзаголовок, автора та категорію")
        }

    }

    const updateArticleInfo = (key, value) => {
        setArticleInfo(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const updateContentMenu = (language) => {
        const menuKey = language ? 'content_menu_ru' : 'content_menu';
        const textarea = document.querySelector(language?'#article_textarea_ru':'#article_textarea');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = textarea.value;
        const h2Elements = tempDiv.querySelectorAll('h2');
        let h2List = {};
        h2Elements.forEach((h2,index) => {
            h2List[`${index + 1} - ${h2.textContent}`] = h2.textContent;
        });
        updateArticleInfo(menuKey,h2List)
    };

    return (
        <div className={classes.create_body}>
            <h1>Написати статтю</h1>
            <div className="input_row">
                <label className="input_with_placeholder">
                    <input value={articleInfo.header} type="text" maxLength="255"
                           placeholder=""
                           onChange={(e) => updateArticleInfo("header", e.target.value)}/>
                    <span className="input_field_placeholder">Заголовок</span>
                </label>
                <p>Максимум 255 символів</p>
            </div>
            <div className="input_row">
                <label className="input_with_placeholder">
                    <input value={articleInfo.header_ru} type="text" maxLength="255"
                           placeholder=""
                           onChange={(e) => updateArticleInfo("header_ru", e.target.value)}/>
                    <span className="input_field_placeholder">Заголовок російською</span>
                </label>
                <p>Максимум 255 символів</p>
            </div>
            <div className="input_row">
                <label className="input_with_placeholder">
                    <input value={articleInfo.sub_header} type="text" maxLength="255"
                           placeholder=""
                           onChange={(e) => updateArticleInfo("sub_header", e.target.value)}/>
                    <span className="input_field_placeholder">Підзаголовок</span>
                </label>
                <p>Максимум 255 символів</p>
            </div>
            <div className="input_row">
                <label className="input_with_placeholder">
                    <input value={articleInfo.sub_header_ru} type="text" maxLength="255"
                           placeholder=""
                           onChange={(e) => updateArticleInfo("sub_header_ru", e.target.value)}/>
                    <span className="input_field_placeholder">Підзаголовок російською</span>
                </label>
                <p>Максимум 255 символів</p>
            </div>
            <div className="input_row">
                <BlogAuthor authorsList={authorsList} setAuthor={setAuthor} author={author}/>
            </div>
            <div className="input_row">
                <BlogCategory categoriesList={categoriesList} setCategory={setCategory} category={category}/>
            </div>
            <div className="input_row">
                <label className="input_with_placeholder">
                    <input value={articleInfo.read_time} type="text" maxLength="255"
                           placeholder=""
                           onChange={(e) => updateArticleInfo("read_time", e.target.value)}/>
                    <span className="input_field_placeholder">Час на прочитання статті</span>
                </label>
                <p>До 10 хв</p>
            </div>
            <UploadBlogImage header={articleInfo.header}  updateArticleInfo={updateArticleInfo}/>
            <BlogTextArea language={false} updateContentMenu={updateContentMenu} text={articleInfo.text} setText={(e) => updateArticleInfo("text", e)}/>
            <BlogTextArea language={true} updateContentMenu={updateContentMenu} text={articleInfo.text_ru} setText={(e) => updateArticleInfo("text_ru", e)}/>
            {articleInfo.content_menu && <ContentMenu language={false} content_menu={articleInfo.content_menu} setArticleInfo={setArticleInfo}/>}
            {articleInfo.content_menu_ru && <ContentMenu language={true} content_menu={articleInfo.content_menu_ru} setArticleInfo={setArticleInfo}/>}
            <FAQ language={false} setArticleInfo={setArticleInfo} faq={articleInfo.faq}/>
            <FAQ language={true} setArticleInfo={setArticleInfo} faq={articleInfo.faq_ru}/>

            <button disabled={loading} className={"custom_btn" + " " + classes.blog_button} onClick={postArticle}>{page === 'create'?"Опублікувати":"Редагувати"}</button>
        </div>
    );
};

export default CreateArticleModal;