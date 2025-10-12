import {$authHost} from "../index";

export const OpenCashierShift = async ({id}) => {
    const {data} = await $authHost.post('/api/checkBox/open-shift',{id})
    return data;
}

export const CloseShift = async ({id}) => {
    const {data} = await $authHost.post('/api/checkBox/close-shift',{id})
    return data;
}

export const CreateOrderCheck = async ({orderId}) => {
    const {data} = await $authHost.post('/api/checkBox/create-check',{orderId})
    return data;
}

export const CheckShift = async () => {
    const {data} = await $authHost.get('/api/checkBox/check-shift')
    return data;
}

export const ShiftStats = async () => {
    const {data} = await $authHost.get('/api/checkBox/shift-stats')
    return data;
}

export const createCashierBearer = async ({pinCode,id}) => {
    const {data} = await $authHost.post('/api/checkBox/set-cashier-bearer',{pinCode,id})
    return data;
}

