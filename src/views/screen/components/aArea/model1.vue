<template>
	<div class="es-block">
		<Title>生产进度</Title>
		<div class="loading" v-if="loading">
			<img src="@/assets/images/screen/loading.gif" alt="">
		</div>
		<div v-else>
			<div class="item-card" v-for="data in list" :key="data.name">
				<div class="flex item-title">
					<div>{{ data.name }}</div>
					<div>{{ data.rate }}</div>
				</div>
				<div class="flex items-center">
					<div class="w-24 bg-bg-dark-3 rounded-full h-2.5 mr-2">
						<div class="h-2.5 rounded-full bg-success" :style="{width: data.rate}"></div>
					</div>
				</div>
				<div class="flex">
					<div style="width: 20px;"></div>
					<div v-if="store.system === 'first'">{{ (data.energy*1.8).toFixed(2) }}/{{ (data.planEnergy*1.8).toFixed(2) }}{{ data.energyUnit }}</div>
					<div v-else>{{ (data.energy).toFixed(2) }}/{{ (data.planEnergy).toFixed(2) }}{{ data.energyUnit }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import Title from '../Title.vue'
// import allData from '@/assets/data/seller.json'
// import productData from '@/assets/data/product.json'
// import * as echarts from 'echarts'
import { useDataStore } from '@/store/dataStore'
import { useIntervalFn } from '@vueuse/core'
import { useScreenStore } from '@/store';

const loading = ref(false);
const dataStore = useDataStore();

const fetchData = async () => {
  try {
    loading.value = true
    await dataStore.fetchScjdData({})
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
  1 * 35 * 1000,
  { immediate: true, immediateCallback: true }
)

// 组件挂载时获取数据
onMounted(() => {
	resume() // 开始定时器
});

const createPlanItem = (name: string, data: any) => ({
  name,
  rate: data?.rate || '0%',
  energy: data?.energy || 0,
  planEnergy: data?.planEnergy || 0,
  energyUnit: data?.energyUnit || ''
});

const chartOption = computed(() => {
  if (!dataStore.scjd?.data) return [];
  
  const data = dataStore.scjd.data;
//   console.log("energy: ", data);
  return [
    createPlanItem('月度计划', data.month),
    createPlanItem('季度计划', data.quarter),
    createPlanItem('年度计划', data.year)
  ];
});

const store = useScreenStore();

// 监听system状态变化
watch(() => store.system, (newSystem, oldSystem) => {
//   console.log(`system changed from ${oldSystem} to ${newSystem}`);
//   if (store.system === 'first') {
// 	data.month.energy = data.month.energy * 1.8;
// 	data.month.planEnergy = data.month.planEnergy * 1.8;
// 	data.quarter.energy = data.quarter.energy * 1.8;
// 	data.quarter.planEnergy = data.quarter.planEnergy * 1.8;
// 	data.year.energy = data.year.energy * 1.8;
// 	data.year.planEnergy = data.year.planEnergy * 1.8;
//   }
}, { immediate: true });

const list = computed(() => chartOption.value );

onUnmounted(() => {
	pause() // 停止定时器
	loading.value = false;
})
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
		.item-title{
			justify-content: space-between;
			margin: 1rem 0 0.5rem 0;
		}
		.items-center {
			align-items: center;
		}
		.flex {
			display: flex;
			justify-content: space-between;
		}
		.bg-bg-dark-3 {
			--tw-bg-opacity: 1;
			background-color: rgb(51 65 85 / var(--tw-bg-opacity, 1));
		}
		.rounded-full {
			border-radius: 9999px;
		}
		.w-24 {
			width: 300px;
		}
		.h-2\.5 {
			height: 0.625rem;
		}
		.mr-2 {
			margin-right: 0.5rem;
		}
		.bg-success {
			--tw-bg-opacity: 1;
			background-color: rgb(0 235 252 / var(--tw-bg-opacity, 1));
		}
	}
}
</style>
