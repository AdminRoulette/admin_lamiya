import {$authHost} from "../index";


export const createDevice = async (dataForm) => {
    const {data} = await $authHost.post('api/device', dataForm);
    return data;
}

export const getLongProductInfo = async (id) => {
    const {data} = await $authHost.get(`api/device/getLongProductInfo/${id}`);
    return data;
}

export const updateDevices = async (id, body) => {
    const {data} = await $authHost({method:'PUT', url:`api/device/${id}`, data: body});
    return data;
}

export const getStockHistory = async ({ids, user_id,offset}) => {
    const params = new URLSearchParams();
    params.append("offset", offset);
    if (ids) {
        params.append("ids", ids);
    }
    if (user_id) {
        params.append("user_id", user_id);
    }
    const {data} = await $authHost.get(`api/device/stock-history?${params.toString()}`);
    return data;
}

export const getAdminOneDevice = async (id) => {
    const {data} = await $authHost.get(`api/device/getUpdateProduct/${id}`);
    return data;
}

export const DeleteImage = async (id) => {
    const {data} = await $authHost.delete(`api/device/image/${id}`);
    return data;
}

export const getOptionForEditOrder = async (id) => {
    const {data} = await $authHost.get(`api/device/getOptionForEditOrder/${id}`);
    return data;
}
export const SearchSimilar = async (value) => {
    const {data} = await $authHost.get(`api/device/search-similar?value=${value}`);
    return data;
}

export const getProductList = async ({name}) => {
    const {data} = await $authHost.get(`api/device/product-by-name?name=${name}`);
    return data;
}
export const getAdminProducts = async ({value,status}) => {
    const params = new URLSearchParams();
    if (value) {
        params.append('value', value);
    }
    if (status) {
        params.append('status', status);
    }
    const {data} = await $authHost.get(`api/device/get-products?${params.toString()}`);
    return data;
}

