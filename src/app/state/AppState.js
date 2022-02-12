import { makeAutoObservable } from 'mobx';
import getString from '../../strings';

class AppState {
  rightDrawerOpen = false;
  leftDrawerOpen = false;
  toast = null;

  constructor() {
    makeAutoObservable(this);
    this.rightDrawerOpen = window.innerWidth > 900;
  }

  setRightDrawerOpen(value) {
    this.rightDrawerOpen = value;
  }

  setLeftDrawerOpen(value) {
    this.leftDrawerOpen = value;
  }

  setToast(toast) {
    this.toast = toast;
  }
}

const appState = new AppState();
export default appState;
