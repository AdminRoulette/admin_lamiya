import {$authHost, $host} from "./index";

export const ChangeCount = async ({optionId,count}) => {
    const {data} = await $authHost.post('api/basket/changeCount',{optionId,count});
    return data;
}


export const deleteDeviceFromBasket = async (deviceoptionId) => {
    const {data} = await $authHost.delete(`api/basket/delete/${deviceoptionId}`);
    return data;
}

export const addDeviceToBasket = async (optionId,count) => {
    const {data} = await $authHost({
        method: "POST",
        url: "api/basket",
        data: {deviceoptionId:optionId,count:count}
    });
    return data;
}

export const getUserBasketDevice = async (language) => {
    const {data} = await $authHost.post(`api/basket/userBasket`,{language});
    return data;
}

export const barcodeToBasket = async (barcode) => {
    const {data} = await $authHost.post(`api/basket/barcode-to-basket`,{barcode});
    return data;
}