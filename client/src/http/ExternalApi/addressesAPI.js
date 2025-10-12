import {$authHost} from "../index";


export const getCityList = async ({name, language ,provider}) => {
    const {data} = await $authHost.get(`/api/addresses/get-city-list?name=${name}&language=${language}&provider=${provider}`)
    return data;
}
export const getWarehouseList = async ({cityRef,language, provider}) => {
    const {data} = await $authHost.get(`/api/addresses/get-warehouse-list?cityRef=${cityRef}&language=${language}&provider=${provider}`)
    return data;
}

export const getStreetList = async ({cityRef, name}) => {
    const {data} = await $authHost.get(`/api/addresses/get-street-list?cityRef=${cityRef}&name=${name}`)
    return data;
}

export const getDefaultCity = async (language) => {
    const {data} = await $authHost.get(`/api/addresses/get-default-city?language=${language}`)
    return data;
}

// export const getDeliveryPrice = async (CityRecipient, Weight, Cost) => {
//     const {data} = await $host.post('/api/novaposhta/getDelPrice',
//         {
//             CityRecipient, Weight, Cost
//         })
//     return data
// }

// export const getDeliveryPrice = async (RecipientPostCode, Cost, weight) => {
//     const {data} = await $host.post(`/api/ukrposhta/getDelPrice`,{RecipientPostCode, Cost, weight});
//     return data
// };


