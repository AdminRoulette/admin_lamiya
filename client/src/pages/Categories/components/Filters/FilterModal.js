import React, {useState} from "react";
import {toast} from "react-toastify";
import {createFilter, editFilter} from "@/http/Product/filtersAPI";
import Transliterations from "../../../../../../server/functions/SearchComponents/Transliterations";
import {CustomModal} from "@/components/CustomElements/CustomModal";

const FilterModal = ({onHide, filterToEdit, setFilters}) => {
    const [name, setName] = useState(filterToEdit?.name || "");
    const [name_ru, setName_ru] = useState(filterToEdit?.name_ru || "");
    const [code, setCode] = useState(filterToEdit?.code || "");
    const [id] = useState(filterToEdit?.id || null);

    const create = async () => {
        if (name.length > 2 && name_ru.length > 2 && code.length > 2) {
            if (code.includes(" ")) {
                toast.error(`Код повинен складатися з 1 слова без пробілів`);
                return;
            }

            await createFilter({
                name,
                name_ru,
                code,
            })
                .then((res) => {
                    setFilters((prev) => [
                        {
                            ...res,
                            values: [],
                        },
                        ...prev,
                    ]);
                    closeModal();
                })
                .catch((error) => {
                    toast(error.response.data.message);
                });
        } else {
            toast.error(`Заповніть усі поля`);
        }
    };

    const edit = async () => {
        if (name.length > 2 && name_ru.length > 2 && code.length > 2) {
            if (code.includes(" ")) {
                toast.error(`Код повинен складатися з 1 слова без пробілів`);
                return;
            }

            await editFilter({
                id,
                name,
                name_ru,
                code,
            })
                .then(() => {
                    setFilters((prev) => {
                        return prev.map((filter) => {
                            if (filter.id === filterToEdit.id) {
                                return {
                                    ...filter,
                                    name,
                                    name_ru,
                                    code,
                                };
                            } else {
                                return filter
                            }
                        })
                    })
                    closeModal();
                })
                .catch((error) => {
                    toast(error.response.data.message);
                });
        } else {
            toast.error(`Заповніть усі поля`);
        }
    };

    const onChangeValue = async (value) => {
        setName(value);
        setCode(value ? await Transliterations(value) : "");
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

    return (
        <CustomModal
            title={`${filterToEdit ? "Редагувати" : "Додати"} фільтр`}
            onClose={closeModal}
            onSubmit={filterToEdit ? edit : create}
            buttonName={`${filterToEdit ? "Редагувати" : "Додати"}`}
            width={400}
        >
            <label className="input_with_placeholder">
                <input
                    value={name}
                    type="text"
                    placeholder=""
                    onChange={(event) => onChangeValue(event.target.value)}
                />
                <span className="input_field_placeholder">Назва</span>
            </label>

            <label className="input_with_placeholder">
                <input
                    value={name_ru}
                    type="text"
                    placeholder=""
                    onChange={(event) => setName_ru(event.target.value)}
                />
                <span className="input_field_placeholder">Ру назва</span>
            </label>

            <label className="input_with_placeholder">
                <input
                    value={code}
                    type="text"
                    placeholder=""
                    onChange={(event) => setCode(event.target.value)}
                />
                <span className="input_field_placeholder">
          Код(має складатися з 1 слова)
        </span>
            </label>
        </CustomModal>
    );
};

export default FilterModal;
