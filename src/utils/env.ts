import type { GlobEnvConfig } from '@/service/types/config';
import pkg from '../../package.json';
import { getConfigFileName } from './getConfigFileName';

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig();
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env);

//   const ENV = (import.meta.env.DEV
//     ? // Get the global configuration (the configuration will be extracted independently when packaging)
//       (import.meta.env as unknown as GlobEnvConfig)
//     : window[ENV_NAME as any]) as unknown as GlobEnvConfig;
  // 优先尝试从 import.meta.env 获取
  const env = import.meta.env;

  // 如果是开发环境或者测试环境，直接使用 import.meta.env
  if (env.DEV || env.MODE === 'development') {
    return {
        VITE_GLOB_APP_TITLE: env.VITE_GLOB_APP_TITLE || '',
        VITE_GLOB_API_URL: env.VITE_GLOB_API_URL || '',
        VITE_USE_MOCK: env.VITE_USE_MOCK || 'false',
        VITE_GLOB_APP_SHORT_NAME: env.VITE_GLOB_APP_SHORT_NAME || '',
        VITE_GLOB_API_URL_PREFIX: env.VITE_GLOB_API_URL_PREFIX || '',
        VITE_GLOB_APP_OPEN_SSO: env.VITE_GLOB_APP_OPEN_SSO || 'false',
        VITE_GLOB_APP_OPEN_QIANKUN: env.VITE_GLOB_APP_OPEN_QIANKUN || 'false',
        VITE_GLOB_APP_CAS_BASE_URL: env.VITE_GLOB_APP_CAS_BASE_URL || '',
        VITE_GLOB_DOMAIN_URL: env.VITE_GLOB_DOMAIN_URL || '',
        VITE_GLOB_ONLINE_VIEW_URL: env.VITE_GLOB_ONLINE_VIEW_URL || '',
    };
  }
    // 生产环境：尝试从 window 获取，但提供降级方案
    try {
        const ENV_NAME = getConfigFileName(import.meta.env);
        const windowEnv = (window as any)[ENV_NAME];
        
        if (windowEnv) {
          return {
            VITE_GLOB_APP_TITLE: windowEnv.VITE_GLOB_APP_TITLE || '',
            VITE_GLOB_API_URL: windowEnv.VITE_GLOB_API_URL || '',
            VITE_USE_MOCK: windowEnv.VITE_USE_MOCK || 'false',
            VITE_GLOB_APP_SHORT_NAME: windowEnv.VITE_GLOB_APP_SHORT_NAME || '',
            VITE_GLOB_API_URL_PREFIX: windowEnv.VITE_GLOB_API_URL_PREFIX || '',
            VITE_GLOB_APP_OPEN_SSO: windowEnv.VITE_GLOB_APP_OPEN_SSO || 'false',
            VITE_GLOB_APP_OPEN_QIANKUN: windowEnv.VITE_GLOB_APP_OPEN_QIANKUN || 'false',
            VITE_GLOB_APP_CAS_BASE_URL: windowEnv.VITE_GLOB_APP_CAS_BASE_URL || '',
            VITE_GLOB_DOMAIN_URL: windowEnv.VITE_GLOB_DOMAIN_URL || '',
            VITE_GLOB_ONLINE_VIEW_URL: windowEnv.VITE_GLOB_ONLINE_VIEW_URL || '',
          };
        }
      } catch (error) {
        console.warn('Failed to get env from window, using fallback values', error);
      }
    
      // 降级方案：返回默认值或空值
      return {
        VITE_GLOB_APP_TITLE: '',
        VITE_GLOB_API_URL: window.location.origin, // 默认使用当前域名
        VITE_USE_MOCK: 'false',
        VITE_GLOB_APP_SHORT_NAME: '',
        VITE_GLOB_API_URL_PREFIX: '/api',
        VITE_GLOB_APP_OPEN_SSO: 'false',
        VITE_GLOB_APP_OPEN_QIANKUN: 'false',
        VITE_GLOB_APP_CAS_BASE_URL: '',
        VITE_GLOB_DOMAIN_URL: window.location.origin,
        VITE_GLOB_ONLINE_VIEW_URL: '',
      };
//   const {
//     VITE_GLOB_APP_TITLE,
//     VITE_GLOB_API_URL,
//     VITE_USE_MOCK,
//     VITE_GLOB_APP_SHORT_NAME,
//     VITE_GLOB_API_URL_PREFIX,
//     VITE_GLOB_APP_OPEN_SSO,
//     VITE_GLOB_APP_OPEN_QIANKUN,
//     VITE_GLOB_APP_CAS_BASE_URL,
//     VITE_GLOB_DOMAIN_URL,
//     VITE_GLOB_ONLINE_VIEW_URL,
//   } = ENV;

//   if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    // warn(
    //   `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    // );
//   }

//   return {
//     VITE_GLOB_APP_TITLE,
//     VITE_GLOB_API_URL,
//     VITE_USE_MOCK,
//     VITE_GLOB_APP_SHORT_NAME,
//     VITE_GLOB_API_URL_PREFIX,
//     VITE_GLOB_APP_OPEN_SSO,
//     VITE_GLOB_APP_OPEN_QIANKUN,
//     VITE_GLOB_APP_CAS_BASE_URL,
//     VITE_GLOB_DOMAIN_URL,
//     VITE_GLOB_ONLINE_VIEW_URL,
//   };
}

/**
 * @description: Development mode
 */
export const devMode = 'development';

/**
 * @description: Production mode
 */
export const prodMode = 'production';

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}
