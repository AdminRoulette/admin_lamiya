import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import classes from "@/pages/Blog/blog.module.scss";
import CustomTextArea from "@/components/customTextArea";
import {createAuthor, editAuthors} from "@/http/blogApi";

const CreateAuthorModal = ({closeModal, author,setAuthorsList}) => {
    const [editAuthor, setEditAuthor] = useState(author.author ? author.author : {});
    const [image, setImage] = useState("");

    useEffect(() => {
        setEditAuthor(author.author ? author.author : {})
    }, []);
    const FormDataAppend = () => {
        const formData = new FormData();
        formData.append('id', editAuthor.id?editAuthor.id:"");
        formData.append('name', editAuthor.name);
        formData.append('name_ru', editAuthor.name_ru?editAuthor.name_ru:"");
        formData.append('instagram', editAuthor.instagram?editAuthor.instagram:"");
        formData.append('telegram', editAuthor.telegram?editAuthor.telegram:"");
        formData.append('facebook', editAuthor.facebook?editAuthor.facebook:"");
        formData.append('about', editAuthor.about?editAuthor.about:"");
        formData.append('skills', editAuthor.skills?editAuthor.skills:"");
        if(image){
            formData.append('image', image);
        }
        return formData;
    };

    const addAuthor = async () => {
        if(((author.type && image) || !author.type) && editAuthor.name){
            const FormData = FormDataAppend();
            if(author.type) {
                await createAuthor(FormData).then(res => {
                    setAuthorsList(prev => [...prev, res.dataValues])
                    closeModal()
                }).catch(error => {
                    toast.error(error.response.data.message)
                })
            }else{
                await editAuthors(FormData).then(res => {
                    setAuthorsList(prev =>
                        prev.map((prevElem) => {
                            if(+prevElem.id === +res.id){
                                return {...res,photo:res.photo?res.photo:prevElem.photo}
                            }else{
                                return {...prevElem}
                            }
                        }))
                    closeModal()
                }).catch(error => {
                    toast.error(error.response.data.message)
                })
            }
        }else{
            toast.error("Завантажте фото та вкажіть Ім'я")
        }

    }

    const updateAuthorInfo = (key, value) => {
        setEditAuthor(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const clickUploadImage = async () => {
      document.getElementById("uploadSoloImg").click();
    }

    const selectFile = async (event) => {
            await updateAuthorInfo("photo",URL.createObjectURL(event.target.files[0]))
            setImage(event.target.files[0])
    }
    return (
        <div className="modal_main">
            <div id="close_cart" onClick={() => closeModal()} className="modal_bg"/>
            <div className={"modal_container"}>
                <div className="modal_header">
                    <div>{author.type?"Додати автора":"Редагувати автора"}</div>
                    <svg id="close_cart" onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className={"modal_body" + " " + classes.author_modal_body}>
                    <div className="input_row">
                        <label>
                            <input placeholder="" value={editAuthor.name}
                                   onChange={(e) => updateAuthorInfo('name', e.target.value)} type="text"
                                   maxLength="255"/>
                            <span className="text_field_placeholder">Ім'я\Нікнейм українською</span>
                        </label>
                        <p>Максимум 255 символів!</p>
                    </div>
                    {/*<div className="input_row">*/}
                    {/*    <label>*/}
                    {/*        <input placeholder="" value={editAuthor.name_ru}*/}
                    {/*               onChange={(e) => updateAuthorInfo('name_ru', e.target.value)} type="text"*/}
                    {/*               maxLength="255"/>*/}
                    {/*        <span className="text_field_placeholder">ФИО</span>*/}
                    {/*    </label>*/}
                    {/*    <p>Максимум 255 символів! ФИО по русски</p>*/}
                    {/*</div>*/}
                    <div className="input_row">
                        <label>
                            <input placeholder="" value={editAuthor.instagram}
                                   onChange={(e) => updateAuthorInfo('instagram', e.target.value)} type="text"
                                   maxLength="255"/>
                            <span className="text_field_placeholder">Посилання Instagram</span>
                        </label>
                        <p>Максимум 255 символів!</p>
                    </div>
                    <div className="input_row">
                        <label>
                            <input placeholder="" value={editAuthor.telegram}
                                   onChange={(e) => updateAuthorInfo('telegram', e.target.value)} type="text"
                                   maxLength="255"/>
                            <span className="text_field_placeholder">Посилання Telegram</span>
                        </label>
                        <p>Максимум 255 символів!</p>
                    </div>
                    <div className="input_row">
                        <label>
                            <input placeholder="" value={editAuthor.facebook}
                                   onChange={(e) => updateAuthorInfo('facebook', e.target.value)} type="text"
                                   maxLength="255"/>
                            <span className="text_field_placeholder">Посилання Facebook</span>
                        </label>
                        <p>Максимум 255 символів!</p>
                    </div>
                    <div className="input_row">
                        <CustomTextArea onChange={(event) => updateAuthorInfo("about", event.target.value)}
                                        maxLength={1999} placeholder={"Про Автора"} value={editAuthor.about}/>
                    </div>
                    <div className="input_row">
                        <CustomTextArea onChange={(event) => updateAuthorInfo("skills", event.target.value)}
                                        maxLength={1999} placeholder={"Навички автора"} value={editAuthor.skills}/>
                    </div>
                    <div onClick={clickUploadImage} className={classes.blog_upload_img}>
                        <span className="material-symbols-outlined">cloud_upload</span>
                        <span>Завантажте фото</span>
                        <span>Формати файлів: webp,png,jpg</span>
                        <input onChange={selectFile} accept="image/webp, image/png, image/jpeg, image/jpg" id="uploadSoloImg"
                               type="file" style={{display: "none", width: "100%", height: "30px"}} multiple/>
                    </div>
                </div>
                <div className="modal_footer">
                    <button className='second_btn' onClick={() => closeModal()}>Закрити</button>
                    <button className='custom_btn' onClick={() => addAuthor()}>Додати</button>
                </div>
            </div>
        </div>
    );
};

export default CreateAuthorModal;