import React, {useEffect, useState} from 'react';
import {getProducts, getSupplyLongInfo} from "@/http/supplysApi";
import {toast} from "react-toastify";
import classes from "@/pages/Supply/supply.module.scss";
import SupplyBrandsList from "@/pages/Supply/components/SupplyProducts/components/SupplyBrandsList";
import SupplyProductOption from "@/pages/Supply/components/SupplyProducts/components/SupplyProductOption";
import CreateSupplyModal from "@/pages/Supply/components/SupplyModal/createSupplyModal";

const SupplyProducts = () => {
    const [productsListInSupply, setProductsListInSupply] = useState([]);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [brandId, setBrandId] = useState(null);
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);
    document.title = "Список поставок"

    useEffect(() => {
        getSupplyLongInfo("").then((data) => {
            setProductsListInSupply(data);
        }).catch(error => {
            toast(error.response.data.message)
        });
    }, []);

    const getSupplyProducts = () => {
        if(brandId || company || name) {
            getProducts(new URLSearchParams({...(name && {name}), ...(company && {company}), ...(brandId && {brandId})})).then((data) => {
                setProducts(data);
            }).catch(error => {
                toast(error.response.data.message)
            });
        }else{
            toast("Оберіть хоча б 1 параметр")
        }
    };

    const OpenModal = () => {
        setIsOpenAddModal(true);
        document.body.style.overflow = 'hidden'
    };

    const CloseModal = () => {
        setIsOpenAddModal(false);
        document.body.style.overflow = ''
    };

    return (
        <div>
            {isOpenAddModal && <CreateSupplyModal onHide={CloseModal}/>}
            <div className={classes.supply_product_filters}>
                <div className="custom-select">
                    <select value={company || ""}
                            onChange={(event) => setCompany(event.target.value)}>
                        <option value="">Оберіть постачальника</option>
                        <option value="fluid">Fluid</option>
                    </select>
                </div>
                <SupplyBrandsList setBrandId={setBrandId}/>
                <label className="input_with_placeholder">
                    <input value={name || ""} type="text" maxLength="100"
                           placeholder=""
                           onChange={(e) => setName(e.target.value)}/>
                    <span className="input_field_placeholder">Назва товару</span>
                </label>
                <button className='custom_btn' onClick={()=>getSupplyProducts()}>Шукати</button>
                <button className='second_btn' onClick={OpenModal}>Додати</button>
            </div>
            <div className={classes.supply_product_container}>
                {(products && products.length > 0) && products.sort((a,b) => {
                    if (a.total_sell_rate !== b.total_sell_rate) {
                        return a.total_sell_rate - b.total_sell_rate;
                    } else {
                        const aHasZero = a.options?.some(opt => opt.count === 0);
                        const bHasZero = b.options?.some(opt => opt.count === 0);

                        if (aHasZero && !bHasZero) return -1;
                        if (!aHasZero && bHasZero) return 1;
                        return 0;
                    }
                }).map((product) => {
                    return (
                        <div className={classes.supply_product_item}>
                            <div>{product.name}</div>
                            {(product.options && product.options.length > 0) && product.options.map((option) => {
                                return (
                                    <SupplyProductOption key={option.id} productsListInSupply={productsListInSupply} product={product} option={option}/>
                                )})}
                        </div>
                    )})}
            </div>
        </div>
    );
};

export default SupplyProducts;