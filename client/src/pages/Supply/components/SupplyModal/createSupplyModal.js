import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import {CreateSupply, EditSupply, getSupplyLongInfo} from "@/http/supplysApi";
import classes from "@/pages/Supply/supply.module.scss";
import CreateSupplyProductItem from "@/pages/Supply/components/SupplyModal/CreateSupplyProductItem";
import {SUPPLY_ROUTE} from "@/utils/constants";
import {useNavigate} from "react-router-dom";

const CreateSupplyModal = ({onHide, editData,setSupplyList}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState(editData?.comment || "");
    const [invoice, setInvoice] = useState(editData?.invoice || "");
    const [extra_costs, setExtra_costs] = useState(editData?.extra_costs || 0);
    const [company, setCompany] = useState(editData?.company || "");
    const [deposit, setDeposit] = useState(editData?.deposit || false);
    const companyList = ["Bunny", "Cosmic", "Factory","Sparcos", "Styls", "Selectum","Lux","Fluid","ParfumerWorld","Власна поставка", "OptParfume"]
    const navigate = useNavigate();

    useEffect(() => {
        getSupplyLongInfo(editData ? new URLSearchParams({id: editData.id}) : "").then((data) => {
            setProducts(data);
        }).catch(error => {
            toast(error.response.data.message)
        });
    }, []);

    const checkSupplyData = async () => {
        if (!company) throw new Error("Постачальник не вказаний")
        if (products.length === 0) throw new Error("Список товарів порожній")
    };

    const Create = async () => {
        try {
        setLoading(true);
        await checkSupplyData()
        if(editData){
            await EditSupply({
                ...(comment && {comment}),
                ...(invoice && {invoice}),
                ...(extra_costs && {extra_costs}),
                ...(company && {company}),
                deposit,
                id:editData.id
            }).then(({cost}) => {
                setSupplyList(prev =>
                    prev.map((prevElem) => {
                        if(prevElem.id === editData.id){
                            return {...prevElem,comment,invoice,extra_costs,company,deposit,cost};
                        }else{
                            return {...prevElem}
                        }
                    }))
                onHide();
            }).catch(error => {
                toast(error.response.data.message)
            }).finally(()=>{
                setLoading(false)
            });
        }else{
            await CreateSupply({
                ...(comment && {comment}),
                ...(invoice && {invoice}),
                ...(extra_costs && {extra_costs}),
                ...(company && {company}),
                deposit
            }).then((data) => {
                onHide();
                navigate(`${SUPPLY_ROUTE}/list`)
            }).catch(error => {
                toast(error.response.data.message)
            }).finally(()=>{
                setLoading(false)
            });
        }
        } catch (error) {
            setLoading(false)
            toast(error.message);
        }
    };

    return (
        <div className="modal_main">
            <div onClick={onHide} className="modal_bg"/>
            <div className={'modal_container ' + classes.supply_modal}>
                <div className="modal_header">
                    <div>{editData ? "Редагувати" : "Додати"} поставку</div>
                    <svg onClick={onHide} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className={"modal_body"}>
                    <div className={classes.supply_modal_container}>
                        <div className={classes.supply_modal_info}>
                            <div className="custom-select">
                                <select value={company}
                                        onChange={(event) => setCompany(event.target.value)}>
                                    <option value="">Оберіть постачальника</option>
                                    {companyList.map((item) => {
                                        return <option value={item} key={item}>{item}</option>;
                                    })}
                                </select>
                            </div>
                            <label className="input_with_placeholder">
                                <input value={invoice} type="text" maxLength="100"
                                       placeholder=""
                                       onChange={(e) => setInvoice(e.target.value)}/>
                                <span className="input_field_placeholder">Накладна</span>
                            </label>
                            <label className="input_with_placeholder">
                                <input value={extra_costs} type="text" maxLength="100"
                                       placeholder=""
                                       onChange={(e) => setExtra_costs(e.target.value)}/>
                                <span className="input_field_placeholder">Додаткові витрати, грн</span>
                            </label>
                            <div className={classes.supply_modal_info_check}>
                                <span>Депозит</span>
                                <input type="checkbox"
                                       onChange={() => setDeposit(prev => !prev)} checked={deposit}/>
                            </div>

                        </div>
                        <label className="input_with_placeholder">
                                <textarea value={comment} maxLength="500"
                                          placeholder=""
                                          onChange={(e) => setComment(e.target.value)}/>
                            <span className="input_field_placeholder">Коментар</span>
                        </label>
                        <div className={classes.supply_modal_products_container}>
                            {(products && products.length > 0) && products.map(product => {
                                return (
                                    <CreateSupplyProductItem key={product.id} product={product} setProducts={setProducts}/>
                                )
                            })}
                        </div>

                    </div>
                    <div className="modal_footer">
                        <button onClick={onHide} className="second_btn">Закрить</button>
                        <button disabled={loading} className="custom_btn" onClick={Create}>{editData ? "Редагувати" : "Додати"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSupplyModal;