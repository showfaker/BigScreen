import type { LockInfo, UserInfo, LoginInfo } from '@/service/types/store';
import type { ProjectConfig } from '@/service/types/config';
import { createLocalStorage, createSessionStorage } from '@/service/cache';
import { Memory } from './memory';
import { DEFAULT_CACHE_TIME } from '@/settings/encryption';
import {
    TOKEN_KEY,
    USER_INFO_KEY,
    ROLES_KEY,
    LOCK_INFO_KEY,
    PROJ_CFG_KEY,
    APP_LOCAL_CACHE_KEY,
    APP_SESSION_CACHE_KEY,
    MULTIPLE_TABS_KEY,
    DB_DICT_DATA_KEY,
    TENANT_ID,
    LOGIN_INFO_KEY,
  } from '@/service/enums/cacheEnum';
import { toRaw } from 'vue';
import type { Nullable } from '@/service/types/type';


interface BasicStore {
    [TOKEN_KEY]: string | number | null | undefined;
    [USER_INFO_KEY]: UserInfo;
    [ROLES_KEY]: string[];
    [LOCK_INFO_KEY]: LockInfo;
    [PROJ_CFG_KEY]: ProjectConfig;
    // [MULTIPLE_TABS_KEY]: RouteLocationNormalized[];
    [DB_DICT_DATA_KEY]: string;
    [TENANT_ID]: string;
    [LOGIN_INFO_KEY]: LoginInfo;
  }
type LocalStore = BasicStore;
type SessionStore = BasicStore;
export type BasicKeys = keyof BasicStore;
type LocalKeys = keyof LocalStore;
type SessionKeys = keyof SessionStore;
const ls = createLocalStorage();
const ss = createSessionStorage();
const localMemory = new Memory(DEFAULT_CACHE_TIME);
const sessionMemory = new Memory(DEFAULT_CACHE_TIME);

export class Persistent {
  static getLocal<T>(key: LocalKeys) {
    //update-begin---author:scott ---date:2022-10-27  for：token过期退出重新登录，online菜单还是提示token过期----------
    const globalCache = ls.get(APP_LOCAL_CACHE_KEY);
    if(globalCache){
      localMemory.setCache(globalCache);
    }
    //update-end---author:scott ---date::2022-10-27  for：token过期退出重新登录，online菜单还是提示token过期----------
    return localMemory.get(key)?.value as Nullable<T>;
  }

  static setLocal(key: LocalKeys, value: LocalStore[LocalKeys], immediate = false): void {
    localMemory.set(key, toRaw(value));
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
  }

  static removeLocal(key: LocalKeys, immediate = false): void {
    localMemory.remove(key);
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
  }

  static clearLocal(immediate = false): void {
    localMemory.clear();
    immediate && ls.clear();
  }

  static getSession<T>(key: SessionKeys) {
    return sessionMemory.get(key)?.value as Nullable<T>;
  }

  static setSession(key: SessionKeys, value: SessionStore[SessionKeys], immediate = false): void {
    sessionMemory.set(key, toRaw(value));
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
  }

  static removeSession(key: SessionKeys, immediate = false): void {
    sessionMemory.remove(key);
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
  }
  static clearSession(immediate = false): void {
    sessionMemory.clear();
    immediate && ss.clear();
  }

  static clearAll(immediate = false) {
    sessionMemory.clear();
    localMemory.clear();
    if (immediate) {
      ls.clear();
      ss.clear();
    }
  }
}