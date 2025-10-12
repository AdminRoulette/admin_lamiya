import React from 'react';
import classes from "@/pages/Product/productPage.module.scss";
import FilterDropDown from "@/pages/Product/modals/CreateDeviceComponents/CosmeticsCareFields/FilterDropDown";

const CreateDeviceCategoryFields = ({
                                        setFilters,
                                        filters,
                                        filterList
                                    }) => {
    return (<div>
        <div className={classes.product_row_second}>
            {filterList.map((item) => (
                <FilterDropDown valueList={item} filter={filters.find(obj => obj.code === item.code)}
                                setFilters={setFilters}/>
            ))}
        </div>
    </div>);
};

export default CreateDeviceCategoryFields;
