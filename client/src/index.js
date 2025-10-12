import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {createContext} from "react";
import UserStore from "./store/UserStore";
import DeviceStore from "./store/DeviceStore";
import BasketStoreStore from './store/BasketStore';
import OrdersStore from './store/OrdersStore';
import OrdersDeviceStore from "./store/OrdersDeviceStore";
import DeviceBasket from "./store/DeviceBasket";
import DeviceDetail from "./store/ParumePartStore";
import wishList from "./store/wishStore";
import LanguageStore from "./store/LanguageStore";
import ShiftStore from "@/store/ShiftStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Context.Provider value={{
            user: new UserStore(),
            shift: new ShiftStore(),
            language: new LanguageStore(),
            device: new DeviceStore(),
            basket: new BasketStoreStore(),
            orders: new OrdersStore(),
            orderDevice: new OrdersDeviceStore(),
            deviceBasket: new DeviceBasket(),
            deviceDetail: new DeviceDetail(),
            wishList: new wishList()
        }}>
            <App/>
        </Context.Provider>
    </React.StrictMode>
);
