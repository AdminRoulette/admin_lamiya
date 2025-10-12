import {$authHost, $host} from "./index";


export const AdminSearchList = async () => {
    const {data} = await $authHost.get(`api/search/searchList`);
    return data;
}
