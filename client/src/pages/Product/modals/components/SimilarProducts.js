import React, {useState} from 'react';
import {SearchSimilar} from "@/http/Product/deviceAPI";
import {toast} from "react-toastify";
import classes from '../../productPage.module.scss'

const SimilarProducts = ({similarArray, setSimilarArray}) => {
    const [inputValue, setInputValue] = useState('');
    const [productArray, setProductArray] = useState([]);


    const handleSelect = (value) => {
        if(similarArray.some(item => item.id === value.id)) {
            toast("Такий товар вже є в схожих")
            return
        }
        setSimilarArray(prev => [...prev, value]);
    };
    const handleDelete = (id) => {
        setSimilarArray(prev => {
            return prev.filter(item => item.id !== id);
        });
    };

    const handleInputChange = async (value) => {
        setInputValue(value)
        await SearchSimilar(value).then((array) => {
            setProductArray(array)
        }).catch((err) => {
            toast.error(err.response.data.message);
        })
    };
    return (
        <>
        <div className={"dropdown_input_container"}>
            <div className="dropdown_input">
                <input
                    type={"text"}
                    value={inputValue}
                    onChange={(event) => handleInputChange(event.target.value)}
                    placeholder={"Вкажіть назву товару"}
                />
            </div>
            {productArray.length > 0 && (
                <div className={"dropdown_list" + " " +classes.similar_drop_list}>
                    {productArray.map((arrayElem, index) => {
                        return (
                            <div
                                key={index}
                                onClick={() => handleSelect(arrayElem)}
                                className={"dropdown_item"+ " " +classes.similar_drop_item}
                            >

                                    <img alt={arrayElem.name} src={arrayElem.deviceoptions[0]?.deviceimages[0]?.image} />
                                    <span>{arrayElem.name}</span>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>

                {similarArray.length > 0 && similarArray.map((arrayElem, index) => {
                    return (
                        <div
                            key={index}
                            className={"dropdown_item" + " " + classes.similar_drop_item}
                        >

                            <img alt={arrayElem.name} src={arrayElem.deviceoptions[0]?.deviceimages[0]?.image}/>
                            <span>{arrayElem.name}</span>
                            <svg onClick={()=>handleDelete(arrayElem.id)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round">
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                <path d="M3 6h18"/>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </div>)
                })}

        </>
    )
};

export default SimilarProducts;