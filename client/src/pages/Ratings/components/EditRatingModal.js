import React, {useState} from 'react';
import classes from "../../Categories/moderation.module.scss";
import {EditRating} from "@/http/Product/ratingApi";

const EditRatingModal = ({onHide, rating_info,setRatingsList,index}) => {
    const [ratingEdit, setRatingEdit] = useState(rating_info || {});

    const SendEdit = async () => {
        await EditRating({
            id: rating_info.id,
            comment: ratingEdit.comment,
            video: ratingEdit.video,
            bought: ratingEdit.bought,
            createdAt: ratingEdit.createdAt,
        }).then(() =>{
            setRatingsList(prev => {
                const newList = [...prev];
                newList[index] = {
                    ...newList[index],
                    comment: ratingEdit.comment,
                    video: ratingEdit.video,
                    bought: ratingEdit.bought,
                    createdAt: ratingEdit.createdAt
                };
                return newList;
            });
            onHide();
        })
    }

    const OnChangeComment = (value) => {
        setRatingEdit(prev => ({...prev, comment: value}))
    }

    const DeleteRatingImage = (deleteIndex) => {

        //delete from s3?? ratingEdit.ratingimages[deleteIndex].id

        setRatingEdit(prev => {
            const newList = [...prev.ratingimages];
            newList.splice(deleteIndex, 1);
            return { ...prev, ratingimages: newList };
        });
        setRatingsList(prev => {
            const newList = [...prev];
            let imageList = newList[index].ratingimages;
            imageList.splice(deleteIndex, 1);

            newList[index] = {
                ...newList[index],
                ratingimages : imageList
            };
            return newList;
        });
    }

    const RandomDate = () => {
        const originalDate = new Date(rating_info.createdAt);

        // Отримуємо рік назад від оригінальної дати
        const oneYearAgo = new Date(originalDate);
        oneYearAgo.setFullYear(originalDate.getFullYear() - 1);

        function getRandomTimestamp(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // Випадковий таймстамп до року
        const randomTimestamp = getRandomTimestamp(oneYearAgo.getTime(), originalDate.getTime());
        let randomDate = new Date(randomTimestamp);

        // Рандом годину між 7 і 23
        const randomHour = getRandomTimestamp(8, 22);
        randomDate.setHours(randomHour);
        const randomMinutes = getRandomTimestamp(0, 59);

        randomDate.setMinutes(randomMinutes);
        setRatingEdit(prev => ({...prev, createdAt: randomDate.toISOString()}))
    }

    return (<div className="modal_main" id='modalId'>
        <div id="close_cart" onClick={() => onHide()} className="modal_bg"/>
        <div className={"modal_container"}>
            <div className="modal_header">
                <div>{`Редагування відгука #${ratingEdit.id}`}</div>
                <svg id="close_cart" onClick={() => onHide()} xmlns="http://www.w3.org/2000/svg" width="24"
                     height="24"
                     viewBox="0 0 24 24" fill="none"
                     stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                </svg>
            </div>
            <div className="modal_body">
                <div className={classes.rating_edit_container}>
                    <div>Ім'я: <b>{ratingEdit.username}</b></div>
                    <div>Оцінка: <b>{ratingEdit.rate}</b></div>
                    <div>Купили товар?: <input checked={ratingEdit.bought} onChange={()=>setRatingEdit(prev => ({...prev,bought:!ratingEdit.bought}))} type="checkbox"/></div>
                    <div className={classes.rating_edit_date}>
                        <div>Дата: <b>{new Date(ratingEdit.createdAt).toLocaleDateString()}</b> ({new Date(ratingEdit.createdAt).toJSON()})
                            {/*const isoDate = new Date(timestamp).toISOString();*/}
                        </div>
                        <svg onClick={RandomDate} xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                             viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round">
                            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/>
                            <path d="m18 2 4 4-4 4"/>
                            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/>
                            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/>
                            <path d="m18 14 4 4-4 4"/>
                        </svg>
                    </div>

                    <div>Товар: <b>{ratingEdit.device.name}</b></div>
                    <div>Відео: <input type="text" value={ratingEdit.video}/></div>

                    <div className={classes.rating_edit_comment}>Коментар:
                        <textarea onChange={(e) => OnChangeComment(e.target.value)} value={ratingEdit.comment}/>
                    </div>
                    <div className={classes.rating_bot_img}>{ratingEdit.ratingimages.map((ratingImg, index) => {
                        return (
                            <div>
                                <img alt={``} src={ratingImg.img}/>
                                <svg onClick={()=>DeleteRatingImage(index)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <path d="M3 6h18"/>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                </svg>
                            </div>)
                    })}</div>
                    <div className={classes.rating_buttons}>
                        <button onClick={() => onHide()} className="second_btn">Закрити</button>
                        <button className="custom_btn" onClick={SendEdit}>Редагувати</button>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default EditRatingModal;
