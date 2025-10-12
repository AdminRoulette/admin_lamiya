import {$authHost} from "../index";


export const updatePartDevices = async (id, body) => {
    const {data} = await $authHost({method:'PUT', url:`api/devicedetail/update/${id}`, data: body});
    return data;
}
export const updateBodyCareDevices = async (id, body) => {
    const {data} = await $authHost({method:'PUT', url:`api/devicedetail/bodycare/update/${id}`, data: body});
    return data;
}

export const createPartDevices = async (id, body) => {
    const {data} = await $authHost({method:'PUT', url:`api/devicedetail/create/${id}`, data: body});
    return data;
}
export const createBodyCareDevices = async (id, body) => {
    const {data} = await $authHost({method:'PUT', url:`api/devicedetail/bodycare/create/${id}`, data: body});
    return data;
}


