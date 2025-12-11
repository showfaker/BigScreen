<template>
	<div class="es-block">
		<Title>发电排名</Title>
		<!-- <ScrollRefresh 
		:list="dataList" 
		:interval="10000" 
		:chunk-size="4"
		@chunk-change="handleChunkChange"
		>
			<template #default="{ item }">
				<div class="custom-item">
				<h3>{{ item.name }}</h3>
				<p>发电量 {{ item?.energy }}</p>
				<small>{{ item?.kwhkwp }}</small>
				</div>
			</template>
    	</ScrollRefresh> -->
		<div ref="tableBody" style="height: 260px;overflow: hidden;">
		<div class="item-card" v-for="item in currentGroup" :key="item?.rank">
			<div class="flex item-title">
				<div class="item-name">
					<div>
						<span>{{ item?.rank }}</span>
						<span style="margin-left: 5px;">{{ item?.name }}</span>
					</div>
					<div class="size-four">等效时数: 
						<span class="color-white">{{ item?.kwhkwp }}</span>
					</div>
				</div>

				<div>
					<div>发电量: {{ item?.energy }}</div>
					<div class="size-four self-right">完成率: 
						<span class="color-white">{{ item?.rate }}%</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import Title from '../Title.vue'
import { useDataStore } from '@/store/dataStore'
// import ScrollRefresh from './scrollRefresh.vue'
import allData from '../../../../assets/data/fdpm.json'

const dataStore = useDataStore()
const tableBody = ref<HTMLElement | null>(null);
let timer: any;
const BLINK_INTERVAL = 7000;
let dataList = [] as any;
dataList = computed(() => dataStore.fdpm.data || allData)
const currentGroupIndex = ref(0);
// 计算属性
// const totalGroups = computed(() => Math.ceil(dataList.value.length / 4))
const totalGroups = computed(() => Math.ceil(dataList.value.length / 4 - 1))


const currentGroup = computed(() => {
  const startIndex = currentGroupIndex.value * 4
  const endIndex = startIndex + 4
  return dataList.value.slice(startIndex, endIndex)
})

// 下一组
const nextGroup = () => {
	setTimeout(() => {
		if (currentGroupIndex.value < totalGroups.value - 1) {
			currentGroupIndex.value++
		} else {
			// 循环到第一组
			currentGroupIndex.value = 0
		}
	}, 1500);
}

// 组件挂载时获取数据
onMounted(() => {
  // 更新数据逻辑
  try {
    dataStore.fetchFdpmData({dataType: "month"});
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
  startBlinking();
});

// 在组件卸载时清理定时器
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

function startBlinking() {
  timer = window.setInterval(() => {
    if (tableBody.value) {
      tableBody.value.classList.remove('blink-effect');
      void tableBody.value.offsetWidth;
      tableBody.value.classList.add('blink-effect');
    }
	nextGroup();
  }, BLINK_INTERVAL);
}
</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;

	.item-card{
		padding: 0 5px;
		background-color: var(--es-card-bg);

		.item-title{
			justify-content: space-between;
			align-items: center;
			margin: 1rem 0 0.5rem 0;
		
			.item-name{
				justify-self: center;
				align-items: center;
			}
		}
		.flex {
			display: flex;
			justify-content: space-between;
		}
		.size-four{
			font-size: small;
			color: #8b93a1;
		}
		.color-white{
			color: var(--es-screen-text-color);
		}
		.self-right{
			justify-self: right;
		}
	}
}

@keyframes blink-animation {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

.blink-effect {
	animation: blink-animation 3s ease-in-out;
}
</style>
