import React, {useState} from "react";
import {getOptionForEditOrder, getProductList} from "@/http/Product/deviceAPI";
import {toast} from "react-toastify";
import classes from "../../adminOrder.module.scss";

const AddDevicetoEdit = ({setOrderDeviceList,orderDeviceList}) => {
    const [addDeviceId, setAddDeviceId] = useState(0);
    const [optionId, setOptionId] = useState(0);
    const [deviceList, setDeviceList] = useState([]);
    const [deviceInput, setDeviceInput] = useState("");
    const [optionInput, setOptionInput] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(false);

    async function AddDeviceToOrder () {
        let checkInList = false;
        orderDeviceList.forEach((orderDevElem)=>{
            if(orderDevElem.option_id === optionId){
                toast.error(`Товар вже є в списку`);
                checkInList = true;
            }
        })
        if(checkInList === false) {
            if (addDeviceId === 0 || optionId === 0) {
                toast.error(`Назва товару або опції пуста`);
            } else {
                await getOptionForEditOrder(optionId).then((option) => {
                    setOrderDeviceList((prevState) => [...prevState, option]);
                    setOptionId(0);
                    setAddDeviceId(0);
                    setOptionInput("");
                    setDeviceInput("");
                    setDeviceList([]);
                })
            }
        }
    }

    const deviceOnChange = async (value) => {
        setDeviceInput(value);

        if (searchTimeout !== false) {
            clearTimeout(searchTimeout);
        }

        setSearchTimeout(setTimeout(async () => {
            const devElems = await getProductList({ name: value });
            setDeviceList(devElems);
            setOptionId(0);
            setOptionInput("");
        }, 700));

    };

    return  (
        <div className={classes.edit_order_new_product}>
            <h3>Додати товар:</h3>
            <div className={classes.product_input_drop}>
                <input placeholder='Вкажіть назву товару' value={deviceInput} type="text"
                       onChange={(e) => deviceOnChange(e.target.value)}/>
                {deviceList.length > 0
                    ? <div className={classes.product_drop_down}>
                        {deviceList.map((deviceElem) => {
                            return (<div key={deviceElem.id} title={deviceElem.name}
                                         onClick={() => {
                                             setAddDeviceId(deviceElem.id);
                                             setDeviceInput(deviceElem.name)
                                         }}
                                         className={classes.product_dropDown_item}>{deviceElem.name}</div>)
                        })}
                    </div>
                    : <div></div>}
            </div>
            {addDeviceId !== 0 ?
                <>
                    <div className={classes.product_input_drop}>
                        <input placeholder='Вкажіть назву опції' value={optionInput} onChange={()=>{}} type="text"/>
                        {deviceList.length > 0
                            ? <div className={classes.product_drop_down}>
                                {deviceList.map((deviceElem) => {
                                    if (deviceElem.id === Number(addDeviceId)) {
                                        return deviceElem.deviceoptions.map((OptionsElem,index) => {
                                            return (<div key={index} title={deviceElem.name}
                                                         onClick={() => {setOptionId(OptionsElem.id);setOptionInput(OptionsElem.optionName)}}
                                                         className={classes.product_dropDown_item}>{OptionsElem.optionName}</div>)
                                        })
                                    }
                                })}
                            </div>
                            : <div></div>}
                    </div>
                </>
                : <></>}
                <button className="second_btn admin_main_btns" onClick={() => AddDeviceToOrder()}>Додати</button>
        </div>
    );
};

export default AddDevicetoEdit;
