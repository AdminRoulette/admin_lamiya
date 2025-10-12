import React, { useState } from "react";
import classes from "@/pages/Categories/moderation.module.scss";
import FilterItem from "@/pages/Categories/components/Filters/FilterItem";
import FilterModal from "@/pages/Categories/components/Filters/FilterModal";
import FilterValueModal from "@/pages/Categories/components/Filters/FilterValueModal";

const FilterBlock = ({ filters, selectCategoryId,  setFilters }) => {
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);

  const [filterModalToEdit, setFilterModalToEdit] = useState(null);

  const openFilterModal = (data = null) => {
    setFilterModalToEdit(data);
    setIsOpenFilterModal(true);
    document.body.style.overflow = "hidden";
  };

  return (
    <div>
      {isOpenFilterModal && (
        <FilterModal
          onHide={() => {
            setIsOpenFilterModal(false);
            setFilterModalToEdit(null);
          }}
          filterToEdit={filterModalToEdit}
          setFilters={setFilters}
        />
      )}


      <div className={classes.add_filter_button}>
        <button onClick={()=>openFilterModal()} className="custom_btn">
          Створити фільтр
        </button>
      </div>

      <div className={classes.filter_categories}>
        {filters.map((filter) => (
          <FilterItem
            key={filter.id}
            filter={filter}
            selectCategoryId={selectCategoryId}
            setFilters={setFilters}
            openFilterModal={openFilterModal}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterBlock;
