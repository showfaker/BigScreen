<template>
	<div class="es-block">
		<Title>发电统计</Title>
		<div class="loading" v-if="loading">
			<img src="@/assets/images/screen/loading.gif" alt="">
		</div>
		<div v-else>
			<div class="item-card" v-for="data in list" :key="data.name">
				<div class="flex item-title">
					<div class="item-name">
						<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 640 640">
							<path fill="#05b2c6" :d="data.svg"/>
						</svg>
						<span style="margin-left: 5px;">{{ data.name }}</span>
					</div>
					<div v-if="store.system === 'first'">{{ (data.value*1.8).toFixed(2) }}{{ data.unit }}</div>
					<div v-else>{{ (data.value).toFixed(2) }}{{ data.unit }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Title from '../Title.vue'
import { useDataStore } from '@/store/dataStore'
import energyJson from '@/assets/data/energy.json';
import { useIntervalFn } from '@vueuse/core'
import { useScreenStore } from '@/store';

const loading = ref(false);
const dataStore = useDataStore();
const store = useScreenStore();

const fetchData = async () => {
  try {
    loading.value = true
    await dataStore.fetchFdtjData({});
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
	setTimeout(() => {
		loading.value = false
	}, 1000)
  }
}

// 使用 VueUse 的定时器函数
const { pause, resume } = useIntervalFn(
  fetchData,
  1 * 20 * 1000,
  { immediate: true, immediateCallback: true }
)

// 组件挂载时获取数据
onMounted(() => {
	resume() // 开始定时器
});

const createPlanItem = (name: string, data: number, svgurl: string) => ({
  name,
  value: data || 0,
  unit: "万kWh",
  svg: svgurl,
});

const chartOption = computed(() => {
  if (!dataStore.fdtj?.data) return [];
  
  const data = dataStore.fdtj.data;
  const daySVG = energyJson[0][0].svg;
  const monthSVG = energyJson[0][1].svg;
  const yearSVG = energyJson[0][2].svg;
  const totalSVG = energyJson[0][3].svg;

  return [
    createPlanItem('昨日发电', data.day, daySVG),
    createPlanItem('当月发电', data.month, monthSVG),
    createPlanItem('当年发电', data.year, yearSVG),
    createPlanItem('累计发电', data.all, totalSVG)
  ];
});

const list = computed(() => chartOption.value);

onUnmounted(() => {
	pause() // 停止定时器
	loading.value = false;
})

// const list = ref(energyData[0])
// const currentIndex = ref(0)
// const option = ref({
// 	series: getSeries()
// })
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
	.loading{
		text-align: center;
		padding: 25% 0;

		img{
			width: 32px;
			height: 32px;
		}
	}
	.item-card{
		padding: 0 5px;
		height: 24px;
		line-height: 24px;
		.item-title{
			justify-content: space-between;
			align-items: center;
			margin: 2rem 0 0.5rem 0;
			.item-name{
				justify-self: center;
				align-items: center;
			}
		}
		.flex {
			display: flex;
			justify-content: space-between;
		}
	}
}
</style>
