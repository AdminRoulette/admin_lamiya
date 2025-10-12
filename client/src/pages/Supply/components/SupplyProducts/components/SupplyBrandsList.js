import React, {useState} from 'react';
import {toast} from "react-toastify";
import classes from "@/pages/Product/productPage.module.scss";
import {getAllBrands} from "@/http/Product/brandAPI";

const SupplyBrandsList = ({setBrandId}) => {
    const [filteredBrandArray, setFilteredBrandArray] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [value, setValue] = useState("");

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
        if(value) {
            const filterBrands = brandList.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
            setFilteredBrandArray(filterBrands)
        }else{
            setBrandId(null)
        }
    };

    const setInputValueOnSelect = async (brand) => {
        setBrandId(brand.id)
        setValue(brand.name)
    };

    return (
        <div className={classes.product_info_dropdowns}>
            <div className={classes.product_input_drop}>
                <div style={{width:"100%",margin:"0"}}>
                    <input placeholder='Бренд' value={value} type="text" maxLength={254}
                           onClick={uploadBrands}
                           onChange={(e) => setInputValueOnChange(e.target.value)}/>
                    {filteredBrandArray.length > 0 &&
                        <div className={classes.product_drop_down}>
                            {filteredBrandArray.map((brandElem) => {
                                return (<div key={brandElem.name}
                                             onClick={() => setInputValueOnSelect(brandElem)}
                                             className={classes.product_dropDown_item}>{brandElem.name}</div>)
                            })}
                        </div>
                        }
                </div>
            </div>
        </div>
    );
};

export default SupplyBrandsList;