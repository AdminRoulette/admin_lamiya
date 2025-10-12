import {$authHost} from "../index";

export const getAllRating = async () => {
    const {data} = await $authHost.get('api/rating/get-all');
    return data;
}

export const PostRating = async ({id}) => {
    const {data} = await $authHost.post('api/rating/moderation-rating',{id});
    return data;
}
export const PostReply = async ({id}) => {
    const {data} = await $authHost.post('api/rating/moderation-reply',{id});
    return data;
}

export const deleteRating = async ({id}) => {
    const {data} = await $authHost.delete(`api/rating/delete-rating/${id}`);
    return data;
}

export const deleteReply = async ({id}) => {
    const {data} = await $authHost.delete(`api/rating/delete-reply/${id}`);
    return data;
}

export const EditRating = async (obj) => {
    const {data} = await $authHost.post(`api/rating/edit-rating`,{...obj});
    return data;
}
