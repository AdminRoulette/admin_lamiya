import React, {useState, useEffect} from "react";
import Loader from "@/components/Loader/Loader";
import classes from "../Finance.module.scss";
import {toast} from "react-toastify";
import {getFopsList} from "@/http/financeApi";
import EditFopModal from "@/pages/Finance/FopsList/components/EditFopModal";

const FopsList = () => {
    const [fopsModal, setFopsModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fopsList, setFopsList] = useState([]);

    useEffect(() => {
        getFopsList().then((fops) => setFopsList(fops)).catch(error => {
            toast(error.response.data.message)
        }).finally(()=>{
            setLoading(false)
        });
        document.title = "Список ФОПів"
    }, []);

    return !loading && fopsList.length > 0 ? (
        <>
            <div className={classes.brand_btns}>
                <button className="custom_btn"
                        onClick={() => {
                            setFopsModal(true);
                            document.body.style.overflow = 'hidden'
                        }}>
                    Додати фоп
                </button>
            </div>

            <div>
                {fopsList.map((fopItem) => {
                    return (
                        <div className={classes.brand_element}>
                            <div>
                                <span><b>Дані фоп</b></span>
                                <div>{fopItem.name}</div>
                                <div>{fopItem.ipn}</div>
                                <div>{fopItem.iban}</div>
                                <div>{fopItem.sender_phone}</div>
                                <div><b>{fopItem.total_sell}</b> грн</div>
                            </div>
                            <div>
                                <span><b>Рефи</b></span>
                                {fopItem.np_city_ref && <div>{fopItem.np_city_ref}</div>}
                                {fopItem.np_sender_ref && <div>{fopItem.np_sender_ref}</div>}
                                {fopItem.np_sender_address_ref && <div>{fopItem.np_sender_address_ref}</div>}
                                {fopItem.np_sender_contact_ref && <div>{fopItem.np_sender_contact_ref}</div>}
                                {fopItem.ukr_sender_uuid && <div>{fopItem.ukr_sender_uuid}</div>}
                            </div>
                            <div>
                                <span><b>Ключі</b></span>
                                {fopItem.key && <div>{fopItem.key}</div>}
                                {fopItem.np_api_key && <div>{fopItem.np_api_key}</div>}
                                {fopItem.ukr_token && <div>{fopItem.ukr_token}</div>}
                                {fopItem.ukr_tracking_token && <div>{fopItem.ukr_tracking_token}</div>}
                                {fopItem.ukr_bearer && <div>{fopItem.ukr_bearer}</div>}
                            </div>

                            <span onClick={() => {
                                setEditData(fopItem)
                                setFopsModal(true);
                            }} className="material-symbols-outlined">edit</span>
                        </div>
                    )
                })}
            </div>
            {fopsModal && <EditFopModal setFopsList={setFopsList} editData={editData}
                                         onHide={() => {setFopsModal(false);setEditData(null)}}/>}
        </>
    ) : (
        <Loader/>
    );
};

export default FopsList;
