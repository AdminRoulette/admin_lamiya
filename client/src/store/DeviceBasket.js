import {makeAutoObservable} from "mobx";

export default class DeviceBasket {
    constructor() {
        this._deviceBaskets = []
        makeAutoObservable(this)
    }

    async setDeleteItemDeviceBasket(id) {
            this.setDeviceBaskets(this._deviceBaskets.filter(item => (item.deviceoptionId !== id)));
    }

    async addDeviceBasket({option, count}) {
        let newItem = {...option,count:count};
        this._deviceBaskets.push(newItem)
    }
    async ChangeDeviceBasketCount({deviceoptionId,count}) {
        this._deviceBaskets.forEach(elem =>{
          if (elem.deviceoptionId === deviceoptionId)
          {
              elem.count += count;
          }
        })
        this.setDeviceBaskets(this._deviceBaskets)
    }

    async setDeviceBaskets(deviceBasketData) {
        this._deviceBaskets = deviceBasketData;
    }

    get deviceBaskets() {
        return this._deviceBaskets
    }
}