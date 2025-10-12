import React, {useContext, useEffect, useState} from 'react';
import CreateWaitProductModal from "./CreateWaitProductModal";
import classes from "./WaitProduct.module.scss"
import {deleteWaitProducts, getUserWishList, getWaitProducts} from "@/http/waitProductApi";
import {toast} from "react-toastify";
import {Context} from "@/index";


const WaitProducts = () => {
    const [userWaitList, setUserWaitList] = useState([]);
    const [adminWaitList, setAdminWaitList] = useState([]);
    const [waitModal, setWaitModal] = useState({status:""});
    const {user} = useContext(Context)

    useEffect(() => {

        getWaitProducts().then((data) => {
            setAdminWaitList(data);
        }).catch(error => {
            toast.error(error.response.data.message)
        })
        if(user?.user?.role === "ADMIN") {
            getUserWishList().then((data) => {
                setUserWaitList(data);
            }).catch(error => {
                toast.error(error.response.data.message)
            })
        }
        document.title = "Очікують товар"
    }, []);

    const showCreateModal = () => {
        document.body.style.overflow = 'hidden';
        setWaitModal({status:"create"});
    }
    const showEditModal = (id,product,place) => {
        document.body.style.overflow = 'hidden';
        setWaitModal({status:"edit",id,product,place});
    }

    const DeleteWaitProduct = async (id) => {
        deleteWaitProducts({id: id}).then(() => {
            setAdminWaitList(prev =>
                prev.filter((waitElem) => waitElem.id !== id)
            );
        }).catch(error => {
            toast.error(error.response.data.message)
        })

    }

    return (
        <>
            <div className={classes.wait_product_header}>
                <button className="custom_btn" onClick={() => showCreateModal()}>Додати нове</button>
            </div>
            <div className={classes.wait_product_list}><b>Адмін лист</b>
                {adminWaitList.map((waitElem) => {
                    if (waitElem) {
                        return (
                            <div className={classes.wait_product_item}>
                                <div>{new Date(waitElem.createdAt).toLocaleString('uk-UA', {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    timeZone: 'Europe/Kiev',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: false
                                }).replace(",", "")}</div>
                                <div><b>{waitElem.type}</b></div>
                                <div>{waitElem.product}</div>
                                <div>{waitElem.place}</div>
                                <span onClick={() => showEditModal(waitElem.id,waitElem.product,waitElem.place)} className="material-symbols-outlined">edit</span>
                                <span onClick={() => DeleteWaitProduct(waitElem.id)}
                                      className="material-symbols-outlined">delete</span>
                            </div>
                        )
                    }
                })}
            </div>
            {userWaitList.length > 0 && <div className={classes.wait_product_list}><b>Юзер лист</b>
                {userWaitList.map((wishElem) => {
                    return (
                        <div className={classes.wait_product_item}>
                            <div>{new Date(wishElem.updatedAt).toLocaleString('uk-UA', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                timeZone: 'Europe/Kiev',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: false
                            }).replace(",", "")}</div>
                            <div>{wishElem.deviceoption.device.name} {wishElem.deviceoption.optionName}</div>
                            <div>{wishElem.user.firstname} {wishElem.user.phone}</div>
                        </div>
                    )
                })}
            </div>}
            {waitModal.status ?
                <CreateWaitProductModal waitModal={waitModal} onHide={() => setWaitModal({status:""})} setAdminWaitList={setAdminWaitList}/>
                : <></>}
        </>
    );
};

export default WaitProducts;
