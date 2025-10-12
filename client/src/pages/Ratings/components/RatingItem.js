import React, {useState} from 'react';
import classes from "@/pages/Categories/moderation.module.scss";
import {deleteRating, PostRating} from "@/http/Product/ratingApi";
import EditRatingModal from "@/pages/Ratings/components/EditRatingModal";

const RatingItem = ({rating_info,setRatingsList,index}) => {
    const [editModal, setEditModal] = useState(false);


    const OpenEditModal = () => {
        setEditModal(true)
        document.body.style.overflow = 'hidden';
    }

    const CloseEditModal = () => {
        setEditModal(false)
        document.body.style.overflow = '';
    }

    return (
        <div className={classes.rating_block} key={rating_info.id}>
            {editModal && <EditRatingModal index={index} onHide={CloseEditModal} setRatingsList={setRatingsList} rating_info={rating_info}/>}
            <div className={classes.rating_top}>
                <div><b>Відгук</b> #{rating_info.id}</div>
                <div>{new Date(rating_info.createdAt).toLocaleDateString()}</div>
                <div>Ім'я: <b>{rating_info.username}</b></div>
                <div>Оцінка: <b>{rating_info.rate}</b></div>
                <div>Модерація: <b>{rating_info.moderation ? "Підтвержено" : "На розгляді"}</b></div>
                <div>Купили товар?: <b>{rating_info.bought?"Так":"Ні"}</b></div>
                <span onClick={OpenEditModal} className="material-symbols-outlined">edit</span>
            </div>
            <div className={classes.rating_bot}>

                <div>Товар: <a href={`https://lamiya.com.ua/product/${rating_info.device.link}`} target="_blank"><b>{rating_info.device.name}</b></a></div>
                <div>Відео: <b>{rating_info.video}</b></div>
                <div>Коментар: {rating_info.comment}</div>
                <div className={classes.rating_bot_img}>{rating_info.ratingimages.map((ratingImg) => {
                    return (
                        <img alt={``} src={ratingImg.img}/>
                    )
                })}</div>
            </div>
            {!rating_info.moderation ? <div className={classes.rating_buttons}>
                    <button onClick={() => {
                        deleteRating({id: rating_info.id}).then(() => {

                        })
                    }} className="custom_btn">Видалити
                    </button>
                    <button className="custom_btn" onClick={() => {
                        PostRating({id: rating_info.id}).then(() => {

                        })
                    }}>Опублікувати
                    </button>
                </div>
                : <></>}
        </div>
    );
};

export default RatingItem;
