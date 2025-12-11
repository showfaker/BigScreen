import { Persistent, BasicKeys } from '@/service/cache/persistant';
import projectSetting from '@/service/projectSetting';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === 1;

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}