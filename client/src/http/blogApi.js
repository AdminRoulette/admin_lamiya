import {$authHost, $host} from "./index";

export const createArticle = async (FormData) => {
    const {data} = await $authHost.post('api/blog/create-article',FormData);
    return data;
}
export const getArticlesList = async () => {
    const {data} = await $authHost.get('api/blog/get-list');
    return data;
}

export const editArticle = async (FormData) => {
    const {data} = await $authHost.post(`api/blog/edit-article`,FormData);
    return data;
}

export const getArticle = async (link,language) => {
    const {data} = await $authHost.get(`api/blog/get-article?link=${link}&language=${language}`);
    return data;
}

export const getProducts = async (name) => {
    const {data} = await $authHost.get(`api/blog/get-products/?name=${name}`);
    return data;
}

export const uploadImage = async (image) => {
    const {data} = await $authHost.post(`api/blog/upload-image`,image);
    return data;
}

export const getProductsInfo = async (ids,language) => {
    const {data} = await $authHost.get(`api/blog/get-products-info?ids=${ids}&language=${language}`);
    return data;
}

export const getBlogCategories = async () => {
    const {data} = await $authHost.get(`api/blog/get-blog-categories`);
    return data;
}

export const getBlogAuthor = async () => {
    const {data} = await $authHost.get(`api/blog/get-blog-authors`);
    return data;
}

export const createAuthor = async (formData) => {
    const {data} = await $authHost.post(`api/blog/create-authors`,formData);
    return data;
}
export const editAuthors = async (formData) => {
    const {data} = await $authHost.post(`api/blog/edit-authors`,formData);
    return data;
}

export const createBlogCategory = async ({name,name_ru}) => {
    const {data} = await $authHost.post(`api/blog/create-category`,{name,name_ru});
    return data;
}
export const editBlogCategory = async ({id,name,name_ru}) => {
    const {data} = await $authHost.post(`api/blog/edit-category`,{id,name,name_ru});
    return data;
}