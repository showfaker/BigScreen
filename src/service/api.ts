import axios from 'axios';
import signMd5Utils from '@/service/sign';
import { getTenantId } from './authpre';
// import { router } from '@/router';

// 创建一个新的 axios 实例
// http://221.226.65.140:8444
// http://www.jszyet.com.cn:8442/api/dashboard/jszy/widget/yxjsDxss?dataType=day&date=2025-09-16&_t=1757992454975
const apiClient = axios.create({
  // baseURL: 'http://221.226.65.140:8444', // 根据实际情况修改
  baseURL: 'http://www.jszyet.com.cn:8442', // 根据实际情况修改
  timeout: 10000, // 超时设置
  headers: {
    'Content-Type': 'application/json, text/plain, */*',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如：从 localStorage 或 Pinia store 获取 token
    const token = localStorage.getItem('jwt');

    if (token) {
      let tenantid:any = getTenantId();
    //   config.headers.Authorization = `Bearer ${token}`;
      config.headers.Authorization = token;
      config.headers['X-Access-Token'] = token;
      config.headers['X-TIMESTAMP'] = signMd5Utils.getTimestamp();
      config.headers['X-SIGN'] = signMd5Utils.getSign(config.url, config.params);
      if (!tenantid) {
        tenantid = 0;
      }
      config.headers['Tenant-id'] = tenantid;
      config.headers['X-Version'] = 'v3';
      // const routeParams = router.currentRoute.value.params;
      // if (routeParams.appId) {
      //   config.headers['X-Low-App-ID'] = routeParams.appId;
      //   // lowApp自定义筛选条件
      //   if (routeParams.lowAppFilter) {
      //     config.params = { ...config.params, ...JSON.parse(routeParams.lowAppFilter as string) };
      //     delete routeParams.lowAppFilter;
      //   }
      // }
    }
    // console.log('发送请求：', config);
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误：', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // console.log('收到响应：', response);
    return response.data; // 通常我们只需要 .data 部分
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.error('响应错误：', error.response);

    // 统一错误处理
    if (error.response?.status === 401) {
      // 处理未授权，跳转到登录页
      console.error('未授权，请重新登录！');
      // router.push('/login');
    } else if (error.response?.status >= 500) {
      // 处理服务器错误
      console.error('服务器内部错误！');
    }

    // 将错误继续抛给具体的请求调用处，以便它们也能处理（例如显示具体的错误信息）
    return Promise.reject(error);
  }
);

export default apiClient;