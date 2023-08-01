import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PersistService {
  constructor() {}
  set<T>(key: string, data: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error getting data from localStorage: ' + e + 'Set persist value!');
    }
  }

  get<T>(key: string): T {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (e) {
      console.error('Error getting data from localStorage: ' + e + 'Get persist value!');
      return null;
    }
  }

  remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.error('Error getting data from localStorage: ' + e + 'Remove persist value!');
    }
  }

  clear(): void {
    try {
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing the localStorage!' + e);
    }
  }
}
