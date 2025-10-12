import React, {useEffect, useState} from "react";
import classes from "../../blog.module.scss";

const BlogAuthor = ({authorsList, setAuthor,author}) => {
    const [authorArray, setAuthorArray] = useState(authorsList);
    const [value, setValue] = useState(author?author:"");

    useEffect(() => {
        setAuthorArray(authorsList)
        setValue(author)
    }, [authorsList,author]);

    function NewSort(x1, x2) {
        return x1.name.localeCompare(x2.name);
    }

    const setInputValueOnChange = (value) => {
        setValue(value)
        const filterBrands = authorsList.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
        setAuthorArray(filterBrands.length > 0 ? filterBrands : authorsList)
    };

    const setInputValueOnSelect = async (name) => {
        setAuthor(name)
        setValue(name)
    };

    return (
        <div className={classes.product_name}>
            <div>Автор:</div>
            <div className={classes.product_input_drop}>
                <div style={{width:"100%"}}>
                    <input placeholder='Автор' value={value} type="text" maxLength={254}
                           onChange={(e) => setInputValueOnChange(e.target.value)}/>
                    {authorArray.length > 0
                        ? <div className={classes.product_drop_down}>
                            {authorArray.sort(NewSort).map((authorElem) => {
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


export default BlogAuthor;
