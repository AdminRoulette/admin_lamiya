import {makeAutoObservable} from "mobx";

export default class OrdersDeviceStore {
    constructor() {
        this._orderdevices = []
        makeAutoObservable(this)
    }

    setOrderDevices(ordersDeviceData) {
        this._orderdevices = ordersDeviceData
    }

    get orderDevices() {
        return this._orderdevices
    }
}