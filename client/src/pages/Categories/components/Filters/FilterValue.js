import React, {useState} from "react";
import FilterValueDeleteModal from "@/pages/Categories/components/Filters/FilterValueDeleteModal";
import FilterValueModal from "@/pages/Categories/components/Filters/FilterValueModal";

const FilterValue = ({
                         value,
                         checked,
                         onChangeCheck,
                         setFilters,
                         openValuesModal
                     }) => {
    const [isOpenValuesDeleteModal, setIsOpenValuesDeleteModal] = useState(false);

    return (
        <>
            {isOpenValuesDeleteModal && (
                <>
                    <FilterValueDeleteModal
                        onHide={() => {
                            setIsOpenValuesDeleteModal(false);
                        }}
                        setFilters={setFilters}
                        value_id={value.id}
                    />
                </>
            )}

            <div
                onClick={(e) => {
                    onChangeCheck(value.id);
                }}
            >
                <input type="checkbox" checked={checked} onChange={()=>{}}/>
                <span style={!value.select ? {color: "#878787"} : {}}>
          {value.name}
        </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-pencil-icon lucide-pencil"
                    onClick={(e) => {
                        e.stopPropagation();
                        openValuesModal(value);
                    }}
                >
                    <path
                        d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                    <path d="m15 5 4 4"/>
                </svg>
                <svg
                    onClick={(e) => {
                        setIsOpenValuesDeleteModal(true);
                        e.stopPropagation();
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-trash-icon lucide-trash"
                >
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                    <path d="M3 6h18"/>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
            </div>
        </>
    );
};

export default FilterValue;
