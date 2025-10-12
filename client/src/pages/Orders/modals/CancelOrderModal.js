import React, {useState} from 'react';
import {cancelOrder} from "@/http/Order/ordersApi";
import {toast} from "react-toastify";
import classes from "../adminOrder.module.scss"

const CancelOrderModal = ({setCancelModal, orderId,setOrders,status_id}) => {
    const [MoneyLoseModal, setMoneyLoseModal] = useState(0);
    const [refuse, setRefuse] = useState(status_id === 'refused' || status_id === 'refused-return' || status_id === 'cancelled-us');
    const [loading, setLoading] = useState(false);

    const handleCancelOrder = async ({orderId, moneyLose}) => {
        setLoading(true)
        await cancelOrder({moneyLose, orderId, refuse})
            .then(async (canceledData) => {
                setOrders(order => order.map((OrderElem)=>{
                            if(OrderElem.id === orderId){
                               return {
                                   ...OrderElem,
                                   ...canceledData,
                                   checkuuid_list: [
                                       ...(OrderElem.checkuuid_list || []),
                                       ...(canceledData.checkuuid_list || [])
                                   ]
                               }
                            }else{
                                return {...OrderElem}
                            }
                        })
                    )
                closeModal()
                toast(`Замовлення відмінено`);
        }).catch((error) => {
            toast.error(error.response.data.message);
        }).finally(()=>{
                setLoading(false)
            })
    }

    const closeModal = () => {
        setCancelModal(false);
        document.body.style.overflow = '';
    }

    const changeMoneyLose = async (value) => {
        const number = /^[0-9]+$/;
        if(value.match(number) || value.length === 0){
            setMoneyLoseModal(value)
        }
    }

    return (
        <div className="modal_main">
            <div onClick={closeModal} className="modal_bg"/>
            <div className={'modal_container' +' '+ classes.cancel_order_modal}>
                <div className="modal_header">
                    <div>Скасування замовлення</div>
                    <svg onClick={closeModal} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className="modal_body">
                    <div className={classes.cancel_order_modal_body}>
                        <div className={classes.cancel_order_body_text}>Кіл-сть затрат на замовлення:</div>
                        <input type="text" value={MoneyLoseModal}
                               onChange={(e) => changeMoneyLose(e.target.value)}
                               placeholder='Кі-сть затрат'/>
                        <div className={classes.cancel_order_refuse}>
                            <input type="checkbox" checked={refuse} onChange={() => setRefuse(prevState => !prevState)}/>
                            <span>Відмова від отримання?</span>
                        </div>
                    </div>
                    <div className="modal_footer">
                        <button className={'second_btn' +' '+ classes.edit_order_buttons} onClick={closeModal}>Закрити</button>
                        <button disabled={loading} className={'second_btn' +' '+ classes.edit_order_buttons}
                                onClick={() => handleCancelOrder({moneyLose: MoneyLoseModal, orderId})}>Скасувати
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModal;
