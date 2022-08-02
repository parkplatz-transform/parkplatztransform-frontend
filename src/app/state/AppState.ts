import { makeAutoObservable } from 'mobx';

class AppState {
  rightDrawerOpen = false;
  leftDrawerOpen = false;
  toast = null;

  constructor() {
    makeAutoObservable(this);
    this.rightDrawerOpen = window.innerWidth > 900;
  }

  setRightDrawerOpen(value: boolean) {
    this.rightDrawerOpen = value;
  }

  setLeftDrawerOpen(value: boolean) {
    this.leftDrawerOpen = value;
  }

  setToast(toast) {
    this.toast = toast;
  }
}

const appState = new AppState();
export default appState;
