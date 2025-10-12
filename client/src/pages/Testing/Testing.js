import React, {useContext, useState} from 'react';
import {toast} from "react-toastify";
import {Context} from "../../index";
import FileSaver from 'file-saver';
import classes from "../Testing/testing.module.scss";
import {
    CreateElastic, DeleteOption, DeleteProduct,
    Marketplace,
    StorageExcel, Test1, Test2, Test3, Test4,
    UpdateElastic,
    UpdateProductScore, UploadXML
} from "@/http/ExternalApi/rozetkaAPI";
import {CustomInput} from "@/components/CustomElements/CustomInput";
import {CustomDropdown} from "@/components/CustomElements/CustomDropdown";

const Testing = () => {
    document.title = "Тестування"
    const {user} = useContext(Context)

    const [deleteId, setDeleteId] = useState(null)
    const [storageName, setStorageName] = useState("")
    const storageArray = [{name:"lux"},{name:"dom"},{name:"tick"}]

    const selectFile = async (event) => {
        const file = event.target.files[0];

        if (!file) return alert('Оберіть файл');
        const ext = file.name.split('.').pop();
        const renamedFile = new File([file], `${storageName}.${ext}`, { type: file.type });

        const formData = new FormData();
        formData.append('file', renamedFile);
        formData.append('storageName', storageName);

        await UploadXML(formData).then((data) => {
            toast("Оновлено")
        }).catch(error => {
            toast.error(error.response.data.message)
        })
    };

    const onClickXML = async () => {
        if(storageName) {
            document.getElementById(`uploadXML`).click();
        }else{
            toast("Оберіть склад")
        }
    };

    return (<>
        {user.user.role?.includes("ADMIN") &&
            <div className={classes.testing_container}>
                <div>
                    <span>Excel складів</span>
                    <button className="second_btn" onClick={async () => await StorageExcel().then((data) => {
                        let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                        FileSaver.saveAs(file, "Новинки.xlsx");
                    }).catch(error => {
                        toast.error(error.response.data.message)
                    })}>Сформувати</button>
                    <CustomDropdown
                        array={storageArray}
                        placeholder={"Оберіть склад"}
                        dropdownAction={(item) => {
                            setStorageName(item?.name)
                        }}
                        externalValue={storageName}
                    />
                    <input onChange={(e)=>selectFile(e)}
                           id={`uploadXML`} type="file" style={{display: "none"}}/>
                    <button className="second_btn" onClick={onClickXML}>Завантажити постачальника</button>
                </div>
                <div>
                    <span>XML маркетплейсів</span>
                    <button className="second_btn" onClick={async () => await Marketplace().then((data) => {
                        toast("Оновлено")
                    }).catch(error => {
                        toast.error(error.response.data.message)
                    })}>Оновити</button>

                </div>
                <div>
                    <span>Еластік</span>
                    <button className="second_btn" onClick={async () => await CreateElastic().then((data) => {
                        toast("Створено")
                    }).catch(error => {
                        toast.error(error.response.data.message)
                    })}>Створити слої</button>
                    <button className="second_btn" onClick={async () => await UpdateElastic().then((data) => {
                        toast("Оновлено")
                    }).catch(error => {
                        toast.error(error.response.data.message)
                    })}>Оновити дані</button>
                </div>
                <div>
                    <span>Продукти</span>
                    <button className="second_btn" onClick={async () => await UpdateProductScore().then((data) => {
                        toast("Оновлено")
                    }).catch(error => {
                        toast.error(error.response.data.message)
                    })}>Оновити Скор</button>
                    <button className="second_btn" onClick={async () => await DeleteProduct({id:+deleteId}).then((data) => {
                        setDeleteId(null)
                        toast("Видалено")
                    }).catch(error => {
                        toast.error(error.response.data.message)
                    })}>Видалити товар</button>
                    <button className="second_btn" onClick={async () => await DeleteOption({id:+deleteId}).then((data) => {
                        setDeleteId(null)
                        toast("Видалено")
                    }).catch(error => {
                        toast.error(error.response.data.message)
                    })}>Видалити опцію</button>
                    <CustomInput
                        value={deleteId}
                        onChange={setDeleteId}
                        placeholder={"Ід товару чи опції"}
                    />
                </div>
                <div>
                    <button className="second_btn" onClick={async () => await Test1().then((data) => {
                        toast("Виконано")
                    }).catch(error => {
                        toast.error(error.response.data.message)
                    })}>Test1</button>
                </div>
                <div>
                    <button className="second_btn" onClick={async () => await Test2().then((data) => {
                        toast("Виконано")
                    }).catch(error => {
                        toast.error(error.response.data.message)
                    })}>Test2</button>
                </div>
                <div>
                    <button className="second_btn" onClick={async () => await Test3().then((data) => {
                        toast("Виконано")
                    }).catch(error => {
                        toast.error(error.response.data.message)
                    })}>Test3</button>
                </div>
                <div>
                    <button className="second_btn" onClick={async () => await Test4().then((data) => {
                        toast("Виконано")
                    }).catch(error => {
                        toast.error(error.response.data.message)
                    })}>Test4</button>
                </div>
                <div>
                    <button className="second_btn" onClick={async () => await Test5().then((data) => {
                        toast("Виконано")
                    }).catch(error => {
                        toast.error(error.response.data.message)
                    })}>Test5</button>
                </div>
            </div>}
    </>);
};

export default Testing;
