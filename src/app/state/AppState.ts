import { makeAutoObservable } from 'mobx';

export class AppState {
  rightDrawerOpen: boolean = false;
  leftDrawerOpen: boolean = false;
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

  setToast(toast: any) {
    this.toast = toast;
  }
}

const appState = new AppState();
export default appState;
