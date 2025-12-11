<template>
	<div class="es-block">
		<Title>等效时数</Title>
    	<div style="width: 100%;height: 90%;">
			<Chart :option="option" />
		</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, onMounted, computed, onBeforeMount } from 'vue'
import Title from '../Title.vue'
import Chart from '@/components/chart/Chart.vue'
import * as echarts from 'echarts'
import { useDataStore } from '@/store/dataStore';
import allData from '@/assets/data/dxss.json'
import { width } from '@/utils/useResize';

const dataStore = useDataStore();
let timer7: any;
const MOBEL7_INTERVAL = 1000 * 60 * 5;
// 组件挂载时获取数据
onMounted(() => {
  // dataType=day&date=2025-09-16
  try {
    const today = new Date().toISOString().split('T')[0];
    dataStore.fetchDxssData({ dataType: 'day', date: today });
    updateChart();
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});

function updateChart() {
  timer7 = setInterval(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      dataStore.fetchDxssData({ dataType: 'day', date: today });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, MOBEL7_INTERVAL);
}

const chartOption = computed(() => {
  if (!dataStore.dxss.data) return {};
  // ... 将 dataStore.dxss 转换为 ECharts 所需的 option 格式
  return {
    width: '90%',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      bottom: '3%',
      itemWidth: 22,
      itemHeight: 4,
      itemGap: 50,
      textStyle: {
        color: '#fff',
      },
      data: [
        {
          name: '光伏',
          itemStyle: {
            // color: '#00C0FF',
          },
        },
        {
          name: '风电',
          itemStyle: {
            // color: '#53FF95',
          },
        },
      ],
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#56677F',
          },
        },
        boundaryGap: false,
        axisTick: {
          show: false,
        },
        data: dataStore.dxss.data.xAxis.data,
        // data: allData.data.xAxis.data,
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '小时',
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#56677F',
          },
        },
      },
    ],
    series: [
      {
        name: '光伏',
        type: 'line',
        stack: 'Total',
        // smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#02C4FF' },
            { offset: 1, color: '#004579' },
          ]),
        },
        lineStyle: {
          width: 2,
          color: '#00C0FF',
        },
        symbol: 'react',
        data: dataStore.dxss.data.series[0]?.data,
        // data: allData.data.series[0]?.data,
      },
      {
        name: '风电',
        type: 'line',
        stack: 'Total',
        showSymbol: false,
        areaStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(34,155,93,0.69)' },
            { offset: 1, color: 'rgba(0,101,94,0.00)' },
          ]),
        },
        lineStyle: {
          width: 2,
          color: '#53FF95',
        },
        symbol: 'react',
        data: dataStore.dxss.data.series[1]?.data,
        // data: allData.data.series[1]?.data,
      },
    ]
  };
});

// 组件卸载时清除定时器
onBeforeMount(() => {
  if (timer7) {
    clearInterval(timer7);
    timer7 = null;
  }
});

// const choiceType = 'map'
const option = ref(chartOption)

// 添加数据更新逻辑
// dataStore.$subscribe(() => {
//   console.log("dataStore.dxss.data.xAxis.data: ", dataStore.dxss.data?.xAxis.data);
  
//   if (dataStore.dxss.data) {
//     option.value.xAxis[0].data = dataStore.dxss.data.xAxis.data;
//     option.value.series[0].data = dataStore.dxss.data.series[0]?.data;
//     option.value.series[1].data = dataStore.dxss.data.series[1]?.data;
//   }
// });
</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;
}
</style>
