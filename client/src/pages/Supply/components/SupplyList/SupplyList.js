import React, {useEffect, useState} from 'react';
import {getSupplyList} from "@/http/supplysApi";
import classes from '../../supply.module.scss';
import {toast} from "react-toastify";
import SupplyItem from "@/pages/Supply/components/SupplyList/SupplyItem";

const SupplyList = () => {
    const [company, setCompany] = useState("");
    const [option_id, setOption_id] = useState("");
    const [offset, setOffset] = useState(0);
    const [supplyList, setSupplyList] = useState([]);

    const companyList = ["Bunny", "Cosmic", "Factory","Sparcos", "Styls", "Selectum","Lux","Fluid","ParfumerWorld","Власна поставка", "OptParfume"]

    useEffect(() => {
        document.title = "Список поставок"
        getSupplyData();
    }, []);

    const getSupplyData = (new_offset = offset,update= true) => {
        setOffset(new_offset);
        getSupplyList(new URLSearchParams({offset:new_offset,...(option_id && {option_id}),...(company && {company})})).then((data) => {
            if(update){
                setSupplyList(data);
            }else{
                setSupplyList(prev => [...prev,...data]);
            }
        }).catch(error => {
            toast(error.response.data.message)
        });
    };


    return (
        <div className={classes.tab_container}>
            <div className={classes.supply_expense}>
                <div className={classes.supply_filters}>
                    <div className="custom-select">
                        <select value={company || ""}
                                onChange={(event) => setCompany(event.target.value)}>
                            <option value="">Оберіть постачальника</option>
                            {companyList.map((item) => {
                                return <option value={item} key={item}>{item}</option>;
                            })}
                        </select>
                    </div>
                    <label className="input_with_placeholder">
                        <input value={option_id || ""} type="text" maxLength="100"
                               placeholder=""
                               onChange={(e) => setOption_id(e.target.value)}/>
                        <span className="input_field_placeholder">Код опції в накладній</span>
                    </label>
                    <button className='custom_btn' onClick={()=>getSupplyData(0)}>Шукати</button>
                </div>

                <h2>Список поставок товарів</h2>
                {supplyList.length > 0 ? supplyList.map((supply) => {
                    return (<SupplyItem key={supply.id} supply={supply} setSupplyList={setSupplyList}/>)
                }) : <div>Немає відповідних поставок</div>}
                {(supplyList.length > 0 && supplyList.length % 20 === 0) && <button className='second_btn' onClick={()=>getSupplyData(offset+1,false)}>Завантажити ще</button>}
            </div>
        </div>
    );
};

export default SupplyList;