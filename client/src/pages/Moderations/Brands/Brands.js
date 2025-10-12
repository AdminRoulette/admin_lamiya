import React, {useState, useEffect} from "react";
import EditBrand from "@/pages/Moderations/Brands/components/EditBrand";
import Loader from "@/components/Loader/Loader";
import classes from "./brand.module.scss";
import {toast} from "react-toastify";
import {getAllBrands} from "@/http/Product/brandAPI";

const Brands = () => {
    const [brandModal, setBrandModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [brandList, setBrandList] = useState([]);

    useEffect(() => {
        getAllBrands().then((brands) => setBrandList(brands)).catch(error => {
            toast(error.response.data.message)
        }).finally(() => {
            setTimeout(() => setLoading(false), 100);
        });
        document.title = "Бренди"
    }, []);

    return !loading ? (
        <>
            <div className={classes.brand_btns}>
                <button className="custom_btn"
                        onClick={() => {
                            setBrandModal(true);
                            document.body.style.overflow = 'hidden'
                        }}>
                    Додати бренд
                </button>
            </div>

            <div className={classes.brand_container}>
                {brandList.map((brandElem) => {
                    return (
                        <div className={`${classes.brand_element}${brandElem.popular ? ` ${classes.brand_popular}`:""}`}>
                            <div>
                                <div>#{brandElem.id}</div>
                                <div >Назва: <b>{brandElem.name}</b></div>
                                <div className={brandElem.popular && classes.bold}>Назва рос: <b>{brandElem.name_ru}</b></div>
                                <div>Код: <b>{brandElem.code}</b></div>
                            </div>
                            <span onClick={() => {
                                setEditData(brandElem)
                                setBrandModal(true);
                            }} className="material-symbols-outlined">edit</span>
                        </div>
                    )
                })}
            </div>
            {brandModal && <EditBrand setBrandList={setBrandList} editData={editData}
                                      onHide={() => {
                                          setBrandModal(false);
                                          setEditData(null)
                                      }}/>}
        </>
    ) : (
        <Loader/>
    );
};

export default Brands;
