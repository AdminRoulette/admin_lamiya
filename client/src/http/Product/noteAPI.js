import {$authHost} from "../index";

export const getAllNotes = async () => {
    const {data} = await $authHost.get('api/filters/all-notes');
    return data;
}
export const addNotes = async ({name,name_ru}) => {
    const {data} = await $authHost.post('api/filters/note/add',{name, name_ru});
    return data;
}
export const addParfumeNote = async (noteId, productId,type) => {
    const {data} = await $authHost.post('api/filters/note/parfumeNote',{noteId, productId,type});
    return data;
}
export const deleteNotes = async (id) => {
    const {data} = await $authHost.get(`api/filters/note/${id}`);
    return data;
}
