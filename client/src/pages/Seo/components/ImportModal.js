import React, {useState} from 'react';
import {importSeoFromGoogle} from "@/http/seoAPI";
import {toast} from "react-toastify";

const ImportModal = ({closeModal,uploadSeoLost}) => {
    const [loading, setLoading] = useState(false);

    const ImportSeo = async () => {
        setLoading(true)
       await importSeoFromGoogle().then(res =>{
           closeModal()
           toast(res);
           uploadSeoLost();
        }).catch(error =>{
            toast.error(error.response.data.message)
       }).finally(()=>{
           setLoading(false)
       })
    }

    return (
        <div className="modal_main">
            <div id="close_cart" onClick={() => closeModal()} className="modal_bg"/>
            <div className={"modal_container"}>
                <div className="modal_header">
                    <div>Імпорт SEO з гугл таблиці</div>
                    <svg id="close_cart" onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className={"modal_body"}>
                    <span>Ви впевнені, що документ <u><a target="_blank"
                        href="https://docs.google.com/spreadsheets/d/1HoGRbqiehSg0kOk5-f_UsKai9_G5pFPqbG5lwVE8E3s/edit?usp=sharing">SEO import</a></u> заповнений вірно?</span>
                </div>
                <div className="modal_footer">
                    <button className='second_btn' onClick={() => closeModal()}>Ні, закрити</button>
                    <button disabled={loading} className='custom_btn' onClick={ImportSeo}>{loading?"Завантаження":"Так, завантажити"}</button>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;