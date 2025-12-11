import type { App } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Screen from '@/views/screen/index.vue'
// import { basicRoutes } from './routes';

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = [];
const getRouteNames = (array: any[]) =>
  array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name);
    getRouteNames(item.children || []);
  });
// getRouteNames(basicRoutes);

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		redirect: '/screen'
	},
	{
		path: '/screen',
		component: Screen
	}
]

export const router = createRouter({
	// history: createWebHashHistory(),
	history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
	routes,
	// routes: basicRoutes as unknown as RouteRecordRaw[],
	strict: true,
	scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function resetRouter() {
	router.getRoutes().forEach((route) => {
	  const { name } = route;
	  if (name && !WHITE_NAME_LIST.includes(name as string)) {
		router.hasRoute(name) && router.removeRoute(name);
	  }
	});
  }
  
  // config router
  export function setupRouter(app: App<Element>) {
	app.use(router);
  }
  