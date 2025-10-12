import React, {useState} from "react";
import classes from "../../../productPage.module.scss";
import {toast} from "react-toastify";
import {getAllCountries} from "@/http/Product/filtersAPI";

const ProductCountry = ({deviceInfo, OnChangeDevice}) => {
    const [filteredCountryArray, setFilteredCountryArray] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [value, setValue] = useState(deviceInfo?.country ? deviceInfo.country.name :"");

    const uploadCountries = () => {
        if(countryList.length < 1) {
            getAllCountries().then(countries => {
                setCountryList(countries)
                setFilteredCountryArray(countries)
            }).catch(error => {
                toast(error.message)
            })
        }
    };

    const setInputValueOnChange = (value) => {
        setValue(value)
        const filterCountries = countryList.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
        setFilteredCountryArray(filterCountries)
    };

    const setInputValueOnSelect = async (country) => {
        OnChangeDevice({id:country.id,name:country.name}, "country",255)
        setValue(country.name)
    };

    return (
        <div className={classes.product_info_dropdowns}>
            <div><b>Країна:</b></div>
            <div className={classes.product_input_drop}>
                <div style={{width:"100%"}}>
                    <input placeholder='Країна' value={value} type="text" maxLength={254}
                           onClick={uploadCountries} className={!deviceInfo.country?.name && classes.red_input}
                           onChange={(e) => setInputValueOnChange(e.target.value)}/>
                    {filteredCountryArray.length > 0
                        ? <div className={classes.product_drop_down}>
                            {filteredCountryArray.map((countryElem) => {
                                return (<div key={countryElem.name}
                                             onClick={() => setInputValueOnSelect(countryElem)}
                                             className={classes.product_dropDown_item}>{countryElem.name}</div>)
                            })}
                        </div>
                        : <div></div>}
                </div>
            </div>
        </div>
    );
};


export default ProductCountry;
