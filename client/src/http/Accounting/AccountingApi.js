import {$authHost} from "../index";

export const getAccountingStock = async () => {
        const {data} = await $authHost.get('api/accounting/stock',);
        return data;
}
export const getMoney = async () => {
        const {data} = await $authHost.get('api/accounting/money',);
        return data;
}

export const Revenue = async () => {
        const {data} = await $authHost.get('api/accounting/revenue',);
        return data;
}

export const getAnalytics = async (pastDate,currentDate) => {
        const {data} = await $authHost.get(`api/accounting/analytics?start=${pastDate}&end=${currentDate}`,);
        return data;
}
export const getMoneyLose = async (pastDate,currentDate) => {
        const {data} = await $authHost.get(`api/accounting/lose?start=${pastDate}&end=${currentDate}`,);
        return data;
}


