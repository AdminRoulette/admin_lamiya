import React, {useState} from 'react';
import classes from "@/pages/Supply/supply.module.scss";
import SupplyLongInfo from "@/pages/Supply/components/SupplyList/SupplyLongInfo";
import CreateSupplyModal from "@/pages/Supply/components/SupplyModal/createSupplyModal";
import {ApproveSupply, PrintSupplyExcel, PublicationSupply} from "@/http/supplysApi";
import FileSaver from 'file-saver';
import {toast} from "react-toastify";

const SupplyItem = ({supply,setSupplyList}) => {
    const [isOpenLongInfo, setIsOpenLongInfo] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);

    const OpenModal = () => {
        setIsOpenEditModal(true);
        document.body.style.overflow = 'hidden'
    };

    const CloseModal = () => {
        setIsOpenEditModal(false);
        document.body.style.overflow = ''
    };

    const EditModal = () => {
        setEditData(supply);
        OpenModal();
    };

    const PrintExcel = async () => {
        const response = await PrintSupplyExcel({id: supply.id})
        let file = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        FileSaver.saveAs(file, `Замовлення.xlsx`);
    };

    const SupplyPublic = async () => {
       await ApproveSupply({id:supply.id}).then(() => {
           setSupplyList(prev =>
               prev.map((prevElem) => {
                   if(prevElem.id === supply.id){
                       return {...prevElem, status:"done"};
                   }else{
                       return {...prevElem}
                   }
               }))
       }).catch(error => {
           toast(error.response.data.message)
       })
    };

    return (
        <div className={classes.supply_container} key={supply.id}>

            {isOpenEditModal && <CreateSupplyModal onHide={CloseModal} editData={editData} setSupplyList={setSupplyList}/>}

            <div onClick={()=>setIsOpenLongInfo(prev => !prev)} className={classes.supply_short_container}>
                <div>
                    <svg style={isOpenLongInfo ? {transform:"rotate(180deg)"} : {}} xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                         viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"></path>
                    </svg>
                </div>
                <div>
                    <div><b>{new Date(supply.createdAt).toLocaleDateString()}</b></div>
                    <div className={classes.supply_price}>Сума: <b>{supply.cost} ₴</b></div>
                    <div className={classes.supply_price}>Додаткові витрати: <b>{supply.extra_costs} ₴</b></div>
                </div>
                <div>
                    <div>Статус: <b>{supply.status === 'new'? "Нове" : supply.status === 'done'? "Виконане" : "Невідомий статус"}</b></div>
                    <div>Постачальник: <b>{supply.company}</b></div>
                    {supply.invoice && <div>Накладна: <b>{supply.invoice}</b></div>}
                    {supply.deposit && <div>Депозитні кошти?: <b>Так</b></div>}
                    <div>Створив: <b>{supply.user.lastname} {supply.user.firstname}</b></div>
                </div>
                <div>
                    {supply.comment && <div>Коментар: {supply.comment}</div>}
                </div>
                <div className={classes.supply_btns}>
                    <div className={classes.supply_svg}>
                        {supply.status !== 'done' && <span onClick={EditModal} className="material-symbols-outlined">edit</span>}
                        <span onClick={PrintExcel} className="material-symbols-outlined">print</span>
                    </div>
                    {supply.status !== 'done' && <button onClick={SupplyPublic} className='custom_btn'>Внести</button>}
                </div>


            </div>
            {isOpenLongInfo && <div>
                <SupplyLongInfo id={supply.id}/>
            </div>}
        </div>
    );
};

export default SupplyItem;