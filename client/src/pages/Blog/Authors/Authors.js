import React, {useEffect, useState} from 'react';
import {getBlogAuthor} from "@/http/blogApi";
import {toast} from "react-toastify";
import classes from "@/pages/Blog/blog.module.scss";
import AuthorItem from "@/pages/Blog/Authors/components/AuthorItem";
import CreateAuthorModal from "@/pages/Blog/Authors/components/CreateAuthorModal";

const Authors = () => {
    const [authorsList, setAuthorsList] = useState([]);
    const [authorsModal, setAuthorsModal] = useState(false);
    const [author, setAuthor] = useState({});
    document.title = "Автори статей"
    useEffect(() => {
        getBlogAuthor().then(authorList => {
            setAuthorsList(authorList)
        }).catch((error) => {
            toast.error(error.response.data.message)
        })
    }, []);

    const closeModal = () => {
        setAuthorsModal(false)
        document.body.style.overflow = '';
    }

    const showModal = (type,author) => {
        setAuthor({type,author})
        setAuthorsModal(true)
        document.body.style.overflow = 'hidden';
    }

    return (
        <div>
            {authorsModal && <CreateAuthorModal setAuthorsList={setAuthorsList} closeModal={closeModal} author={author}/>}
            <div className={classes.author_header}>
                <button className="custom_btn" onClick={()=>showModal(true,{})}>Додати автора</button>
            </div>
            <div>
                {authorsList.map(author => {
                    return (
                        <AuthorItem showModal={showModal} author={author}/>
                    )
                })}
            </div>
        </div>
    );
};

export default Authors;