<template>
	<div class="es-block">
		<Title>电站类型</Title>
    	<div style="width: 100%;height: 98%;">
			<Chart :option="option" />
		</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, onMounted, computed } from 'vue'
import Title from '../Title.vue'
import Chart from '@/components/chart/Chart.vue'
import { StationType, StationData } from '@/views/type/station'
import { useDataStore } from '@/store/dataStore'
import { useScreenStore } from '@/store'
import { number } from 'echarts'
import { width } from '@/utils/useResize'

const dataStore = useDataStore();
const screenStore = useScreenStore();
// const colors = ['#63C1FF', '#53FF95', '#505372'];
const colors = ['#53FF95', '#63C1FF', '#505372'];

/**
 * 01-集中式光伏电站 02-屋顶分布式光伏 03-农光互补分布式光伏 04-鱼光互补分布式光伏
05-山地分布式光伏 07-户用型分布式光伏 08-整县光伏 06-车棚分布式光伏 20-陆上风电 21-海上风电
 */
 const stationType: StationType = {
  '01': '集中式光伏',
  '02': '屋顶光伏',
  '03': '农光互补光伏',
  '04': '鱼光互补光伏',
  '05': '山地光伏',
  '06': '车棚光伏',
  '07': '户用型光伏',
  '08': '整县光伏',
  '20': '陆上风电',
  '21': '海上风电'
};
const FIRST_SYSTEM_BASE_ADDITION = 200;
const CONCENTRATED_PV_ADDITION = {
  count: 7,
  capacity: 600
};

const typeName = ref<string[]>([]);
const count = ref<number[]>([]);
const totalCapacity = ref<number[]>([]);

function createArray(data: { count?: number; totalCapacity?: number }) {
  // 清空数组而不是重新创建 ref
  typeName.value = [];
  count.value = [];
  totalCapacity.value = [];

  for (const [key, value] of Object.entries(data)) {
    if (!stationType[key]) continue;

    const currentValue = { ...(value as { count?: number; totalCapacity?: number }) };
    
    if (screenStore.system === 'first') {
      currentValue.totalCapacity = parseFloat(
        (currentValue.totalCapacity! + FIRST_SYSTEM_BASE_ADDITION).toFixed(2)
      );

      if (stationType[key] === '集中式光伏') {
        currentValue.count = currentValue.count! + CONCENTRATED_PV_ADDITION.count;
        currentValue.totalCapacity = parseFloat(
          (currentValue.totalCapacity + CONCENTRATED_PV_ADDITION.capacity).toFixed(2)
        );
      }
    }

    count.value.push(currentValue.count || 0);
    totalCapacity.value.push(currentValue.totalCapacity || 0);
    typeName.value.push(stationType[key]);
  }
}

// 组件挂载时获取数据
onMounted(() => {
  try {
    dataStore.fetchStationCount({});
  } catch (error) {
    console.error('Failed to fetchStationCount data:', error);
  }
});

const chartOption = computed(() => {
    if (!dataStore.stationChart) return {};
    createArray(dataStore.stationChart.data);
    const color = computed(() => screenStore.theme === 'dark' ? '#fff' : '#000');
    // let width = screenStore.system === 'first' ? '98%' : '100%';
    return {
      // width: width,
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        textStyle: {
          color: color.value,
        },
        data: ['数量', '容量(万kW)']
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: color.value,
            interval: 0,
            rotate: 35,
            overflow: 'break',
            fontSize: 13,
          },
          // prettier-ignore
          data: typeName.value
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '数量',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[0]
            }
          },
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: '容量(万kW)',
          position: 'right',
          offset: -10,
          alignTicks: true,
          axisLine: {
            show: false,
            lineStyle: {
              color: colors[1]
            },
          },
          axisLabel: {
            formatter: '{value}'
          }
        },
      ],
      series: [
        {
          name: '数量',
          type: 'bar',
          data: count.value
        },
    /**
     * {
      "status": 0,
      "data": {
        "20": {
          "count": 7,
          "totalCapacity": 334.5
        },
        "01": {
          "count": 3,
          "totalCapacity": 293.73
        },
        "02": {
          "count": 3,
          "totalCapacity": 63.4
        },
        "03": {
          "count": 1,
          "totalCapacity": 127.66
        },
        "05": {
          "count": 3,
          "totalCapacity": 330.43
        },
        "06": {
          "count": 1,
          "totalCapacity": 36.31
        },
        "08": {
          "count": 5,
          "totalCapacity": 164.22
        }
      }
    }
    */
        {
          name: '容量(万kW)',
          type: 'bar',
          yAxisIndex: 1,
          data: totalCapacity.value
        }
      ]
    }
  })
const option = ref(chartOption);
  // stationData.value = Object.entries(data)
  //   .filter(([key]) => stationType[key] !== undefined) // 只处理存在的stationType
  //   .map(([key, value]) => ({
  //     name: stationType[key],
  //     count: value?.count || 0,
  //     totalCapacity: value?.totalCapacity || 0
  //   }));
  // 如果需要单独的count/totalCapacity数组
//   count.value = stationData.value.map(item => item.count);
//   totalCapacity.value = stationData.value.map(item => item.totalCapacity);
</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;
}
</style>
