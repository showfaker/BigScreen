import { getAuthCache } from './auth';
import { TENANT_ID } from '@/service/enums/cacheEnum';


export function getTenantId() {
    return getAuthCache<string>(TENANT_ID);
}