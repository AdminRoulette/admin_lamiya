import {makeAutoObservable} from "mobx";

export default class ShiftStore {
    constructor() {
        this._Shift = false
        makeAutoObservable(this)
    }

    setShift(bool) {
        this._Shift = bool
    }


    get Shift() {
        return this._Shift
    }

}