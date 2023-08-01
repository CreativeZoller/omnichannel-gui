import { Injectable } from '@angular/core';
// This service is only to create, modify, read and delete storage session key-value pairs while users browsing
@Injectable()
export class SessionStorageService {
  setVariableToStorage(key, value): void {
    if (typeof Storage !== 'undefined') {
      switch (value) {
        case undefined:
        case false:
        case null:
        case '':
          sessionStorage.removeItem(key);
          break;
        default:
          sessionStorage.setItem(key, value);
          break;
      }
      // console.clear();
      // console.dir(sessionStorage);
    } else {
      console.warn('Sorry, your browser does not support Web Storage... Please update it');
    }
  }

  unsetVariableFromStorage(key) {
    sessionStorage.removeItem(key);
  }

  getVariableFromStorage(key) {
    return sessionStorage.getItem(key);
  }

  unsetAllToStorage(): void {
    sessionStorage.clear();
  }
}
