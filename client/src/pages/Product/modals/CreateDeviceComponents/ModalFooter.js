import React, {useState} from "react";
import {createDevice, updateDevices} from "@/http/Product/deviceAPI";
import {
    createBodyCareDevices, createPartDevices, updateBodyCareDevices, updatePartDevices
} from "@/http/Product/deviceDetailApi";
import classes from "../../productPage.module.scss";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const ModalFooter = ({
                         categories,
                         deviceInfo,
                         options,
                         parfumePart,
                         bodyCare,
                         onHide,
                         editingState,
                         setSearch,
                         filters,
                         similarArray
                     }) => {
    const [sendData, setSendData] = useState(false);

    const actionsOnCloseModal = (id) => {
        onHide();
        if (id) setSearch(`${id}`)
    };
    const productFormDataAppend = () => {
        const formData = new FormData();
        formData.append("categories", JSON.stringify(categories));
        formData.append("name", deviceInfo.name.trim());
        formData.append("name_ru", deviceInfo.name_ru.trim());
        formData.append("series", deviceInfo.series.trim());
        formData.append("series_ru", deviceInfo.series_ru.trim());
        formData.append("hit", deviceInfo.hit);
        formData.append("tags", deviceInfo.tags);
        formData.append("status", deviceInfo.status);
        formData.append("tags_ru", deviceInfo.tags_ru);
        formData.append("weekdiscount", deviceInfo.weekdiscount);
        formData.append("active", deviceInfo.active);
        formData.append("similar", JSON.stringify(similarArray.map(item => item.id)));

        for (let i = 0; i < options.length; i++) {
            for (let b = 0; b < options[i].deviceimages.length; b++) {
                if (options[i].deviceimages[b].file) {
                    formData.append('image', options[i].deviceimages[b].file)
                }
            }
        }
        formData.append("brand", JSON.stringify(deviceInfo.brand));
        formData.append("options", JSON.stringify(options));
        formData.append("disc", deviceInfo.disc);
        formData.append("disc_ru", deviceInfo.disc_ru);
        formData.append("filters", JSON.stringify(filters));

        if (categories.some(item => item.id === 60 || item.id === 95)) {
            formData.append("on_tab_price", parfumePart.on_tab_price);
            formData.append("partcount", parfumePart.partcount);
            formData.append("refund_count", parfumePart.refund_count);
        } else {
            formData.append("composition", bodyCare.composition);
            formData.append("applicationmethod", bodyCare.applicationmethod);
            formData.append("activecomponents", bodyCare.activecomponents);
            formData.append("applicationmethod_ru", bodyCare.applicationmethod_ru);
            formData.append("activecomponents_ru", bodyCare.activecomponents_ru);
        }
        return formData;
    };

    const checkProductData = async () => {
        for (const option of options) {
            if(!option.deviceimages.length === 0) throw new Error(`Опція ${option.optionName} не має фото`)
            if(option.sell_type !== "sell_bottle"){
                if (!option.weight) throw new Error("Вага опції пуста")
                if (!Number(option.price)) throw new Error("Ціна не вірна")
            }
            if (option.sell_type === "sell_bottle" && !parfumePart.on_tab_price) throw new Error("Вкажіть ціну за мл, якщо є залишок у флаконі")
            if (isNaN(parseFloat(option.weight))) throw new Error("Вага не вірна")
            if (!option.id) throw new Error("Id опції не вірний")
        }

        if (categories.length < 1) throw new Error("Не вибрана категорія")
        if (categories.some(item => item.id === 60) && !categories.some(item => item.id === 106)) {
            const level2Categories = categories.filter(item => item.level === 2);
            if ((level2Categories.length < 3 && !categories.some(item => item.id === 95)) || ![1, 2, 3].includes(level2Categories[0]?.id)) {
                throw new Error("Категорія Парфуми, має містити мінімум 3 категорії другого рівня")
            }
        }
        if (!deviceInfo.status) throw new Error("Вкажіть статус товару")
        if (deviceInfo.status === 'active' && !deviceInfo.active) throw new Error("Для статусу Активний, товар потрібно активувати")
        if ((deviceInfo.status === 'ready' || deviceInfo.status === 'discontinued' || deviceInfo.status === 'hidden')
            && deviceInfo.active) throw new Error("Товар активний, але статус для Неактивного товару")
        if (!deviceInfo.name) throw new Error("Не вказана назва товару")
        if (!deviceInfo.name_ru) throw new Error("Не вказана російська назва товару")
        // if (!deviceInfo.series) throw new Error("Не вказана серія")
        // if (!deviceInfo.series_ru) throw new Error("Не вказана російська серія")
        if (!deviceInfo.brand.id) throw new Error("Не вибраний бренд")
        if (options.length < 1) throw new Error("Додайте опцію")

        function checkUniqueNames(optionsList) {
            const names = new Set();

            for (const item of optionsList) {
                if (item.sell_type === "on_tab") continue;
                if (names.has(item.optionName)) {
                    return false;
                }
                names.add(item.optionName);
            }
            return true;
        }
        if (!checkUniqueNames(options)) {
            throw new Error('У опцій є дублікати назв');
        }


    };

    const addNewDevice = async () => {
        setSendData(true)
        try {
            await checkProductData()
            const productFormData = productFormDataAppend();
            await createDevice(productFormData).then(async (id) => {
                actionsOnCloseModal(id);
            }).catch(error => {
                toast.error(error.response?.data.message)
            }).finally(() => {
                // setTimeout(() => setLoading(false), 1000);
                setSendData(false)
            });
        } catch (error) {
            setSendData(false)
            toast(error.message);
        }
    };

    const updateDevice = async () => {
        setSendData(true)
        // try {
            await checkProductData()
            const productFormData = productFormDataAppend();
            await updateDevices(editingState.id, productFormData).then(async (id) => {
                actionsOnCloseModal();
            }).catch(error => {
                toast(error.message)
            }).finally(() => {
                // setTimeout(() => setLoading(false), 1000);
                setSendData(false)
            });
        // } catch (error) {
        //     setSendData(false)
        //     toast(error.message);
        // }

    };

    return (<div className="modal_footer">
        <button className={"second_btn" + ' ' + classes.product_edit_footer_btn} onClick={onHide}>Закрити</button>
        <button disabled={sendData}
                className={"custom_btn" + ' ' + classes.product_edit_footer_btn}
                onClick={editingState.type === 'edit' ? updateDevice : addNewDevice}>
            {editingState.type === 'edit' ? <span>Оновити</span> : <span>Створити</span>}
        </button>
    </div>);
};

export default ModalFooter;
