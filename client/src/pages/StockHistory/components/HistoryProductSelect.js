import React, {useState} from 'react';
import {getProductList} from "@/http/Product/deviceAPI";
import classes from "@/pages/Product/productPage.module.scss";

const HistoryProductSelect = ({setProduct}) => {
    const [productList, setProductList] = useState([]);
    const [value, setValue] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(false);

    const setInputValueOnChange = (value) => {
        setValue(value);

        if (searchTimeout !== false) {
            clearTimeout(searchTimeout);
        }
        setSearchTimeout(setTimeout(async () => {
            const devElems = await getProductList({ name: value });
            setProductList(devElems);
            setProduct(null);
        }, 700));
    };

    const setInputValueOnSelect = async (product) => {
        setProduct(product)
        setValue(product.name)
    };

    return (
        <div className={classes.product_info_dropdowns}>
            <div className={classes.product_input_drop}>
                <div style={{width:"100%",margin:"0"}}>
                    <input placeholder='Назва товару чи ID' value={value} type="text" maxLength={50}
                           onChange={(e) => setInputValueOnChange(e.target.value)}/>
                    {productList.length > 0 &&
                        <div className={classes.product_drop_down}>
                            {productList.map((product) => {
                                return (<div key={product.id}
                                             onClick={() => setInputValueOnSelect(product)}
                                             className={classes.product_dropDown_item}>{product.name}</div>)
                            })}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default HistoryProductSelect;