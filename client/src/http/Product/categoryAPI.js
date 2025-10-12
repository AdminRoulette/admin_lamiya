import { $authHost } from "@/http";

export const addCategory = async ({ name, nameRu, parentId, code, vision }) => {
  const { data } = await $authHost.post("api/category", {
    name,
    nameRu,
    parentId,
    code,
    vision,
  });
  return data;
};

export const editCategory = async ({
  id,
  name,
  nameRu,
  parentId,
  code,
  vision,
}) => {
  const { data } = await $authHost.put("api/category", {
    id,
    name,
    nameRu,
    parentId,
    code,
    vision,
  });
  return data;
};

export const deleteCategory = async ({ id }) => {
  const { data } = await $authHost.delete(`api/category?id=${id}` );
  return data;
};

export const getAllCategory = async () => {
  const { data } = await $authHost.get("api/category/all");
  return data;
};

export const getAllLinkedCategories = async () => {
  const { data } = await $authHost.get("api/category/linked");
  return data;
};

export const getFiltersCategory = async ({ id }) => {
  const { data } = await $authHost.get(`api/category/filters?id=${id}`);
  return data;
};
