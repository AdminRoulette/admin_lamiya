import React, {useEffect, useState} from "react";
import classes from "../../../productPage.module.scss";
import {AddAllNotes} from "@/http/Product/filtersAPI";
import {toast} from "react-toastify";

const FilterDropDown = ({valueList, filter, setFilters}) => {

    const [filteredList, setFilteredList] = useState(valueList.values);
    const [list, setList] = useState(valueList.values);
    const [value, setValue] = useState("");

    const setInputValueOnChange = (value) => {
        setValue(value)
        const filterArrWarehouse = list.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
        setFilteredList(filterArrWarehouse)
    };

    const setInputValueOnSelect = async (value) => {
        setFilters(prev => {
            const exists = prev.some(prevElem => prevElem.code === valueList.code);
            if (exists) {
                return prev.map(prevElem => {
                    if (prevElem.code === valueList.code) {
                        if(prevElem.values.find(item => item.code === value.code)) {
                            return prevElem;
                        }
                        return {
                            ...prevElem,
                            values: [...prevElem.values, {
                                id: value.id,
                                product_value_id:`new_${new Date().getTime()}`,
                                name: value.name,
                                code: value.code
                            }]
                        };
                    }
                    return prevElem;
                });
            } else {
                return [...prev, {
                    code: valueList.code,
                    name: valueList.name,
                    values: [{name: value.name, id: value.id,  product_value_id:`new_${new Date().getTime()}`, code: value.code}]
                }];
            }
        })
        setFilteredList(list)
        setValue("")
    };
    // console.log(filter)
    const deleteFormulas = async (id) => {
        setFilters(prev => prev.map((prevElem) => {
            if (prevElem.code === filter.code) {
                return {...filter, values: filter.values.filter(item => item.id !== id)}
            } else {
                return {...prevElem}
            }
        }))
    };

    const CheckNotes = async () => {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await AddAllNotes(value).then(async (data) => {
            if(data.found.length > 0){
                for(const note of data.found){
                   await setInputValueOnSelect(note)
                   await sleep(100);
                }
            }
            setValue(data.not_found)
        }).catch(error => {
                toast(error.message)
            })
    };

    return (
        <div className={classes.product_input_drop}>
            <div>
                <div className={classes.product_select_block}>
                    {filter?.values.map((item) => {
                        return (<div key={item.id} className={classes.product_select_item}>
                            {item.name}
                            <span onClick={() => deleteFormulas(item.id)}
                                  className="material-symbols-outlined">close</span>
                        </div>)
                    })}
                </div>
                <input value={value} placeholder={valueList.name} type="text" maxLength={500}
                       onChange={(e) => setInputValueOnChange(e.target.value)}/>
                {filteredList.length > 0 && <div className={classes.product_drop_down}>
                    {filteredList.map((item) => {
                        return (<div key={item.id}
                                     onClick={() => setInputValueOnSelect(item)}
                                     className={classes.product_dropDown_item}>{item.name}</div>)
                    })}
                </div>}
            </div>
            {valueList.code === 'note'  && <>
                <button onClick={CheckNotes} className={"second_btn"}>Усі</button>
            </>}
            {/*<span className={"material-symbols-outlined"}>add_box</span>*/}
        </div>);
};

export default FilterDropDown;
