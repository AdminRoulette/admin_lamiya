import React, {useEffect, useState} from "react";
import {getAdminOneDevice} from "@/http/Product/deviceAPI";
import ModalFooter from "./CreateDeviceComponents/ModalFooter";
import OptionsModule from "./CreateDeviceComponents/OptionsModule/OptionsModule";
import ProductInfo from "./CreateDeviceComponents/ProductMainInfo/ProductInfo";
import classes from "../productPage.module.scss";
import CategoryList from "@/pages/Product/modals/components/CategoryList";
import CustomTextArea from "@/components/customTextArea";
import OptionParfumeModal from "@/pages/Product/modals/CreateDeviceComponents/OptionsModule/OptionParfumeModal";
import CreateDeviceCategoryFields from "@/pages/Product/modals/CreateDeviceCategoryFields";
import PartCountField from "@/pages/Product/modals/CreateDeviceComponents/ParfumeField/PartCountField";
import CosmeticsCareFields from "@/pages/Product/modals/CreateDeviceComponents/CosmeticsCareFields/CosmeticsCareFields";
import TagsFields from "@/pages/Product/modals/CreateDeviceComponents/TagsFields/TagsFields";
import SimilarProducts from "@/pages/Product/modals/components/SimilarProducts";

const CreateDevice = ({editingState, onHide, setSearch}) => {

    const [isLoading, setIsLoading] = useState(true);
    const [deviceInfo, setDeviceInfo] = useState({});
    const [options, setOptions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [similarArray, setSimilarArray] = useState([]);
    const [parfumePart, setParfumePart] = useState({});
    const [bodyCare, setBodyCare] = useState({});
    const [filterList, setFilterList] = useState([]);
    const [filters, setFilters] = useState([]);
    const [showOptionModal, setShowOptionModal] = useState(false);

    useEffect(() => {
        if (editingState.type === 'edit') {
            getAdminOneDevice(editingState.id).then((DeviceElem) => {
                setDeviceInfo({
                    id: DeviceElem.id,
                    brand: DeviceElem.brand,
                    name: DeviceElem.name,
                    name_ru: DeviceElem.name_ru,
                    status: DeviceElem.status,
                    hit: DeviceElem.hit,
                    active: DeviceElem.active,
                    weekdiscount: DeviceElem.weekdiscount,
                    newImage: [],
                    disc: DeviceElem.disc,
                    disc_ru: DeviceElem.disc_ru,
                    country: DeviceElem.country,
                    series: DeviceElem.series,
                    series_ru: DeviceElem.series_ru,
                    tags: DeviceElem.tags,
                    tags_ru: DeviceElem.tags_ru,
                });
                setSimilarArray(DeviceElem.similarDevices)
                setCategories(DeviceElem.product_categories.map(category => ({
                    product_category_id: category.id,
                    id: category.category.id,
                    name: category.category.name,
                    code: category.category.code,
                    level: category.category.level
                })))
                setFilters(DeviceElem.filters || [])
                setOptions(DeviceElem.deviceoptions)
                setParfumePart({
                    id: DeviceElem.parfumepart?.id,
                    partcount: DeviceElem.parfumepart?.partcount ? DeviceElem.parfumepart.partcount : 0,
                    refund_count: DeviceElem.parfumepart?.refund_count ? DeviceElem.parfumepart.refund_count : 0,
                    on_tab_price: DeviceElem.parfumepart?.on_tab_price ? DeviceElem.parfumepart.on_tab_price : 0
                });
                setBodyCare({
                    composition: DeviceElem.bodycarepart?.composition ? DeviceElem.bodycarepart.composition : "",
                    applicationmethod: DeviceElem.bodycarepart?.applicationmethod ? DeviceElem.bodycarepart.applicationmethod : "",
                    activecomponents: DeviceElem.bodycarepart?.activecomponents ? DeviceElem.bodycarepart.activecomponents : "",
                    applicationmethod_ru: DeviceElem.bodycarepart?.applicationmethod_ru ? DeviceElem.bodycarepart.applicationmethod_ru : "",
                    activecomponents_ru: DeviceElem.bodycarepart?.activecomponents_ru ? DeviceElem.bodycarepart.activecomponents_ru : ""
                });

            }).finally(() => {
                setIsLoading(false)
            })
        } else {
            setDeviceInfo({
                brand: {},
                name: "",
                name_ru: "",
                status: "",
                hit: false,
                active: false,
                weekdiscount: false,
                newImage: [],
                disc: "",
                disc_ru: "",
                country: {},
                series: "",
                series_ru: "",
                tags: "",
                tags_ru: "",
            });
            setParfumePart({
                volume: 0,
                partcount: 0,
                refund_count: 0,
                on_tab_price: 0,
            });
            setBodyCare({
                composition: "",
                applicationmethod: "",
                activecomponents: "",
                applicationmethod_ru: "",
                activecomponents_ru: "",
            });
            setIsLoading(false)
        }

    }, []);
    const OnChangeDevice = (value, field, length) => {
        if (typeof value === 'string' && value.length > length) {
            value = value.slice(0, length);
        }
        setDeviceInfo(prev => ({...prev, [field]: value}))
    }
    const closeModal = () => {
        const modal = document.getElementById('modalId');
        if (modal) {
            modal.classList.add('closingModal');
            window.setTimeout(() => {
                onHide();
            }, 500);
        } else {
            onHide();
        }
        setDeviceInfo({});
        setOptions([]);
        setParfumePart({});
        setBodyCare({});
        document.body.style.overflow = '';
    }
    const addProperty = () => {
        if(!options.some((item)=> item.id === `new_${Math.floor(Date.now() / 1000)}`)){
            setOptions(prev => [...prev, {
                optionName: "",
                optionName_ru: "",
                startPrice: "0",
                weight: "",
                price: "0",
                saleprice: "0",
                count: "0",
                code: "",
                index: `${prev.length}`,
                id: `new_${Math.floor(Date.now() / 1000)}`,
                marketPrice: 0,
                marketPromoPrice: 0,
                marketOldPrice: 0,
                sell_type:"",
                deviceimages:[]
            }]);
        }
    };

    const OnChangeBodyCare = (value, field, length) => {
        if (typeof value === 'string' && value.length > length) {
            value = value.slice(0, length);
        }
        setBodyCare(prev => ({...prev, [field]: value}))
    }

    return (<div className="modal_main">
        {showOptionModal && <OptionParfumeModal
            closeModal={() => {
                setShowOptionModal(false);
                document.body.style.overflow = '';
            }}
            setOptions={setOptions}
        />}
        <div onClick={() => closeModal()} className="modal_bg"/>
        <div className={'modal_container' + ' ' + classes.product_edit_container}>
            <div className="modal_header">
                <div>{editingState.type === 'edit' ? "Редагувати товар"  : "Додати товар"}</div>
                <svg onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none"
                     stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                </svg>
            </div>
            {!isLoading ? <div className={"modal_body" + ' ' + classes.product_edit_body}>
                <div className={classes.product_edit_row}>
                    <CategoryList categories={categories} setFilterList={setFilterList}
                                  setCategories={setCategories}/>
                </div>
                <div className={classes.product_edit_row}>
                    <ProductInfo deviceInfo={deviceInfo} setParfumePart={setParfumePart} parfumePart={parfumePart}
                                 OnChangeDevice={OnChangeDevice} categories={categories}/>
                </div>
                <div className={classes.product_edit_row}>
                    <TagsFields tags={deviceInfo.tags} tags_ru={deviceInfo.tags_ru} setDeviceInfo={setDeviceInfo}/>
                </div>

                <b>Опції:</b>
                <div className={classes.product_edit_row}>
                    <button
                        className={`${classes.product_upload_btn} second_btn ${options.length < 1 && classes.red_input}`}
                        onClick={addProperty}>
                        + Додати пусту опцію
                    </button>
                    <button className={classes.product_upload_btn + " " + "second_btn"}
                            onClick={() => {
                                setShowOptionModal(true);
                                document.body.style.overflow = 'hidden'
                            }}>
                        Додати опцію парфумів
                    </button>
                </div>
                <div className={classes.product_edit_row}>
                    <OptionsModule
                        options={options}
                        setOptions={setOptions}
                    />
                </div>
                <b>Схожі товари</b>
                <div className={classes.product_edit_row}>
                    <SimilarProducts setSimilarArray={setSimilarArray} similarArray={similarArray}/>
                </div>
                {filterList.length > 0 &&
                    <CreateDeviceCategoryFields setFilters={setFilters} filters={filters} filterList={filterList}/>}
                <div><b>Опис:</b></div>
                <CustomTextArea onChange={(event) => OnChangeDevice(event.target.value, "disc", 1999)}
                                maxLength={1999} placeholder={"Опис"} value={deviceInfo.disc}/>
                <div><b>RU Опис:</b></div>
                <CustomTextArea onChange={(event) => OnChangeDevice(event.target.value, "disc_ru", 1999)}
                                maxLength={1999} placeholder={"RU Опис"} value={deviceInfo.disc_ru}/>
                {categories.some(item => (item.id === 89 || item.id === 95)) &&
                    <PartCountField setParfumePart={setParfumePart} parfumePart={parfumePart} setOptions={setOptions}/>}
                {categories.some(item => (item.id === 57 || item.id === 58 || item.id === 59 || item.id === 69)) &&
                    <CosmeticsCareFields bodyCare={bodyCare} OnChangeBodyCare={OnChangeBodyCare}/>}
            </div> : <></>}
            <ModalFooter
                setSearch={setSearch}
                filters={filters}
                categories={categories}
                deviceInfo={deviceInfo}
                options={options}
                parfumePart={parfumePart}
                bodyCare={bodyCare}
                onHide={closeModal}
                editingState={editingState}
                similarArray={similarArray}
            />
        </div>
    </div>);
};

export default CreateDevice;
