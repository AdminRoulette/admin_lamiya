import {$authHost} from "../index";

export const Marketplace = async () => {
    const {data} = await $authHost.get('/api/rozetka/marketplace')
    return data
}
export const CreateElastic = async () => {
    const {data} = await $authHost.post('/api/rozetka/create-elastic');
    return data
}


export const UpdateElastic = async () => {
    const {data} = await $authHost.put('/api/rozetka/update-elastic')
    return data
}

export const StorageExcel = async () => {
    const {data} = await $authHost.get('/api/rozetka/storage-excel', {
        responseType: "blob",
    })
    return data
}
export const DeleteProduct = async ({id}) => {
    const {data} = await $authHost.delete(`/api/rozetka/delete-product?id=${id}`)
    return data
}
export const DeleteOption = async ({id}) => {
    const {data} = await $authHost.delete(`/api/rozetka/delete-option?id=${id}`)
    return data
}
export const UpdateProductScore = async () => {
    const {data} = await $authHost.post('/api/rozetka/update-score')
    return data
}
export const UploadXML = async (formData) => {
    const {data} = await $authHost.post('/api/rozetka/upload-xml', formData)
    return data
}
export const Test1 = async () => {
    const {data} = await $authHost.post('/api/rozetka/test1')
    return data
}
export const Test2 = async () => {
    const {data} = await $authHost.post('/api/rozetka/test2')
    return data
}
export const Test3 = async () => {
    const {data} = await $authHost.post('/api/rozetka/test3')
    return data
}
export const Test4 = async () => {
    const {data} = await $authHost.post('/api/rozetka/test4')
    return data
}
export const Test5 = async () => {
    const {data} = await $authHost.post('/api/rozetka/test5')
    return data
}
