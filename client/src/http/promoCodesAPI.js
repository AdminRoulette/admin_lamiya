import {$authHost} from "./index";

export const createPromoCode = async ({code, privacy, percent,sum,count,expdate,minOrder}) => {
    const {data} = await $authHost.post('api/promo', {code, privacy, percent,sum,count,expdate,minOrder});
    return data;
}

export const getAllPromoCodes = async () => {
    const {data} = await $authHost.get('api/promo');
    return data;
}