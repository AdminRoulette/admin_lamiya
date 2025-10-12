import React, {useEffect, useState} from 'react';
import {getSeoList} from "@/http/seoAPI";
import classes from '../seoPage.module.scss';
import SeoItem from "@/pages/Seo/components/SeoItem";
import SeoEdit from "@/pages/Seo/components/SeoEdit";
import {toast} from "react-toastify";
import ImportModal from "@/pages/Seo/components/ImportModal";

const SeoList = () => {
    const [seoList, setSeoList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [filter, setFilter] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    useEffect(() => {
        uploadSeoLost();
    }, []);

    const uploadSeoLost = () => {
        getSeoList().then(async (resList) => {
            setFilterList(resList)
            setSeoList(resList)
        }).catch(error => {
            toast(error.message)
        });
    }

    const filterSeo = (value) => {
        setFilter(value)
        if (value.length === 0) {
            setFilterList([])
        } else {
            setFilterList(seoList.filter(item => item.url.toLowerCase().includes(value.toLowerCase())))
        }
    }

    return (<div className={classes.container}>
            {showCreate ?
                <SeoEdit seoList={seoList} setFilterList={setFilterList} type={"create"} setSeoList={setSeoList}
                         onHide={() => setShowCreate(false)}/> : <></>}
            {showImportModal ? <ImportModal uploadSeoLost={uploadSeoLost} closeModal={() => {
                document.body.style.overflow = '';
                setShowImportModal(false)
            }}/> : <></>}
            <div className={classes.header}>
                <div className={classes.warning_msg}>
                    <p>Можливі опції (не на всіх сторінках):</p>
                    <p>{`{brand} - назва бренду {option} - шт/мл товару, {series} - серія товару, {productName} - назва товару`}</p>
                </div>
                <div className={classes.header_btn}>
                    <button onClick={() => setShowCreate(true)} className="custom_btn">Додати</button>
                    <button onClick={() => {
                        document.body.style.overflow = 'hidden';
                        setShowImportModal(true)
                    }} className="custom_btn">Імпорт
                    </button>
                </div>
            </div>
            <input placeholder="Пошук по URL" type="text" value={filter} onChange={(e) => filterSeo(e.target.value)}/>
            {seoList.length > 0 ? filterList.map((seoElem) => {
                return (<SeoItem key={seoElem.id} setSeoList={setSeoList} seoElem={seoElem}/>)
            }) : <div className={classes.loading}></div>}
        </div>);
};

export default SeoList;
