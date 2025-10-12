import {$authHost, $host} from "../index";



export const checkPhoneForPartPayment = async ({phone,language}) => {
    const {data} = await $authHost.post('api/mono/check-phone',{phone,language});
    return data;
}
