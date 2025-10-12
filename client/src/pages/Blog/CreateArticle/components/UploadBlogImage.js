import React from 'react';
import classes from "@/pages/Blog/blog.module.scss";

const UploadBlogImage = ({updateArticleInfo, header}) => {

    function UploadPhoto() {
        document.getElementById("uploadImages").click();
    }

    const selectFile = async (event) => {
        updateArticleInfo("image", {src: URL.createObjectURL(event.target.files[0]), binary: event.target.files[0]});
    };

    return (
        <div onClick={() => {
            UploadPhoto()
        }} className={classes.blog_upload_img}>
            <span className="material-symbols-outlined">cloud_upload</span>
            <span>{"Завантажити фото для обкладинки статті"}</span>
            <span>{"Розміри 1000:500 (Ширина:Висота) з об'єктом по центру"}</span>
            <span>Формати файлів: webp, png, jpg, jpeg</span>
            <input onChange={selectFile} accept="image/webp, image/png, image/jpeg, image/jpg" id="uploadImages"
                   type="file" style={{display: "none", width: "100%", height: "30px"}}/>
        </div>

    );
};

export default UploadBlogImage;
