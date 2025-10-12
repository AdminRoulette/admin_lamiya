import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createFilterValue,
  editFilterValue,
  getFilters,
} from "@/http/Product/filtersAPI";
import Transliterations from "../../../../../../server/functions/SearchComponents/Transliterations";
import { CustomModal } from "@/components/CustomElements/CustomModal";
import { CustomDropdown } from "@/components/CustomElements/CustomDropdown";

const FilterValueModal = ({ onHide, filterValueToEdit, setFilters }) => {
  const [filterList, setFilterList] = useState([]);
  const [filter_id, setFilter_id] = useState(
    filterValueToEdit?.filter_id || null,
  );
  const [name, setName] = useState(filterValueToEdit?.name || "");
  const [name_ru, setName_ru] = useState(filterValueToEdit?.name_ru || "");
  const [code, setCode] = useState(filterValueToEdit?.code || "");

  useEffect(() => {
    getFilters()
      .then((filters) => setFilterList(filters))
      .catch((error) => {
        toast(error.message);
      });
  }, []);
  const create = async () => {
    if (name && name_ru && code) {
      await createFilterValue({
        name,
        name_ru,
        code,
        filter_id,
      })
        .then((res) => {
          setFilters((prev) => {
            // If prev is an array of filters
            return prev.map((filter) => {
              if (filter.id === filter_id) {
                return {
                  ...filter,
                  values: [...(filter.values || []), res],
                };
              }
              return filter;
            });
          });
          closeModal();
        })
        .catch((error) => {
          toast(error.message);
        });
    } else {
      toast.error(`Заповніть усі поля`);
    }
  };
  const edit = async () => {
    await editFilterValue({
      id: filterValueToEdit.id,
      name,
      name_ru,
      code,
      filter_id,
    })
      .then(() => {
        setFilters((prev) => {
          const updatedValue = {
            id: filterValueToEdit.id,
            name,
            name_ru,
            code,
            filter_id,
          };

          return prev.map((filter) => {
            const filteredValues =
              filter.values?.filter((v) => v.id !== filterValueToEdit.id) || [];

            if (filter.id === filter_id) {
              return { ...filter, values: [updatedValue,...filteredValues ] };
            }

            return { ...filter, values: filteredValues };
          });
        });
        closeModal();
      })
      .catch((error) => {
        toast(error.response.data.message);
      });
  };

  const closeModal = () => {
    const modal = document.getElementById("modalId");
    if (modal) {
      modal.classList.add("closingModal");
      window.setTimeout(() => {
        onHide();
      }, 500);
    } else {
      onHide();
    }
    document.body.style.overflow = "";
  };

  const onChangeValue = async (value) => {
    setName(value);
    setCode(value ? await Transliterations(value) : "");
  };

  return (
    <CustomModal
      title={
        filterValueToEdit?.name
          ? "Редагувати значення фільтра"
          : "Додати значення фільтра"
      }
      onClose={closeModal}
      onSubmit={filterValueToEdit?.name ? edit : create}
      buttonName={filterValueToEdit?.name ? "Редагувати" : "Додати"}
      width={400}
    >
      <CustomDropdown
        array={filterList}
        externalValue={filterList.find((item) => item.id === filter_id)?.name}
        dropdownAction={(item) => setFilter_id(item?.id)}
      />

      <label className="input_with_placeholder">
        <input
          value={name}
          type="text"
          maxLength="100"
          placeholder=""
          onChange={(event) => onChangeValue(event.target.value)}
        />
        <span className="input_field_placeholder">Назва</span>
      </label>

      <label className="input_with_placeholder">
        <input
          value={name_ru}
          type="text"
          maxLength="100"
          placeholder=""
          onChange={(event) => setName_ru(event.target.value)}
        />
        <span className="input_field_placeholder">Ру назва</span>
      </label>

      <label className="input_with_placeholder">
        <input
          value={code}
          type="text"
          maxLength="100"
          placeholder=""
          disabled
        />
        <span className="input_field_placeholder">Код</span>
      </label>
    </CustomModal>
  );
};

export default FilterValueModal;
