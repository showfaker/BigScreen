<template>
	<div class="es-block mobel-eight">
		<Title>发电趋势</Title>
    <div style="width: 100%;height: 90%;">
			<Chart :option="option" />
		</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import Title from '../Title.vue'
import Chart from '@/components/chart/Chart.vue'
import allData from '@/assets/data/fdqs.json'
import * as echarts from 'echarts'
import { useDataStore } from '@/store/dataStore'

const dataStore = useDataStore()
let timer8: any;
const MOBEL8_INTERVAL = 1000 * 60 * 7; // 每7分钟刷新一次
// const MOBEL8_INTERVAL = 1000 * 7; // 每7分钟刷新一次


// 组件挂载时获取数据
onMounted(() => {
  // dataType=day&date=2025-09-16
  try {
    const today = new Date().toISOString().split('T')[0];
    dataStore.fetchFdqsData({ dataType: 'day', date: today });
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
  fetchData();
});

function fetchData() {
  timer8 = setInterval(() => {
    // const option = echarts.init(document.querySelector('.mobel-eight') as HTMLElement);
    // option.clear();
    try {
      const today = new Date().toISOString().split('T')[0];
      dataStore.fetchFdqsData({ dataType: 'day', date: today });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, MOBEL8_INTERVAL);
}

// 在组件卸载时清理定时器
onBeforeUnmount(() => {
  if (timer8) {
    clearInterval(timer8);
    timer8 = null;
  }
});

const chartData = computed(() => {
  if (!dataStore.fdqs.data) return {};

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
          name: '光伏发电',
          itemStyle: {
            color: '#53FF95',
          },
        },
        {
          name: '风力发电',
          itemStyle: {
            color: '#63C1FF',
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
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#56677F',
        },
      },
      axisTick: {
        show: false,
      },
      data: dataStore.fdqs.data.xAxis.data,
      // data: allData.data.xAxis.data,
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
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
    series: [
      {
        name: '光伏发电',
        type: 'bar',
        stack: 'total',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#02FF73' },
            { offset: 1, color: '#005D2F' },
          ]),
        },
        data: dataStore.fdqs.data.series[0].data,
        // data: allData.data.series[0].data,
      },
      {
        name: '风力发电',
        type: 'bar',
        stack: 'total',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#02C4FF' },
            { offset: 1, color: '#004579' },
          ]),
        },
        data: dataStore.fdqs.data.series[1].data,
        // data: allData.data.series[1].data,
      },
    ],
  }
})
const option = ref(chartData)

// function getSeries() {
// 	const centerArr = [
// 		['18%', '40%'],
// 		['50%', '40%'],
// 		['82%', '40%'],
// 		['34%', '75%'],
// 		['66%', '75%']
// 	]
// 	const colorArr = [
// 		['#4FF778', '#0BA82C'],
// 		['#E5DD45', '#E8B11C'],
// 		['#E8821C', '#E55445'],
// 		['#5052EE', '#AB6EE5'],
// 		['#23E5E5', '#2E72BF']
// 	]
// 	// 处理图表需要的数据
// 	const start = currentIndex.value * 5
// 	const end = (currentIndex.value + 1) * 5
// 	const showData = allData.slice(start, end)

// 	const titleFontSize = 460 / 100 * 3.6
// 	const innerRadius = titleFontSize * 2.8
// 	const outterRadius = innerRadius * 1.125

// 	return showData.map((item, index) => {
// 		return {
// 			type: 'pie',
// 			center: centerArr[index],
// 			radius: [outterRadius, innerRadius],
// 			emphasis: {
// 				scale: false
// 			},
// 			labelLine: {
// 				show: false // 隐藏指示线
// 			},
// 			data: [
// 				{
// 					name: item.name + '\n\n' + item.sales,
// 					value: item.sales,
// 					itemStyle: {
// 						color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
// 							{
// 								offset: 0,
// 								color: colorArr[index][0]
// 							},
// 							{
// 								offset: 1,
// 								color: colorArr[index][1]
// 							}
// 						])
// 					},
// 					label: {
// 						position: 'center',
// 						color: colorArr[index][0],
// 						fontSize: titleFontSize / 2
// 					}
// 				},
// 				{
// 					value: item.stock,
// 					itemStyle: {
// 						color: '#333843'
// 					}
// 				}
// 			]
// 		}
// 	})
// }
</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;
}
</style>
