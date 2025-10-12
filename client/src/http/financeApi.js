import {$authHost} from "./index";

export const getFopPayments = async ({id}) => {
  const {data} = await $authHost.get(`api/mono/get-fop-payments?id=${id}`);
  return data;
}

export const getFopsList = async () => {
  const { data } = await $authHost.get(`api/finance/get-fops-list`);
  return data;
};

export const createFop = async (value) => {
  const { data } = await $authHost.post(`api/finance/create-fop`,{value});
  return data;
};

export const editFop = async (value) => {
  const { data } = await $authHost.post(`api/finance/edit-fop`,{value});
  return data;
};

export const getCollection = async () => {
  const { data } = await $authHost.get(`api/finance/collection`);
  return data;
};
export const createCollection = async ({shop_id, cash_count,comment}) => {
  const { data } = await $authHost.post(`api/finance/create-collection`,{shop_id, cash_count,comment});
  return data;
};

export const addExpense = async ({type,money,name,shopId}) => {
  const { data } = await $authHost.post(`api/finance/create-expenses`,{type,money,name,shopId});
  return data;
};

export const getExpenses = async (offset) => {
  const { data } = await $authHost.get(`api/finance/get-expenses-list?offset=${offset}`);
  return data;
};

export const updateExpenses = async ({id,type,money,name}) => {
  const { data } = await $authHost.put(`api/finance/update-expenses`,{id,type,money,name});
  return data;
};

