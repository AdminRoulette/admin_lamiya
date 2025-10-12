import React, {useState} from 'react';
import classes from "@/pages/Blog/blog.module.scss";
import {toast} from "react-toastify";
import {uploadImage} from "@/http/blogApi";

const BlogImageModal = ({textAreaRef,setText,closeModal}) => {
    const [name, setName] = useState("");
    const [images, setImages] = useState("");
    const [prevImage, setPrevImage] = useState("");

    const clickUploadImage = async () => {
        if(name.length < 5){
            toast.error("Вкажіть назву фото")
        }else{
            document.getElementById("uploadSoloImg").click();
        }
    }

    const FormDataAppend = () => {
        const formData = new FormData();
        formData.append('name', name);
        for(const image of images){
            formData.append('image', image);
        }
        return formData;
    };

    const uploadFile = async () => {
        const FormData = FormDataAppend();
        await uploadImage(FormData).then(imagesInfoList =>{
            const textarea = textAreaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                let imageList = ``;
                let style = images.length > 1 ? `width:calc(${(100/images.length).toFixed(2)}% - ${(30*images.length)/(images.length - 1)}px);` : "";
                for(let i=0;images.length > i; i++){
                    imageList += `<img style="${style}" src="${imagesInfoList[i]?.src ? imagesInfoList[i].src : URL.createObjectURL(images[i])}" alt="${name} - #${i}" title="${name} - #${i}"/>`
                }
                const wrappedText = `<div class="img_block">${imageList}</div>`;
                textarea.value = textarea.value.substring(0, start) + wrappedText + textarea.value.substring(start);
                const event = new Event('input', {bubbles: true});
                setText(textarea.value);
                textarea.dispatchEvent(event);
                closeModal()
            }
        })
    }

    const selectFile = async (event) => {
        if(event.target.files.length > 4){
            toast.error("Намагаєтесь завантажити більше 4 фото")
        }else{
            let imageList = "";
            let style = event.target.files.length > 1 ? `width:calc(${100/event.target.files.length}% - ${(30*images.length)/(images.length - 1)}px);` : "";
            for(const img of event.target.files){
                const ObjImg = URL.createObjectURL(img)
                imageList += `<img style="${style}" alt="" src="${ObjImg}"/>`
            }
            setImages(event.target.files)
            setPrevImage(`<div class="img_block">${imageList}</div>`)
        }
    }

    return (
            <div className="modal_main">
                <div id="close_cart" onClick={() => closeModal()} className="modal_bg"/>
                <div className={"modal_container"}>
                    <div className="modal_header">
                        <div>Завантаження фото</div>
                        <svg id="close_cart" onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24"
                             height="24"
                             viewBox="0 0 24 24" fill="none"
                             stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"/>
                            <path d="m6 6 12 12"/>
                        </svg>
                    </div>
                    <div className={"modal_body" + " " + classes.image_modal_body}>
                        <div className="input_row">
                            <label>
                                <input placeholder="" value={name} onChange={(e)=>setName(e.target.value)} type="text" maxLength="15"/>
                                <span className="text_field_placeholder">Опис фото</span>
                            </label>
                            <p>Максимум 15 символів</p>
                        </div>

                        {!prevImage?<div onClick={clickUploadImage} className={classes.blog_upload_img}>
                            <span className="material-symbols-outlined">cloud_upload</span>
                            <span>Завантажте до 4 фото</span>
                            <span>Формати файлів: webp,png,jpg</span>
                            <input onChange={selectFile} accept="image/webp, image/png, image/jpeg, image/jpg" id="uploadSoloImg"
                                   type="file" style={{display: "none", width: "100%", height: "30px"}} multiple/>
                        </div>:<div dangerouslySetInnerHTML={{__html: prevImage}}></div>}
                    </div>
                    <div className="modal_footer">
                        <button className='second_btn' onClick={() => closeModal()}>Закрити</button>
                        <button className='custom_btn' onClick={() => uploadFile()}>Завантажити</button>
                    </div>
                </div>
            </div>
    );
};

export default BlogImageModal;