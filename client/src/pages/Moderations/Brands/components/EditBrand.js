import React, { useState } from "react";
import {toast} from "react-toastify";
import classes from "../../../Categories/moderation.module.scss";
import {createBrand, editBrand} from "@/http/Product/brandAPI";
import Transliterations from "../../../../../../server/functions/SearchComponents/Transliterations";

const EditBrand = ({editData,setBrandList, onHide }) => {
  const [name, setName] = useState(editData?.name || "");
    const [name_ru, setName_ru] = useState(editData?.name_ru || "");
    const [code, setCode] = useState(editData?.code || "");
    const [popular, setPopular] = useState(editData?.popular || false);

  const addBrand = async () => {
      if(editData){
          await editBrand({name: name,code:code,id:editData.id,name_ru:name_ru,popular:popular}).then(data => {
              setBrandList(prev =>
                  prev.map((brand) => {
                      if(brand.id === editData.id){
                          return {...brand,name,name_ru,popular}
                      }else{
                          return brand;
                      }
                  })
              )
              closeModal();
          }).catch((error)=>{
              toast.error(error.response.data.message)
          })
      }else{
          await createBrand({name: name,code:code,name_ru:name_ru,popular:popular}).then(data => {
              setBrandList(prev => ([data,...prev]))
              closeModal();
          }).catch((error)=>{
              toast.error(error.response.data.message)
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
        }else{
            onHide();
        }
        document.body.style.overflow = '';
    }

    const handleName = async (value) => {
        setName(value)
        setCode(await Transliterations(value))
    }

    return (
        <div className="modal_main">
            <div onClick={() => closeModal()} className="modal_bg"/>
            <div className={'modal_container'+' '+ classes.brand_modal_container}>

                <div className="modal_header">
                    <div>{editData ? "Редагувати бренд" :"Додати бренд"}</div>
                    <svg onClick={() => closeModal()} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className={'modal_body'+' '+ classes.brand_modal_body}>
                    <input type="text" value={name} onChange={(event) => handleName(event.target.value)} placeholder="Назва бренду"/>
                    <input type="text" value={name_ru} onChange={(event) => setName_ru(event.target.value)} placeholder="Назва бренду Російською"/>
                    <input type="text" onChange={(event) => setCode(event.target.value)} value={code} placeholder="Код"/>
                    <input type="checkbox" checked={popular} onChange={(event) => setPopular(event.target.checked)} placeholder="Популярний"/>
                    <div className={classes.brand_modal_footer}>
                        <button onClick={closeModal} className="second_btn">Закрити</button>
                        <button onClick={addBrand} disabled={!(name && name_ru)} className="custom_btn">{editData ? "Редагувати" :"Додати"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBrand;