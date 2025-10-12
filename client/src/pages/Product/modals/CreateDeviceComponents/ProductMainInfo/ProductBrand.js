import React, {useState} from "react";
import classes from "../../../productPage.module.scss";
import {toast} from "react-toastify";
import {getAllBrands} from "@/http/Product/brandAPI";

const ProductBrand = ({deviceInfo, OnChangeDevice}) => {
    const [filteredBrandArray, setFilteredBrandArray] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [value, setValue] = useState(deviceInfo?.brand?deviceInfo.brand.name : "");

    const uploadBrands = () => {
        if(brandList.length < 1) {
            getAllBrands().then(brands => {
                setBrandList(brands)
                setFilteredBrandArray(brands)
            }).catch(error => {
                toast(error.message)
            })
        }
    };

    const setInputValueOnChange = (value) => {
        setValue(value)
        const filterBrands = brandList.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
        setFilteredBrandArray(filterBrands)
    };

    const setInputValueOnSelect = async (brand) => {
        OnChangeDevice({id:brand.id, name:brand.name, name_ru:brand.name_ru}, "brand",255)
        setValue(brand.name)
    };

    return (
        <div className={classes.product_info_dropdowns}>
            <div><b>Бренд:</b></div>
            <div className={classes.product_input_drop}>
                <div style={{width:"100%"}}>
                    <input placeholder='Бренд' value={value} type="text" maxLength={254}
                           onClick={uploadBrands} className={!deviceInfo.brand?.name && classes.red_input}
                           onChange={(e) => setInputValueOnChange(e.target.value)}/>
                    {filteredBrandArray.length > 0
                        ? <div className={classes.product_drop_down}>
                            {filteredBrandArray.map((brandElem) => {
                                return (<div key={brandElem.name}
                                             onClick={() => setInputValueOnSelect(brandElem)}
                                             className={classes.product_dropDown_item}>{brandElem.name}</div>)
                            })}
                        </div>
                        : <div></div>}
                </div>
            </div>
        </div>
    );
};


export default ProductBrand;
