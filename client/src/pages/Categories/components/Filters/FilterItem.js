import React, {useState} from "react";
import classes from "../../moderation.module.scss";
import FilterValue from "@/pages/Categories/components/Filters/FilterValue";
import {Context} from "@/index";
import {toast} from "react-toastify";
import {
    addCategoryFilters, deleteCategoryFilters,
} from "@/http/Product/filtersAPI";
import FilterValueList from "@/pages/Categories/components/Filters/FilterValueList";
import FilterValueModal from "@/pages/Categories/components/Filters/FilterValueModal";

const FilterItem = ({
                        filter, selectCategoryId, setFilters, openFilterModal,
                    }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenValuesModal, setIsOpenValuesModal] = useState(false);
    const [filterValueToEdit, setFilterValueToEdit] = useState(null);

    let selectedValues = [];
    let unselectedValues = [];

    filter.values.forEach((value) => {
        if (value.select) {
            selectedValues.push(value);
        } else {
            unselectedValues.push(value);
        }
    });

    const openValuesModal = (data = null) => {
        setFilterValueToEdit(data);
        setIsOpenValuesModal(true);
        document.body.style.overflow = "hidden";
    };

    return (<div className={classes.filter_block}>
        {isOpenValuesModal && (
            <FilterValueModal
                onHide={() => {
                    setIsOpenValuesModal(false);
                    setFilterValueToEdit(null);
                }}
                setFilters={setFilters}
                filterValueToEdit={filterValueToEdit}
            />
        )}
        <div
            onClick={() => setIsOpen((prev) => !prev)}
            className={classes.filter_header}
        >
            <div className={classes.filter_header_main}>
                <svg
                    style={isOpen ? {rotate: "180deg"} : {}}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m6 9 6 6 6-6"/>
                </svg>
                <span>{filter.name}</span>
                {isOpen && (<>
                    <svg
                        onClick={(e) => {
                            openValuesModal({filter_id: filter.id});
                            e.stopPropagation();
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 12h8"/>
                        <path d="M12 8v8"/>
                    </svg>
                    <svg
                        onClick={(e) => {
                            openFilterModal(filter);
                            e.stopPropagation();
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path
                            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                        <path d="m15 5 4 4"/>
                    </svg>
                </>)}
            </div>
        </div>
        <div className={`${classes.filter_item} ${isOpen ? classes.open : ""}`}>

            <FilterValueList openValuesModal={openValuesModal} filterId={filter.id} selectCategoryId={selectCategoryId}
                             setFilters={setFilters} valueArray={selectedValues} selected={true}
            />
            <FilterValueList openValuesModal={openValuesModal} filterId={filter.id} selectCategoryId={selectCategoryId}
                             setFilters={setFilters} valueArray={unselectedValues} selected={false}
            />
        </div>
    </div>);
};

export default FilterItem;
