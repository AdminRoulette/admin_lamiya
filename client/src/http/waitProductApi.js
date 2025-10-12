import {$authHost} from "./index";


export const addWaitProduct = async ({product,place,type}) => {
    const {data} = await $authHost.post("api/wait-product/add", {product,place,type})
    return data;
};

export const getWaitProducts = async () => {
    const {data} = await $authHost.get("api/wait-product/")
    return data;
};
export const editWaitProducts = async ({id,product,place,type}) => {
    const {data} = await $authHost.post("api/wait-product/edit", {id,product,place,type})
    return data;
};
export const getUserWishList = async () => {
    const {data} = await $authHost.get("api/wait-product/wish")
    return data;
};
export const deleteWaitProducts = async ({id}) => {
    const {data} = await $authHost.delete(`api/wait-product/${id}`)
    return data;
};

