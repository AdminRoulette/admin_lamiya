import React, {useEffect, useState} from 'react';
import classes from '../Finance.module.scss';
import {toast} from "react-toastify";
import CollectionModal from "@/pages/Finance/Collection/CollectionModal";
import {getCollection} from "@/http/financeApi";
import Loader from "@/components/Loader/Loader";

const Collection = () => {
    const [collectionVisible, setCollectionVisible] = useState(false);
    const [collectionList, setCollectionList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCollection().then((data) => {
            setCollectionList(data);
        }).catch(error => {
            toast(error.message)
        }).finally(() => {
            setLoading(false)
        });
        document.title = "Інкасації"
    }, []);
    return !loading && collectionList.length > 0 ? (
        <div>
            <button className={"custom_btn"}
                    onClick={() => {
                        setCollectionVisible(true);
                    }}>Додати витрату
            </button>
            <div className={classes.expenses_block}>
                {collectionList.map((collection, index) => {
                    return (
                        <div className={classes.expenses_element} key={index}>
                            <div>{new Date(collection.createdAt).toLocaleString('uk-UA', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                timeZone: 'Europe/Kiev',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: false
                            }).replace(",", "")} - {collection.user.lastname} {collection.user.firstname} - <b>{collection.cash_count} грн</b>
                            </div>
                            <div>Магазин: <b>{collection.shop.city} {collection.shop.address}</b></div>
                            {collection.comment && <div>
                                Коментар: <b>{collection.comment}</b>
                            </div>}
                        </div>
                    )
                })}
            </div>

            {collectionVisible && <CollectionModal
                onHide={() => setCollectionVisible(false)}
                setCollectionList={setCollectionList}
                collectionList={collectionList}
            />}

        </div>
    ) : (
        <Loader/>
    );
};

export default Collection;