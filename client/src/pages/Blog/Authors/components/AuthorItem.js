import React from 'react';
import classes from "@/pages/Blog/blog.module.scss";

const AuthorItem = ({author,showModal}) => {

    return (
        <div className={classes.author_container}>
            <div>
                <img alt={author.name} src={author.photo}/>
                <div>{author.name}</div>
            </div>
            <div className={classes.author_svg}>
                <svg onClick={()=>showModal(false,author)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path
                        d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                    <path d="m15 5 4 4"/>
                </svg>

            </div>
        </div>
    );
};

export default AuthorItem;