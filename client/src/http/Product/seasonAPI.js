import {$authHost} from "../index";

export const getAllSeasons = async () => {
    const {data} = await $authHost.get('api/filters/all-seasons');
    return data;
}
// export const addSeason = async (name,name_ru) => {
//     const {data} = await $authHost.get('api/season/add',{name,name_ru});
//     return data;
// }
export const addParfumeSeason = async (productId,seasonId) => {
    const {data} = await $authHost.post('api/filters/season/parfumeSeason',{productId,seasonId});
    return data;
}
export const deleteSeason = async (id) => {
    const {data} = await $authHost.get(`api/filters/season/${id}`);
    return data;
}
