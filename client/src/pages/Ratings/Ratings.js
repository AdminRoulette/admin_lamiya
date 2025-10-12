import React, {useContext, useEffect, useState} from 'react';
import {deleteRating, deleteReply, getAllRating, PostRating, PostReply} from "@/http/Product/ratingApi";

import classes from "../Categories/moderation.module.scss";
import {toast} from "react-toastify";
import {Context} from "@/index";
import Loader from "@/components/Loader/Loader";
import RatingItem from "@/pages/Ratings/components/RatingItem";

const Ratings = () => {
    const [loading, setLoading] = useState(true);

    const [reload, setReload] = useState(false);
    const [ratingsList, setRatingsList] = useState([]);
    const [repliesList, setRepliesList] = useState([]);

    useEffect(() => {
        setLoading(true);
        getAllRating().then((data) => {
            setRatingsList(data[0]);
            setRepliesList(data[1]);
        }).catch(error => {
            toast(error.message)
        }).finally(()=>{
            setTimeout(() => setLoading(false), 100);
        });
        document.title = "Відгуки"
    }, [reload]);

    return !loading ? (
        <div>
            <div>{ratingsList.map((rating_info,index) => {
                return (<RatingItem setRatingsList={setRatingsList} index={index} rating_info={rating_info}/>)
            })}</div>

            <div>{repliesList.map((ReplyElems) => {
                return (
                    <div className={classes.rating_block} key={ReplyElems.id}>
                        <div className={classes.rating_top}>
                            <div><b>Відповідь</b> #{ReplyElems.id}</div>
                            <div>Ім'я: <b>{ReplyElems.username}</b></div>
                            <div>{new Date(ReplyElems.createdAt).toLocaleDateString()}</div>
                            <div>Модерація: <b>{ReplyElems.replymoderation ? "Підтвержено" : "На розгляді"}</b></div>
                        </div>
                        <div className={classes.rating_bot}>
                            <div>Продукт: <b>{ReplyElems.rating.device.name}</b>
                            </div>
                            <div>Відповідь на комментар: {ReplyElems.rating.comment}</div>
                            <div>Відповідь: {ReplyElems.replycomment}</div>
                        </div>
                        {!ReplyElems.replymoderation ? <div className={classes.rating_buttons}>
                                <button className="custom_btn" onClick={() => {
                                    PostReply({id: ReplyElems.id}).then(() => {
                                        setReload(!reload);
                                    })
                                }}>Опублікувати
                                </button>
                                <button onClick={() => {
                                    deleteReply({id: ReplyElems.id}).then(() => {
                                        setReload(!reload);
                                    })
                                }} className="custom_btn">Видалити
                                </button>
                            </div>
                            : <></>}
                    </div>)
            })}</div>
        </div>
    ) : (<Loader/>);
};

export default Ratings;
