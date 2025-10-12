import {$authHost} from "./index";

export const getSeoList = async () => {
    const {data} = await $authHost.get('api/seo/list');
    return data;
}

export const importSeoFromGoogle = async () => {
    const {data} = await $authHost.get('api/seo/import');
    return data;
}

export const seoEdit = async ({id,url,title,desc,keywords,article,header}) => {
    const {data} = await $authHost.post('api/seo/edit',{id,url,title,desc,keywords,article,header});
    return data;
}

export const seoCreate = async ({url,title,desc,keywords,article,header}) => {
    const {data} = await $authHost.post('api/seo/create',{url,title,desc,keywords,article,header});
    return data;
}

export const getSeo = async (url) => {
    try {
        const {data} = await $authHost.post('api/seo', {url});
        return data;
    } catch (error) {
        return {title: "Інтернет магазин Lamiya", desc: "Інтернет магазин Lamiya", keywords: "Інтернет магазин Lamiya",canonical: "https://lamiya.com.ua/"};
    }
}

