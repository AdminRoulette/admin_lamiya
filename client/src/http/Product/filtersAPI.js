import {$authHost} from "../index";


export const AddAllNotes = async (notes) => {
    const {data} = await $authHost.post('api/filters/note/add-all',{notes});
    return data;
}
export const getFilters = async () => {
    const {data} = await $authHost.get('api/filters/get-all',);
    return data;
}
export const createFilter = async ({name,name_ru,code}) => {
    const {data} = await $authHost.post('api/filters/create',{name,name_ru,code});
    return data;
}
export const createFilterValue = async ({name,name_ru,code,filter_id}) => {
    const {data} = await $authHost.post('api/filters/create-value',{name,name_ru,code,filter_id});
    return data;
}
export const editFilter = async ({id,name,name_ru,code}) => {
    const {data} = await $authHost.put('api/filters/edit',{id,name,name_ru,code});
    return data;
}
export const editFilterValue = async ({id,name,name_ru,code,filter_id}) => {
    const {data} = await $authHost.put('api/filters/edit-value',{id,name,name_ru,code,filter_id});
    return data;
}
export const deleteFilterValue = async ({id}) => {
    const {data} = await $authHost.post('api/filters/delete-value',{id});
    return data;
}

export const getAllCountries = async () => {
    const {data} = await $authHost.get('api/filters/all-countries');
    return data;
}

export const deleteCategoryFilters = async ({ids,categoryId}) => {
    const {data} = await $authHost.post('api/filters/delete-category-filters',{ids,categoryId});
    return data;
}

export const addCategoryFilters = async ({ids,categoryId}) => {
    const {data} = await $authHost.post('api/filters/add-category-filters',{ids,categoryId});
    return data;
}

export const getCategoryFilters = async (id) => {
    const {data} = await $authHost.get(`api/filters/category-filters?id=${id}`);
    return data;
}


