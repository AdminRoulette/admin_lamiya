import {$authHost} from "@/http";


export const createBrand = async (brand) => {
    const {data} = await $authHost.post('api/brand', brand);
    return data;
}
export const editBrand = async ({name,id,name_ru,popular,code}) => {
    const {data} = await $authHost.post('api/brand/edit', {name,id,name_ru,popular,code});
    return data;
}
export const getAllBrands = async () => {
    const {data} = await $authHost.get('api/brand');
    return data;
}
