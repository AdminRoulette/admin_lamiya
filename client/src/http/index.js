import axios from "axios";

let url;
if (process.env.NODE_ENV === "production") {
    url = 'https://admin.lamiya.com.ua/';
} else {
    url = 'http://localhost:5000/';
}

const $host = axios.create({
    baseURL: url
})
const $authHost = axios.create({
    baseURL: url
})


const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost
}