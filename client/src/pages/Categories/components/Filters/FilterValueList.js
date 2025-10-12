import React, {useState} from 'react';
import classes from "@/pages/Categories/moderation.module.scss";
import FilterValue from "@/pages/Categories/components/Filters/FilterValue";
import {toast} from "react-toastify";
import {addCategoryFilters, deleteCategoryFilters} from "@/http/Product/filtersAPI";

const FilterValueList = ({valueArray, selected, setFilters, selectCategoryId, filterId,openValuesModal}) => {

    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSingle = (value) => {
        const id = value.id;
        const already = selectedIds.includes(id);
        if (already) {
            setSelectedIds((prev) => prev.filter((item) => item !== id))
        } else {
            setSelectedIds((prev) => [...prev, id]);
        }
    }

    const toggleGroup = () => {
        const ids = [];
        if (selectedIds.length !== valueArray.length) {
            for (const item of valueArray) {
                if (item.select === selected) {
                    ids.push(item.id);
                }
            }
            setSelectedIds(ids)
        } else {
            setSelectedIds([]);
        }
    }

    const handleSubmit = async () => {
        if (selectedIds.length === 0 || !selectCategoryId) {
            toast("Оберіть категорію і значення");
            return;
        }

        const updateFilterValues = () => {
            setFilters((prevFilters) =>
                prevFilters.map((f) => {
                    if (f.id !== filterId) return f;
                    return {
                        ...f,
                        values: f.values.map((v) => {
                                if (!selectedIds.includes(v.id)) return v;
                                return {...v, select: !v.select};
                            }
                        )
                    };
                })
            );
        };

        try {
            const params = {
                ids: selectedIds,
                categoryId: selectCategoryId,
            };

            if (selected) {
                await deleteCategoryFilters(params);
                updateFilterValues(false);
            } else {
                await addCategoryFilters(params);
                updateFilterValues(true);
            }

            setSelectedIds([]);
            toast(`Успішно ${selected?"відв'язано": "прив'язано"}`);
        } catch (error) {
            toast(error.message || "Помилка при оновленні");
        }
    };

    return (<div className={classes.selected_list}>

        <div className={classes.selected_list_btn}>
            {selectedIds.length > 0 && (<button
                onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit();
                }}
                className="second_btn"
            >
                {selected ? "Відв'язати" : "Прив'язати:"}
            </button>)}
        </div>

        <div className={classes.list_header}>
            <input
                type="checkbox"
                checked={selectedIds.length === valueArray.length}
                onChange={toggleGroup}
                style={{visibility: valueArray.length > 0 ? 'visible' : "hidden"}}
            />
            <span>{selected ? "Прив'язані:" : "Відв'язані"}</span>
        </div>
        {valueArray.map((value) => (<FilterValue
            openValuesModal={openValuesModal}
            value={value}
            key={value.id}
            checked={selectedIds.includes(value.id)}
            onChangeCheck={() => toggleSingle(value)}
            setFilters={setFilters}
        />))}
    </div>);
};

export default FilterValueList;