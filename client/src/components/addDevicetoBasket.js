import React from 'react';
import {addDeviceToBasket} from "@/http/basketApi";
import {toast} from "react-toastify";


const AddDevicetoBasket = async (option, deviceBasket) => {
        await addDeviceToBasket(option.id, 1).catch(error =>{
            throw new Error(error.response.data.message)
        }).then(()=>{
            toast(`Товар додано в кошик`);
        })
    await deviceBasket.addDeviceBasket({option, count:1});
}


export default AddDevicetoBasket;