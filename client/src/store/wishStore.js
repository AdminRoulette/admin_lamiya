import {makeAutoObservable} from "mobx";

export default class wishList {
  constructor() {
    this._wishLists = []
    makeAutoObservable(this)
  }

  async setDeleteWishList(deviceoptionId) {
    this.setWishList(this._wishLists.filter(item => (item.deviceoptionId !== deviceoptionId)));
  }

  async addWishList(deviceoptionId) {
    let newItem =  {deviceoptionId};
    this._wishLists.push(newItem)
  }


  async setWishList(wishList) {
    this._wishLists = wishList;
  }

  get wishLists() {
    return this._wishLists
  }
}