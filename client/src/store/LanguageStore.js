import {makeAutoObservable} from "mobx";

export default class LanguageStore {
    constructor() {
        this._isLanguage = {}
        makeAutoObservable(this)
    }

    setIsLanguage(bool) {
        this._isLanguage = bool
    }

    get isLanguage() {
        return this._isLanguage
    }
}