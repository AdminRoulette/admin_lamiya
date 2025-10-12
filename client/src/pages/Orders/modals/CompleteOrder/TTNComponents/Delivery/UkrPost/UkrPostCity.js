import React, {useEffect, useRef, useState} from 'react';
import classes from "../Checkout.module.scss";
import {getCityList} from "@/http/ExternalApi/addressesAPI";

const UkrPostCity = ({
                         defaultUkrCityList, input_REGEXP,
                         language, changeDeliveryData, deliveryData
                     }) => {

    const [arrCity, setArrCity] = useState(null);
    const [cityLoading, setCityLoading] = useState(false);
    const [inputCity, setInputCity] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(false);
    const refCityInput = useRef(null);
    const [ukrCityName, setUkrCityName] = useState("");
    const [isShowCityList, setIsShowCityList] = useState(false);

    useEffect(() => {
        setIsShowCityList(false)
    }, [deliveryData.postMethod]);

    const onChangeCity = async (name) => {
        const cityName = name.replace('`',"'").trim()
        if ((cityName.match(input_REGEXP)) || cityName === "") {
            setInputCity(cityName);
            if (searchTimeout !== false) {
                clearTimeout(searchTimeout);
            }
            if (cityName.length > 2) {
                setSearchTimeout(setTimeout(await getCityListByName, 700, cityName));
            } else {
                setArrCity(null);
            }
        }
    };

    const showCityList = () => {
        setIsShowCityList(prevState => !prevState);
        refCityInput.current.focus();
    };

    const onClickCity = async (cityName) => {
        setUkrCityName(cityName.name)
        changeDeliveryData({cityRef: cityName.city_id, warehouseRef: ""})
        showCityList()
        setInputCity("")
        setArrCity(null);
    };

    const getCityListByName = async (CityName) => {
        setCityLoading(true)
        await getCityList({name:CityName, language ,provider:deliveryData.postMethod}).then((cityList) => {
            setArrCity(cityList);
        }).finally(()=>{
            setCityLoading(false)
        })
    }
    return (
        <>
            <div onClick={()=>setIsShowCityList(false)}
                 className={`${classes.delivery_dropDown_bg} ${isShowCityList ? classes.active : ""}`}/>
            <div className={classes.delivery_label}>{language ? "Населённый пункт" : "Населений пункт"}</div>
            <div onClick={() => showCityList()} className={classes.delivery_city_button}>
                {ukrCityName ? <span>{ukrCityName}</span>
                    : <span
                        className={classes.cityNameDefault}>{language ? 'Выберите населенный пункт' : 'Оберіть населений пункт'}</span>}
                <svg className={isShowCityList ? classes.rotated : ''} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            </div>
            <div className={`${classes.delivery_dropDown_cont} ${isShowCityList ? classes.active : ''}`}>
                <div className={classes.delivery_dropDown_block}>
                    <div className={classes.delivery_dropDown_header}>
                        <svg onClick={() => showCityList()} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 19-7-7 7-7"/>
                            <path d="M19 12H5"/>
                        </svg>
                        <span>{language
                            ? 'Населенный пункт'
                            : 'Населений пункт'}</span>
                    </div>
                    <div className={classes.delivery_city_input}>
                        <div className={classes.delivery_city_svg}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="m21 21-4.3-4.3"/>
                            </svg>
                        </div>
                        <input ref={refCityInput} type="text" onChange={(e) => onChangeCity(e.target.value)}
                               value={inputCity} maxLength={255}
                               placeholder={language ? 'Введите название населенного пункта' : 'Введіть назву населеного пункту'}/>
                    </div>
                    <div
                        className={classes.delivery_gray_text}>{language
                        ? 'Введите название населенного пункта от 2-х букв'
                        : 'Введіть назву населеного пункту від 2-x букв'}
                    </div>
                    <div className={classes.delivery_loaded + (cityLoading ? ` ${classes.loaded}` : "")}/>

                    <ul className={classes.delivery_city_list}>
                        {arrCity?.length > 0 ?
                            arrCity.map((city, index) => {
                                return <li key={index} title={city.name}
                                           onClick={() => onClickCity(city)}>
                                    <span>{city.name}</span>
                                </li>
                            })
                            :
                            <>
                                {arrCity?.length === 0 &&
                                    <div className={classes.empty_delivery_list}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 64 64"
                                            width={64}
                                            height={64}
                                        >
                                            <path fill="#dadcec" d="m40.172 44 3.918-3.917 2.828 2.829-3.917 3.917z"/>
                                            <rect
                                                width={8.49}
                                                height={22.51}
                                                x={48.8}
                                                y={41.79}
                                                fill="#cda1a7"
                                                rx={4}
                                                ry={4}
                                                transform="rotate(-45 53.04 53.04)"
                                            />
                                            <rect
                                                width={4.24}
                                                height={22.51}
                                                x={49.42}
                                                y={43.29}
                                                fill="#c4939c"
                                                rx={2.12}
                                                ry={2.12}
                                                transform="rotate(-45 51.542 54.54)"
                                            />
                                            <path fill="#ffeb9b" d="M25 1a24 24 0 1 0 0 48 24 24 0 1 0 0-48"/>
                                            <path
                                                fill="#f6d397"
                                                d="m11.14 38.86 27.72-27.72a4 4 0 0 1 6.11.54A24 24 0 0 1 11.68 45a4 4 0 0 1-.54-6.14"
                                            />
                                            <path fill="#bbdef9" d="M25 7a18 18 0 1 0 0 36 18 18 0 1 0 0-36"/>
                                            <path fill="#d2edff" d="M25 18a7 7 0 1 0 0 14 7 7 0 1 0 0-14"/>
                                            <path
                                                fill="#f3f3f3"
                                                d="M21 17a4 4 0 1 0 0 8 4 4 0 1 0 0-8m8.5 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3"
                                            />
                                            <path
                                                fill="#8d6c9f"
                                                d="M38.44 11.57a19 19 0 1 0 0 26.87 18.88 18.88 0 0 0 0-26.87M37 37a17 17 0 1 1 0-24 16.89 16.89 0 0 1 0 24"
                                            />
                                            <path
                                                fill="#8d6c9f"
                                                d="M31.2 14.72a12 12 0 0 1 2.28 1.79 1 1 0 1 0 1.42-1.41 14 14 0 0 0-2.67-2.1 1 1 0 0 0-1 1.71zm-4.82-3.65a14 14 0 0 0-11.27 4 1 1 0 1 0 1.41 1.41 12 12 0 0 1 9.67-3.46 1 1 0 1 0 .2-2z"
                                            />
                                            <path
                                                fill="#8d6c9f"
                                                d="M61.88 54.46 51.54 44.12a5 5 0 0 0-3.6-1.45c0-.14-2.77-2.91-2.77-2.91a25 25 0 1 0-5.41 5.41s2.78 2.72 2.91 2.77 0 0 0 .07a5 5 0 0 0 1.46 3.54l10.33 10.33a5 5 0 0 0 7.07 0l.34-.34a5 5 0 0 0 0-7.07ZM2 25a23 23 0 1 1 23 23A23 23 0 0 1 2 25m42.12 19.46a5 5 0 0 0-.92 1.32l-1.87-1.87a25 25 0 0 0 2.59-2.59l1.88 1.88a5 5 0 0 0-1.32.92Zm16.34 15.66-.34.34a3 3 0 0 1-4.24 0L45.54 50.12a3 3 0 0 1 0-4.24l.34-.34a3 3 0 0 1 4.24 0l10.34 10.34a3 3 0 0 1 0 4.24"
                                            />
                                            <path
                                                fill="#8d6c9f"
                                                d="M34.19 32.78a1 1 0 0 0-1.41 1.41l1.41 1.41a1 1 0 0 0 1.41-1.41zm-18.38 0-1.41 1.41a1 1 0 1 0 1.41 1.41l1.41-1.41a1 1 0 0 0-1.41-1.41M39 24h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2m-25 1a1 1 0 0 0-1-1h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1m11 11a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1m13.28-6.45-1.84-.78a1 1 0 1 0-.78 1.84l1.84.78a1 1 0 1 0 .78-1.84M20.7 35.13a1 1 0 0 0-1.31.53l-.78 1.84a1 1 0 1 0 1.84.78l.78-1.84a1 1 0 0 0-.53-1.31m-5.9-6.01a1 1 0 0 0-1.3-.55l-1.85.75a1 1 0 1 0 .75 1.85l1.85-.75a1 1 0 0 0 .55-1.3m15.62 6.63a1 1 0 0 0-1.85.75l.75 1.85a1 1 0 0 0 1.85-.75z"
                                            />
                                        </svg>
                                        <span>{language ? 'Город не найден, проверьте корректность названия'
                                            : 'Місто не знайдено, перевірте коректність назви'}</span>
                                    </div>}
                                <li className={classes.delivery_dropDown_title}>
                                    <span>
                                        {language ? 'Популярные населенные пункты' : 'Популярні населені пункти'}
                                    </span>
                                </li>
                                {defaultUkrCityList.map((city, index) => {
                                    return <li key={index} title={city.name} onClick={() => onClickCity(city)}>
                                        <span>{city.name}</span>
                                    </li>
                                })}
                            </>}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default UkrPostCity;