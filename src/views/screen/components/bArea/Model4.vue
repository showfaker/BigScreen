<template>
	<div class="es-block">
		<Title>设备统计</Title>
    	<div style="width: 100%;height: 90%;">
			<Chart :option="option" />
		</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, onMounted, computed } from 'vue'
import Title from '../Title.vue'
import Chart from '@/components/chart/Chart.vue'
import { useDataStore } from '@/store/dataStore';
import { useScreenStore } from '@/store'
import { height, width } from '@/utils/useResize';

const dataStore = useDataStore()
const store = useScreenStore()
let listName: string[] = [];
let listData: Array<{value: number, name: string}> = [];
// const colorArr = [
// 	['#0BA82C', '#4FF778'],
// 	['#2E72BF', '#23E5E5'],
// 	['#5052EE', '#AB6EE5']
// ]
// const startValue = ref(0)
// const endValue = ref(9)
// const barWidth = 20

// 组件挂载时获取数据
onMounted(() => {
  // dataType=day&date=2025-09-16
  try {
    // const today = new Date().toISOString().split('T')[0];
    dataStore.fetchSbtjData({ type: '01' });
    dataStore.fetchSbtjData({ type: '02' });
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});

const addItemIfValid = (num: number | undefined, name: string) => {
  if (num && num > 0) {
    listName.push(name);
    if (store.system === 'first') {
      listData.push({ value: num*2, name });
    } else {
      listData.push({ value: num, name });
    }
  }
};

const chartOption = computed(() => {
  if (!dataStore.sbtj.sun && !dataStore.sbtj.wind) return {};
  listData = [];
  listName = [];
  const color = computed(() => store.theme === 'dark' ? "#fff" : "#000");
  addItemIfValid(dataStore.sbtj.sun.data?.onlineNum, '光伏在线');
  addItemIfValid(dataStore.sbtj.sun.data?.offlineNum, '光伏离线');
  addItemIfValid(dataStore.sbtj.sun.data?.malfunctionNum, '光伏故障');
  addItemIfValid(dataStore.sbtj.sun.data?.standbyNum, '光伏停机');
  addItemIfValid(dataStore.sbtj.wind.data?.onlineNum, '风电在线');
  addItemIfValid(dataStore.sbtj.wind.data?.offlineNum, '风电离线');
  addItemIfValid(dataStore.sbtj.wind.data?.malfunctionNum, '风电故障');
  addItemIfValid(dataStore.sbtj.wind.data?.standbyNum, '风电停机');
  // console.log(listName);
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: 'bottom',
      left: 'center',
      textStyle: {
        color: color.value,
      },
      data: listName
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '60%'], // 减小半径
        center: ['50%', '40%'], // 调整中心位置
        avoidLabelOverlap: true,
        z: 1, // 设置饼图的层级
        label: {
          show: true,
          color: color.value,
          alignTo: 'edge',
          formatter: '{name|{b}}\n{time|{c}}',
          minMargin: 5,
          edgeDistance: 0,
          lineHeight: 15,
          position: 'outer', // 设置为外部标签
          rich: {
            time: {
              fontSize: 12,
            }
          }
        },
        labelLayout: {
          // 通过 dy 调整垂直位置，正值向下移动
          dy: 5, // 向下移动20像素
          // 或者使用函数动态调整
          moveOverlap: 'shiftY', // 重叠时在Y轴方向移动
        },
        labelLine: {
          show: true,
          smooth: 0,
          length: 10,   // 第一段引导线长度
          length2: 30,  // 增加第二段引导线长度，让标签更靠外
          showAbove: true,
          z: 100, // 设置引导线的层级更高
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        data: listData
      }
    ]
  }
});
const option = ref(chartOption)
</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;
}
</style>
