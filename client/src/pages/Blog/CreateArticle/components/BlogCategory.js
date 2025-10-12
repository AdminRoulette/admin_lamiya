import React, {useEffect, useState} from "react";
import classes from "../../blog.module.scss";

const BlogCategory = ({categoriesList, setCategory,category}) => {
    const [categoryArray, setCategoryArray] = useState(categoriesList);
    const [value, setValue] = useState(category?category:"");

    useEffect(() => {
        setCategoryArray(categoriesList)
        setValue(category)
    }, [categoriesList,category]);

    function NewSort(x1, x2) {
        return x1.name.localeCompare(x2.name);
    }

    const setInputValueOnChange = (value) => {
        setValue(value)
        const filterBrands = categoriesList.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
        setCategoryArray(filterBrands.length > 0 ? filterBrands : categoriesList)
    };

    const setInputValueOnSelect = async (name) => {
        setCategory(name)
        setValue(name)
    };

    return (
        <div className={classes.product_name}>
            <div>Категорія:</div>
            <div className={classes.product_input_drop}>
                <div style={{width:"100%"}}>
                    <input placeholder='Категорія' value={value} type="text" maxLength={254}
                           onChange={(e) => setInputValueOnChange(e.target.value)}/>
                    {categoryArray.length > 0
                        ? <div className={classes.product_drop_down}>
                            {categoryArray.sort(NewSort).map((authorElem) => {
                                return (<div key={authorElem.name}
                                             onClick={() => setInputValueOnSelect(authorElem.name)}
                                             className={classes.product_dropDown_item}>{authorElem.name}</div>)
                            })}
                        </div>
                        : <div></div>}
                </div>
            </div>
        </div>
    );
};


export default BlogCategory;
