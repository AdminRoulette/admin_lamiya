import {$authHost} from "@/http";


export const createStore = async ({city, address, phone, schedule, description, cash}) => {
    const {data} = await $authHost.post('api/store', {city, address, phone, schedule, description, cash});
    return data;
}
export const editStore = async ({city, address, phone, schedule, description, cash, id}) => {
    const {data} = await $authHost.post('api/store/edit', {city, address, phone, schedule, description, cash, id});
    return data;
}
export const getAllStores = async () => {
    const {data} = await $authHost.get('api/store');
    return data;
}
