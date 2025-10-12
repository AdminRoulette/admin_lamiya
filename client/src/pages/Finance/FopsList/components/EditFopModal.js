import React, {useState} from "react";
import {toast} from "react-toastify";
import classes from "../../Finance.module.scss";
import {createFop, editFop} from "@/http/financeApi";

const EditFopModal = ({editData, setFopsList, onHide}) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(editData?.name || "");
    const [ipn, setIpn] = useState(editData?.ipn || "");
    const [iban, setIban] = useState(editData?.iban || "");
    const [sender_phone, setSender_phone] = useState(editData?.sender_phone || "");
    const [total_sell, setTotal_sell] = useState(editData?.total_sell || 0);

    const [np_city_ref, setNp_city_ref] = useState(editData?.np_city_ref || "");
    const [np_sender_ref, setNp_sender_ref] = useState(editData?.np_sender_ref || "");
    const [np_sender_address_ref, setNp_sender_address_ref] = useState(editData?.np_sender_address_ref || "");
    const [np_sender_contact_ref, setNp_sender_contact_ref] = useState(editData?.np_sender_contact_ref || "");
    const [ukr_sender_uuid, setUkr_sender_uuid] = useState(editData?.ukr_sender_uuid || "");

    const [key, setKey] = useState(editData?.key || "");
    const [np_api_key, setNp_api_key] = useState(editData?.np_api_key || "");
    const [ukr_token, setUkr_token] = useState(editData?.ukr_token || "");
    const [ukr_tracking_token, setUkr_tracking_token] = useState(editData?.ukr_tracking_token || "");
    const [ukr_bearer, setUkr_bearer] = useState(editData?.ukr_bearer || "");

    const addBrand = async () => {
        setLoading(true);
        if (editData) {
            await editFop({id:editData.id,name, ipn,iban,sender_phone,total_sell,np_city_ref,np_sender_ref,np_sender_address_ref,
                np_sender_contact_ref,ukr_sender_uuid,key,np_api_key,ukr_token,ukr_tracking_token,ukr_bearer}).then(data => {
                setFopsList(prev =>
                    prev.map((fop) => {
                        if (fop.id === editData.id) {
                            return {...fop, name, ipn,iban,sender_phone,total_sell,np_city_ref,np_sender_ref,np_sender_address_ref,
                                np_sender_contact_ref,ukr_sender_uuid,key,np_api_key,ukr_token,ukr_tracking_token,ukr_bearer}
                        } else {
                            return fop;
                        }
                    })
                )
                closeModal();
            }).catch((error) => {
                toast.error(error.response.data.message)
            }).finally(()=>{
                setLoading(false);
            })
        } else {
            await createFop({name, ipn,iban,sender_phone,total_sell,np_city_ref,np_sender_ref,np_sender_address_ref,
                np_sender_contact_ref,ukr_sender_uuid,key,np_api_key,ukr_token,ukr_tracking_token,ukr_bearer}).then(data => {
                setFopsList(prev => ([data, ...prev]))
                closeModal();
            }).catch((error) => {
                toast.error(error.response.data.message)
            }).finally(()=>{
                setLoading(false);
            })
        }
    }

    const closeModal = () => {
        const modal = document.getElementById('modalId');
        if (modal) {
            modal.classList.add('closingModal');
            window.setTimeout(() => {
                onHide();
            }, 500);
        } else {
            onHide();
        }
        document.body.style.overflow = '';
    }

    return (
        <div className="modal_main">
            <div onClick={() => closeModal()} className="modal_bg"/>
            <div className={'modal_container' + ' ' + classes.brand_modal_container}>
                <div className="modal_header">
                    <div>{editData ? "Редагувати фоп" : "Додати фоп"}</div>
                    <svg onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className={'modal_body' + ' ' + classes.brand_modal_body}>
                    <span><b>Дані ФОПа</b></span>
                    <label className="input_with_placeholder">
                        <input value={name} type="text" maxLength="100"
                               placeholder=""
                               onChange={(e) => setName(e.target.value)}/>
                        <span className="input_field_placeholder">Назва ФОПа</span>
                    </label>
                    <label className="input_with_placeholder">
                        <input value={ipn} type="text" maxLength="20"
                               placeholder=""
                               onChange={(e) => setIpn(e.target.value)}/>
                        <span className="input_field_placeholder">ІПН</span>
                    </label>
                    <label className="input_with_placeholder">
                        <input value={iban} type="text" maxLength="40"
                               placeholder=""
                               onChange={(e) => setIban(e.target.value)}/>
                        <span className="input_field_placeholder">IBAN</span>
                    </label>
                    <label className="input_with_placeholder">
                        <input value={sender_phone} type="text" maxLength="13"
                               placeholder=""
                               onChange={(e) => setSender_phone(e.target.value)}/>
                        <span className="input_field_placeholder">Номер телефону</span>
                    </label>
                    <label className="input_with_placeholder">
                        <input value={total_sell} type="text" maxLength="10"
                               placeholder=""
                               onChange={(e) => setTotal_sell(e.target.value)}/>
                        <span className="input_field_placeholder">Сума зарахувань на ФОП</span>
                    </label>

                    <span><b>Ref-и</b></span>

                    <label className="input_with_placeholder">
                        <input value={np_city_ref} type="text" maxLength="50"
                               placeholder=""
                               onChange={(e) => setNp_city_ref(e.target.value)}/>
                        <span className="input_field_placeholder">Ref місто нової пошти</span>
                    </label>
                    <label className="input_with_placeholder">
                        <input value={np_sender_ref} type="text" maxLength="50"
                               placeholder=""
                               onChange={(e) => setNp_sender_ref(e.target.value)}/>
                        <span className="input_field_placeholder">Ref відправника нової пошти</span>
                    </label>
                    <label className="input_with_placeholder">
                        <input value={np_sender_address_ref} type="text" maxLength="50"
                               placeholder=""
                               onChange={(e) => setNp_sender_address_ref(e.target.value)}/>
                        <span className="input_field_placeholder">Ref адреси нової пошти</span>
                    </label>
                    <label className="input_with_placeholder">
                        <input value={np_sender_contact_ref} type="text" maxLength="50"
                               placeholder=""
                               onChange={(e) => setNp_sender_contact_ref(e.target.value)}/>
                        <span className="input_field_placeholder">Ref контакту нової пошти</span>
                    </label>
                    <label className="input_with_placeholder">
                        <input value={ukr_sender_uuid} type="text" maxLength="50"
                               placeholder=""
                               onChange={(e) => setUkr_sender_uuid(e.target.value)}/>
                        <span className="input_field_placeholder">Ref відправника укр пошти</span>
                    </label>

                    <span><b>Ключі</b></span>

                    <label className="input_with_placeholder">
                        <input value={key} type="text" maxLength="30"
                               placeholder=""
                               onChange={(e) => setKey(e.target.value)}/>
                        <span className="input_field_placeholder">Ключ чек-боксу</span>
                    </label>
                    <label className="input_with_placeholder">
                        <input value={np_api_key} type="text" maxLength="50"
                               placeholder=""
                               onChange={(e) => setNp_api_key(e.target.value)}/>
                        <span className="input_field_placeholder">Токен нової пошти</span>
                    </label>
                    <label className="input_with_placeholder">
                        <input value={ukr_token} type="text" maxLength="50"
                               placeholder=""
                               onChange={(e) => setUkr_token(e.target.value)}/>
                        <span className="input_field_placeholder">Токен укр пошти</span>
                    </label>
                    <label className="input_with_placeholder">
                        <input value={ukr_tracking_token} type="text" maxLength="50"
                               placeholder=""
                               onChange={(e) => setUkr_tracking_token(e.target.value)}/>
                        <span className="input_field_placeholder">Токен трекінга укр пошти</span>
                    </label>
                    <label className="input_with_placeholder">
                        <input value={ukr_bearer} type="text" maxLength="50"
                               placeholder=""
                               onChange={(e) => setUkr_bearer(e.target.value)}/>
                        <span className="input_field_placeholder">Bearer Укр пошти</span>
                    </label>

                    <div className={classes.brand_modal_footer}>
                        <button onClick={closeModal} className="second_btn">Закрити</button>
                        <button onClick={addBrand} disabled={!name || loading}
                                className="custom_btn">{editData ? "Редагувати" : "Додати"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditFopModal;