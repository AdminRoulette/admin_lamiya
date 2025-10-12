import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import classes from "@/pages/Blog/blog.module.scss";
import {
    createBlogCategory,
    editBlogCategory
} from "@/http/blogApi";

const CreateBlogCategoriesModal = ({closeModal, category,setCategoriesList}) => {
    const [editCategory, setEditCategory] = useState(category.category ? category.category : {});

    useEffect(() => {
        setEditCategory(category.category ? category.category : {})
    }, []);

    const addCategory = async () => {
        if(editCategory.name){
            if(category.type) {
                await createBlogCategory({name:editCategory.name,name_ru:editCategory.name_ru?editCategory.name_ru:""}).then(res => {
                    setCategoriesList(prev => [...prev, res])
                    closeModal()
                }).catch(error => {
                    toast.error(error.response.data.message)
                })
            }else{
                await editBlogCategory({id:editCategory.id,name:editCategory.name,name_ru:editCategory.name_ru?editCategory.name_ru:""}).then(res => {
                    setCategoriesList(prev =>
                        prev.map((prevElem) => {
                            if(+prevElem.id === +res.id){
                                return {...res}
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
            toast.error("Вкажіть назву категорії")
        }
    }

    const updateAuthorInfo = (key, value) => {
        setEditCategory(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    return (
        <div className="modal_main">
            <div id="close_cart" onClick={() => closeModal()} className="modal_bg"/>
            <div className={"modal_container"}>
                <div className="modal_header">
                    <div>{category.type?"Додати категорію":"Редагувати категорію"}</div>
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
                            <input placeholder="" value={editCategory.name}
                                   onChange={(e) => updateAuthorInfo('name', e.target.value)} type="text"
                                   maxLength="255"/>
                            <span className="text_field_placeholder">Назва українською</span>
                        </label>
                        <p>Максимум 255 символів!</p>
                    </div>
                    <div className="input_row">
                        <label>
                            <input placeholder="" value={editCategory.name_ru}
                                   onChange={(e) => updateAuthorInfo('name_ru', e.target.value)} type="text"
                                   maxLength="255"/>
                            <span className="text_field_placeholder">Назва російською</span>
                        </label>
                        <p>Максимум 255 символів!</p>
                    </div>
                </div>
                <div className="modal_footer">
                    <button className='second_btn' onClick={() => closeModal()}>Закрити</button>
                    <button className='custom_btn' onClick={() => addCategory()}>Додати</button>
                </div>
            </div>
        </div>
    );
};

export default CreateBlogCategoriesModal;