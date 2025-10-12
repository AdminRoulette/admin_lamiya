import {makeAutoObservable} from "mobx";

export default class DeviceDetail {
    constructor() {
        this._parfumepart = []
        this._bodyCare = []
        makeAutoObservable(this)
    }

    setBodyCares(bodyCareData) {
        this._bodyCare = bodyCareData
    }
    setParfumeParts(parfumePartData) {
        this._parfumepart = parfumePartData
    }


    get bodyCares() {
        return this._bodyCare
    }
    get parfumeParts() {
        return this._parfumepart
    }
}