import React, {useEffect, useState} from 'react';
import classes from "../../productPage.module.scss";
import {getAllCategory, getFiltersCategory} from "@/http/Product/categoryAPI";
import {toast} from "react-toastify";

const CategoryList = ({categories, setCategories, setFilterList}) => {
    const [categoryList, setCategoryList] = useState([]);
    const [categoryArray3, setCategoryArray3] = useState([]);
    const [categoryArray2, setCategoryArray2] = useState([]);
    const [categoryArray1, setCategoryArray1] = useState([]);
    const [value3, setValue3] = useState("");
    const [value2, setValue2] = useState("");
    const [value1, setValue1] = useState("");

    const uploadCategory = async () => {
        if(categoryList.length < 1){
            await getAllCategory()
                .then((data) => setCategoryList(data))
                .catch(error => {
                    toast(error.message)
                })
        }
    };

    useEffect(() => {
        setCategoryArray3(categoryList.filter(item => +item.level === 3))
        const categoryIds2 = categories.filter(item => item.level === 3).map(item => item.id);
        setCategoryArray2(categoryList.filter(item => ((+item.level === 2) && categoryIds2.includes(+item.parentId))))
        const categoryIds1 = categories.filter(item => item.level === 2).map(item => item.id);
        setCategoryArray1(categoryList.filter(item => ((+item.level === 1) && categoryIds1.includes(+item.parentId))))

        if(categories.length > 0){
            getFiltersCategory({id:categories.sort((a, b) => a.level - b.level || a.product_category_id - b.product_category_id)[0].id})
                .then((filterList) => setFilterList(filterList))
                .catch(error => {
                    toast(error.message)
                })
        }
    }, [categories,categoryList]);

    const setInputValueOnChange = (value,level) => {
        if(level === 1){
            const filterCategoryArr = categoryArray1.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
            setCategoryArray1(filterCategoryArr.length > 0 ? filterCategoryArr
                : setCategoryArray1(categoryList.filter(item => +item.level === 1)))
            setValue1(value)
        }else if(level === 2){
            const filterCategoryArr = categoryArray2.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
            setCategoryArray2(filterCategoryArr.length > 0 ? filterCategoryArr
                : setCategoryArray2(categoryList.filter(item => +item.level === 2)))
            setValue2(value)
        }else if ( level === 3){
            const filterCategoryArr = categoryArray3.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
            setCategoryArray3(filterCategoryArr.length > 0 ? filterCategoryArr
                : setCategoryArray3(categoryList.filter(item => +item.level === 3)))
            setValue3(value)
        }
    };
    const setInputValueOnSelect = async (name, id,code,level) => {
        if(level === 1){
            setCategories([...categories, {product_category_id:`new_${new Date().getTime()}`,name, id,code,level:1}])
            setValue1("")
        }else if(level === 2){
            const categoryIds = categories.filter(item => item.level === 2).map(item => item.id);
            categoryIds.push(id)
            setCategoryArray1(categoryList.filter(item => ((+item.level === 1) && categoryIds.includes(+item.parentId))))
            setCategories([...categories, {product_category_id:`new_${new Date().getTime()}`,name, id,code,level:2}])
            setValue2("")
        }else if ( level === 3){
            const categoryIds = categories.filter(item => item.level === 3).map(item => item.id);
            categoryIds.push(id)
            setCategoryArray2(categoryList.filter(item => ((+item.level === 2) && categoryIds.includes(+item.parentId))))
            setCategories([...categories, {product_category_id:`new_${new Date().getTime()}`,name, id,code,level:3}])
            setValue3("")
        }
    };
    const DeleteCategory = async (code,level) => {
        if(level === 2){
            const categoryIds = categories.filter(item => item.code !== code && +item.level === 1).map(item => item.id);
            setCategoryArray1(categoryList.filter(item => ((+item.level === 1) && categoryIds.includes(+item.parentId))))
        }else if ( level === 3){
            const categoryIds = categories.filter(item => item.code !== code && +item.level === 2).map(item => item.id);
            setCategoryArray2(categoryList.filter(item => ((+item.level === 2) && categoryIds.includes(+item.parentId))))
        }
        setCategories(categories.filter(item => item.code !== code))
    };

    return (
        <div className={classes.category_block}>
            <div className={classes.product_input_drop}>
                <div style={{width: "100%"}}>
                    <div className={classes.product_select_block}>
                        {categories.filter(item => +item.level === 3).map((category) => {
                            return (
                                <div key={category.id} className={classes.product_select_item}>
                                    {category.name}
                                    <span onClick={() => DeleteCategory(category.code,3)}
                                          className="material-symbols-outlined">close</span>
                                </div>
                            )
                        })}
                    </div>
                    <input value={value1} placeholder='Категорії 3 рівня' type="text" maxLength={254}
                           onClick={uploadCategory} className={!categories.some(item => +item.level === 3) && classes.red_input}
                           onChange={(e) => setInputValueOnChange(e.target.value)}/>
                    {categoryArray3.length > 0
                        ? <div className={classes.product_drop_down}>
                            {categoryArray3.map((categoryElem) => {
                                return (<div key={categoryElem.id}
                                             onClick={() => setInputValueOnSelect(categoryElem.name, categoryElem.id, categoryElem.code,3)}
                                             className={classes.product_dropDown_item}>{categoryElem.name}</div>)
                            })}
                        </div>
                        : <div></div>}
                </div>
            </div>

            <div className={classes.product_input_drop}>
                <div style={{width: "100%"}}>
                    <div className={classes.product_select_block}>
                        {categories.filter(item => +item.level === 2).map((category) => {
                            return (
                                <div key={category.id} className={classes.product_select_item}>
                                    {category.name}
                                    <span onClick={() => DeleteCategory(category.code,2)}
                                          className="material-symbols-outlined">close</span>
                                </div>
                            )
                        })}
                    </div>
                    <input value={value2} placeholder='Категорії 2 рівня' type="text" maxLength={254}
                           onClick={uploadCategory} className={!categories.some(item => +item.level === 2) && classes.red_input}
                           onChange={(e) => setInputValueOnChange(e.target.value)}/>
                    {categoryArray2.length > 0
                        ? <div className={classes.product_drop_down}>
                            {categoryArray2.map((categoryElem) => {
                                return (<div key={categoryElem.id}
                                             onClick={() => setInputValueOnSelect(categoryElem.name, categoryElem.id, categoryElem.code,2)}
                                             className={classes.product_dropDown_item}>{categoryElem.name}</div>)
                            })}
                        </div>
                        : <div></div>}
                </div>
            </div>
            <div className={classes.product_input_drop}>
                <div style={{width: "100%"}}>
                    <div className={classes.product_select_block}>
                        {categories.filter(item => +item.level === 1).map((category) => {
                            return (
                                <div key={category.id} className={classes.product_select_item}>
                                    {category.name}
                                    <span onClick={() => DeleteCategory(category.code,1)}
                                          className="material-symbols-outlined">close</span>
                                </div>
                            )
                        })}
                    </div>
                    <input value={value3} placeholder='Категорії 1 рівня' type="text" maxLength={254}
                           onClick={uploadCategory}
                           onChange={(e) => setInputValueOnChange(e.target.value)}/>
                    {categoryArray1.length > 0
                        ? <div className={classes.product_drop_down}>
                            {categoryArray1.map((categoryElem) => {
                                return (<div key={categoryElem.id}
                                             onClick={() => setInputValueOnSelect(categoryElem.name, categoryElem.id, categoryElem.code,1)}
                                             className={classes.product_dropDown_item}>{categoryElem.name}</div>)
                            })}
                        </div>
                        : <div></div>}
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
