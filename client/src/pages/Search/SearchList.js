import React, {useEffect, useState} from 'react';
import {AdminSearchList} from "@/http/searchApi";
import classes from "./searchTab.module.scss";
import {toast} from "react-toastify";

const SearchList = () => {
    const [searchList, setSearchList] = useState([]);

    useEffect(() => {
        AdminSearchList().then((data) => {
            setSearchList(data)
        }).catch(error => {
            toast(error.message)
        });
    }, []);

    return (
        <div className={classes.search_container}>
            <div>
                <button className="custom_btn">Видалити ВСЕ!!!!!!!</button>
            </div>
            <div className={classes.search_list}>
                {searchList.map((searchElem)=>{
                    return (
                        <div className={classes.search_list_item} key={searchElem.id}>
                            <div>Значення: <b>{searchElem.value}</b></div>
                            <div>Кіл-сть: {searchElem.count}</div>
                        </div>)
                })}
            </div>
        </div>
    );
};

export default SearchList;