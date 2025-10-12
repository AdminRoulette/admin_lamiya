import {$authHost} from "./index";

export const getAllPriceTags = async ({offset,type}) => {
    const {data} = await $authHost.get(`api/price-tags/get-all?offset=${offset}${type?`&type=${type}`:""}`);
    return data;
}
export const printingExcelTags = async ({ids}) => {
    const {data} = await $authHost.post('api/price-tags/printing-excel',{ids}, {
        responseType: "blob",
    });
    return data;
}