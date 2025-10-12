import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {getAllPriceTags, printingExcelTags} from "@/http/priceTagsApi";
import classes from './priceTags.module.scss';
import FileSaver from 'file-saver';
import PriceTagItem from "@/pages/PriceTags/PriceTagItem";

const PriceTags = () => {
    document.title = "Цінники"
    const [tagsList, setTagsList] = useState([]);
    const [checkedList, setCheckedList] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        getAllPriceTags({offset: 0}).then((data) => {
            setTagsList(data);
        }).catch(error => {
            toast(error.message)
        });
    }, []);

    const AddAllTagsToList = () => {
        let idsList = [];
        if (checkedList.length > 0) {
            setCheckedList([]);
        } else {
            for (const item of tagsList) {
                idsList.push(item.id);
            }
            setCheckedList(idsList);
        }
    }
    const PrintCheckedTags = async () => {
        await printingExcelTags({ids: checkedList}).then((data) => {
            let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            FileSaver.saveAs(file, "Цінники.xlsx");
            toast("Цінники завантажено")
        }).catch(error => {
            toast.error(error.response.data.message)
        })
    }

    return (
        <div className={classes.pricetags_container}>
            <div className={classes.header}>
                <div className={classes.checkboxDropdownWrapper}>
                    <div className={classes.checkboxDropdown} onClick={() => setDropdownOpen(prev => !prev)}>
                        <input type="checkbox" checked={checkedList.length === tagsList.length} readOnly/>
                    </div>
                    {dropdownOpen && (
                        <div className={classes.dropdownMenu}>
                            <div onClick={() => {
                                const unprinted = tagsList.filter(item => !item.printed).map(i => i.id);
                                setCheckedList(unprinted);
                                setDropdownOpen(false);
                            }}>
                                Вибрати ті що не надруковані
                            </div>
                            <div onClick={() => {
                                setCheckedList(tagsList.map(i => i.id));
                                setDropdownOpen(false);
                            }}>
                                Вибрати всі
                            </div>
                        </div>
                    )}
                </div>
                <button className="custom_btn" onClick={PrintCheckedTags}>Надрукувати</button>
            </div>
            <div className={classes.pricetags_item_list}>
                {tagsList.map((item) => {
                    return <PriceTagItem setCheckedList={setCheckedList} checked={checkedList.includes(item.id)} key={item.id} item={item}/>
                })}
            </div>
        </div>
    )
};

export default PriceTags;