import { defineConfig, loadEnv  } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir)
}
export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [vue()],
    base: mode === 'production' ? '/screen' : '',
    // base: mode === 'production' ? '/dashboard' : '',
		resolve: {
			alias: {
				'@': pathResolve('src')
			}
		},
		server: {
			port: 3006
		},
	define: {
		// 将环境变量直接注入到代码中
		// '__APP_ENV__': JSON.stringify({
		// 	VITE_GLOB_APP_TITLE: env.VITE_GLOB_APP_TITLE,
		// 	VITE_GLOB_API_URL: env.VITE_GLOB_API_URL,
		// 	VITE_USE_MOCK: env.VITE_USE_MOCK,
		// 	VITE_GLOB_APP_SHORT_NAME: env.VITE_GLOB_APP_SHORT_NAME,
		// 	VITE_GLOB_API_URL_PREFIX: env.VITE_GLOB_API_URL_PREFIX,
		// 	VITE_GLOB_APP_OPEN_SSO: env.VITE_GLOB_APP_OPEN_SSO,
		// 	VITE_GLOB_APP_OPEN_QIANKUN: env.VITE_GLOB_APP_OPEN_QIANKUN,
		// 	VITE_GLOB_APP_CAS_BASE_URL: env.VITE_GLOB_APP_CAS_BASE_URL,
		// 	VITE_GLOB_DOMAIN_URL: env.VITE_GLOB_DOMAIN_URL,
		// 	VITE_GLOB_ONLINE_VIEW_URL: env.VITE_GLOB_ONLINE_VIEW_URL,
		// }),
		'process.env': { }
	}
  }
})
