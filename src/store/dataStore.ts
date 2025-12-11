import { defineStore } from 'pinia';
import apiClient from '@/service/api'; // 导入封装好的 axios 实例
import { joinTimestamp } from '@/service/helper'; // 导入时间处理函数
import { systemgjData, StationData } from '@/views/type/station'

export const useDataStore = defineStore('data', {
  state: () => ({
    chartData: {},
    mapData: {},
    loading: false,
    error: null,
    //等效时数量数据
    dxss: {
      data: null as Record<string, any> | null, // 假定数据结构未知，使用any类型
      status: 0
    },
    // 生产进度
    scjd: {
      data: null as Record<string, any> | null, // 假定数据结构未知，使用any类型
      status: 0
    },
    // 发电统计
    fdtj: {
      data: null as Record<string, any> | null, // 假定数据结构未知，使用any类型
      status: 0
    },
    // 设备统计
    sbtj: {
      sun: {
        data: null as Record<string, any> | null,
        status: 0
      },
      wind: {
        data: null as Record<string, any> | null,
        status: 0
      }
    },
    // 物料统计
    materialCount: {
      data: null as Record<string, any> | null,
      status: 0
    },
    // 发电趋势
    fdqs: {
      data: null as Record<string, any> | null,
      status: 0
    },
    // center电站数据
    stationData: {
      data: null as Record<string, any> | null,
      status: 0
    },
    // 发电排名
    fdpm: {
      data: [] as any,
      status: 0
    },
    // 电站类型
    stationChart: {
      data: {} as any,
      status: 0
    },
    // 系统告警
    ssgj: {
      status: 0,
      data: {
        content: [] as any
      },
    },
    // 地图坐标
    stationMap: [] as any, // 假定数据结构未知，使用any类型

  }),
  actions: {
    async fetchChartData(params) {
      this.loading = true;
      this.error = null;
      try {
        // 使用封装的 apiClient 发起请求
        const response = await apiClient.get('/chart-data', { params });
        this.chartData = response; // 响应拦截器已经帮我们返回了 response.data
      } catch (err: any) {
        this.error = err.message || '获取图表数据失败';
        console.error('fetchChartData error:', err);
      } finally {
        this.loading = false;
      }
    },
    async updateMapData(newData) {
      try {
        const response = await apiClient.post('/map-data', newData);
        this.mapData = response;
      } catch (err) {
        // ... 错误处理
        console.error('updateMapData error:', err);
      }
    },
    // /api/dashboard/jszy/widget/scglScjd?_t=1758005652962
    async fetchScjdData(params) {
      this.loading = true;
      const joinTime = true; // 假定这里总是需要加入时间戳，可以根据实际情况调整此值或参数传入方式
      params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      try {
        const response = await apiClient.get('/api/dashboard/jszy/widget/scglScjd', { params });
        this.scjd = {
          data: response.data || null,
          status: response.status || 0
        };
      } catch (err) {
        console.error('fetchScjdData error:', err);
      } finally {
        this.loading = false;
      }
    },

    // /api/dashboard/jszy/widget/yxjsFdtj?_t=1758005652964
    async fetchFdtjData(params) {
      this.loading = true;
      const joinTime = true; // 假定这里总是需要加入时间戳，可以根据实际情况调整此值或参数传入方式
      params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      try {
        const response = await apiClient.get('/api/dashboard/jszy/widget/yxjsFdtj', { params });
        // 这里需要根据实际返回的数据结构来处理数据
        if (response && response.data && response.status != -1) {
          // 处理数据...
          this.fdtj = {
            data: response.data,
            status: response.status
          };
        }
      } catch (err) {
        console.error('fetchFdtjData error:', err);
      } finally {
        this.loading = false;
      }
    },

    // /api/dashboard/jszy/widget/yxjsSbzt?type=01&_t=1758005652981
    async fetchSbtjData(params) {
      this.loading = true;
      const joinTime = true; // 假定这里总是需要加入时间戳，可以根据实际情况调整此值或参数传入方式
      params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      try {
        const response = await apiClient.get('/api/dashboard/jszy/widget/yxjsSbzt', { params });
        // 这里需要根据实际返回的数据结构来处理数据
        if (response && response.data && response.status != -1) {
          // 处理数据...
          if (params.type === '01') {
            this.sbtj.sun = {
              data: response.data,
              status: response.status
            };
          } else if (params.type === '02') {
            this.sbtj.wind = {
              data: response.data,
              status: response.status
            };
          } else {
            // 处理其他类型的数据...
          }
        }
      } catch (err) {
        console.error('fetchSbtjData error:', err);
      } finally {
        this.loading = false;
      }
    },

    // /api/v2/dashboard/getMaterialCount
    async fetchMaterialCount(params) {
      this.loading = true;
      const joinTime = true; // 假定这里总是需要加入时间戳，可以根据实际情况调整此值或参数传入方式
      params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      try {
        const response = await apiClient.get('/api/v2/dashboard/getMaterialCount', { params });
        // 这里需要根据实际返回的数据结构来处理数据
        if (response && response.data && response.status != -1) {
          // 处理数据...
          this.materialCount = response.data;
        }
      } catch (err) {
        console.error('fetchMaterialCount error:', err);
      } finally {
        this.loading = false;
      }
    },

    // /api/dashboard/jszy/widget/yyfxFdpm?dataType=month&_t=1758078840638
    async fetchFdpmData(params) {
      this.loading = true;
      const joinTime = true; // 假定这里总是需要加入时间戳，可以根据实际情况调整此值或参数传入方式
      params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      try {
        const response = await apiClient.get('/api/dashboard/jszy/widget/yyfxFdpm', { params });
        // 这里需要根据实际返回的数据结构来处理数据
        if (response && response.data && response.status != -1) {
          // 处理数据...
          this.fdpm = {
            data: response.data,
            status: response.status
          };
        } else {
          this.fdpm = {
            data: null,
            status: -1
          };
        }
        console.log('yyfxFdpm', response);
      } catch (err) {
        console.error('fetchFdxpData error:', err);
      } finally {
        this.loading = false;
      }
    },

    // /api/dashboard/jszy/widget/yxjsFdqs?dataType=day&date=2025-09-16&_t=1758005652989
    async fetchFdqsData(params) {
      this.loading = true;
      const joinTime = true; // 假定这里总是需要加入时间戳，可以根据实际情况调整此值或参数传入方式
      params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      try {
        const response = await apiClient.get('/api/dashboard/jszy/widget/yxjsFdqs', { params });
        // 这里需要根据实际返回的数据结构来处理数据
        if (response && response.data && response.status != -1) {
          // 处理数据...
          this.fdqs = {
            data: response.data,
            status: response.status
          };
        }
      } catch (err) {
        console.error('fetchFdqsData error:', err);
      } finally {
        this.loading = false;
      }
    },

    // /api/v2/dashboard/getStationData
    async fetchStationData(params) {
      this.loading = true;
      const joinTime = true; // 假定这里总是需要加入时间戳，可以根据实际情况调整此值或参数传入方式
      params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      try {
        const response = await apiClient.get('/api/v2/dashboard/getStationData', { params });
        // 这里需要根据实际返回的数据结构来处理数据
        if (response && response.data && response.status != -1) {
          // 处理数据...
          this.stationData = {
            data: response.data,
            status: response.status
          };
        }
      } catch (err) {
        console.error('fetchStationData error:', err);
      } finally {
        this.loading = false;
      }
    },
    
    // /api/v2/dashboard/getStationCount
    async fetchStationCount(params) {
      this.loading = true;
      const joinTime = true; // 假定这里总是需要加入时间戳，可以根据实际情况调整此值或参数传入方式
      params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      try {
        const response = await apiClient.get('/api/v2/dashboard/getStationCount', { params });
        // 这里需要根据实际返回的数据结构来处理数据
        if (response && response.data && response.status != -1) {
          // 处理数据...
          this.stationChart = {
            data: response.data,
            status: response.status
          };
        }
      } catch (err) {
        console.error('fetchStationCount error:', err);
      } finally {
        this.loading = false;
      }
    },

    // /api/dashboard/jszy/widget/yxjsSsgj
    async fetchSsgjData(params) {
      this.loading = true;
      const joinTime = true; // 假定这里总是需要加入时间戳，可以根据实际情况调整此值或参数传入方式
      params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      try {
        // const response = await apiClient.get('/api/dashboard/jszy/widget/yxjsSsgj', { params });
        // /api/alarmLog/getAlarmLogs
        const response = await apiClient.get('/api/alarmLog/getAlarmLogs', { params });
        // 这里需要根据实际返回的数据结构来处理数据
        if (response && response.data && response.status != -1) {
          // 处理数据...
          this.ssgj = {
            data: response.data,
            status: response.status
          };
        }
      } catch (err) {
        console.error('fetchSsgjData error:', err);
      } finally {
        this.loading = false;
      }
    },

    // /api/v2/monitor/center/stations
    async fetchStationMap(params) {
      this.loading = true;
      const joinTime = true; // 假定这里总是需要加入时间戳，可以根据实际情况调整此值或参数传入方式
      params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      try {
        const response = await apiClient.get('/api/v2/monitor/center/stations', { params });
        // 这里需要根据实际返回的数据结构来处理数据
        if (response && response.data && response.status != -1) {
          // 处理数据...
          // let regoin = response.data.stations.map(item => item.region);
          // console.log('regoin', regoin);
          let mapStruct: any = [
            {"name":""},
            {"name": "光伏电站", "children": []},
            {"name": "风机电站", "children": []}
          ]
          response.data.stations.forEach(item => {
            item.name = item.region;
            item.value = [item.log, item.lat]
            // item.value[0] = item.log;
            // item.value[1] = item.lat;
            if (item.stationClass === '01') {
              mapStruct[1].children.push(item);
            }
            if (item.stationClass === '02') {
              mapStruct[2].children.push(item);

            }
          });
          console.log('mapStruct', mapStruct);
          
          this.stationMap = mapStruct;
          // this.stationMap = {
          //   data: response.data,
          //   status: response.status
          // };
        }
      } catch (err) {
        console.error('fetchStationList error:', err);
      } finally {
        this.loading = false;
      }
    },

    // 添加获取等效时数量数据的方法
    // /api/dashboard/jszy/widget/yxjsDxss?dataType=day&date=2025-09-16&_t=1757992454975
    async fetchDxssData(params) {
      this.loading = true;
      const joinTime = true; // 假定这里总是需要加入时间戳，可以根据实际情况调整此值或参数传入方式
      params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      try {
        const response = await apiClient.get('/api/dashboard/jszy/widget/yxjsDxss', { params });
        this.dxss = {
          data: response.data || null,
          status: response.status || 0
        };
      } catch (err) {
        console.error('fetchDxssData error:', err);
      } finally {
        this.loading = false;
      }
    },
    // 其他方法...
  },
});