import { $authHost } from "./index";

export const getSupplyList = async (params) => {
  const { data } = await $authHost.get(`api/supply/get-list?${params}`);
  return data;
};
export const getSupplyLongInfo = async (param) => {
  const { data } = await $authHost.get(`api/supply/get-supply-long-info?${param}`);
  return data;
};
export const getProducts = async (params) => {
  const { data } = await $authHost.get(`api/supply/get-products?${params}`);
  return data;
};

export const addProductToSupply = async ({option_id,price,count,sell_price,market_price}) => {
  const { data } = await $authHost.post(`api/supply/add-product`,{option_id,price,count,sell_price,market_price});
  return data;
};
export const editProductToSupply = async ({option_id,price,count,sell_price,market_price}) => {
  const { data } = await $authHost.put(`api/supply/edit-product`,{option_id,price,count,sell_price,market_price});
  return data;
};

export const CreateSupply = async ({comment,invoice,extra_costs,company,deposit}) => {
  const { data } = await $authHost.post(`api/supply/create`,{comment,invoice,extra_costs,company,deposit});
  return data;
};

export const EditSupply = async ({comment,invoice,extra_costs,company,deposit,id}) => {
  const { data } = await $authHost.post(`api/supply/edit`,{comment,invoice,extra_costs,company,deposit,id});
  return data;
};

export const ApproveSupply = async ({id}) => {
  const { data } = await $authHost.post(`api/supply/approve`,{id});
  return data;
};

export const deleteProductSupply = async ({id}) => {
  const { data } = await $authHost.delete(`api/supply/delete-product?id=${id}`);
  return data;
};

export const PrintSupplyExcel = async ({id}) => {
  const { data } = await $authHost.get(`api/supply/print-supply-excel?id=${id}`, {
    responseType: "blob",
  });
  return data;
};
