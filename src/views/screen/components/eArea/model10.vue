<template>
	<div class="es-block">
		<Title>系统告警</Title>
		<div class="es-list">
		<div class="flex item-card">
			<div class="item-title" v-for="item in titles" :key="item.name">
				<div class="item-name" :style="{width: item.width}">
					<span>{{ item.name }}</span>
				</div>
			</div>
		</div>
		<div class="item-content" ref="tableBody">
			<div class="item-title" v-for="item in currentGroup" :key="item.stationName">
				<div class="box item-type" v-if="item.alarmStatus === '0'">
					<span>{{ item.alarmText }}{{ item.alarmStatusText}}</span>
					<!-- <span class="success"></span> -->
				</div>
				<div class="box item-type" v-else>
					<span>{{ item.alarmText }}</span>
					<!-- <span class="circle"></span> -->
				</div>
				<div class="box item-name">
					<span>{{ item.stationName }}</span>
				</div>
				<div class="box item-setting">
					<span>{{ item.deviceName }}</span>
				</div>
				<div class="box item-time">
					<span>{{ formatDate(item.startTime) }}</span>
				</div>
			</div>
		</div>
	</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import Title from '../Title.vue'
import alarmRequire from '@/assets/data/alarm.json'
import { useDataStore } from '@/store/dataStore'

interface AlarmItem {
	alarmText: string;
	deviceName?: string;
	startTime?: string;
	stationName?: string;
}
const titles = ref([
	{"name": "告警内容", "width": "4.8rem"},
	{"name": "电站名称", "width": "4rem"},
	{"name": "设备名称", "width": "4rem"},
	{"name": "时间", "width": ""}
]);
const {
	alarmLevels,
	alarmTypes,
	beginDate,
	endDate,
	alarmStatus,
	page,
	size
} = alarmRequire;
const dataStore = useDataStore();
const tableBody = ref<HTMLElement | null>(null);
let timer: any;
let list = [] as any;
list = computed(() => dataStore.ssgj?.data?.content);
	// console.log('ssgj->', dataStore.ssgj);
	// return ;
const BLINK_INTERVAL = 15000;
const currentGroupIndex = ref(0);
const totalGroups = computed(() => Math.ceil(list.value.length / 11))

const currentGroup = computed(() => {
  const startIndex = currentGroupIndex.value * 11
  const endIndex = startIndex + 11
  return list.value.slice(startIndex, endIndex)
})

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

const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp))
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const formatCustomDate = (timestamp, format = 'YYYY-MM-DD') => {
  const date = new Date(parseInt(timestamp))
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
//   return format
//     .replace('YYYY', year)
//     .replace('MM', month)
//     .replace('DD', day)
//     .replace('HH', hours)
//     .replace('mm', minutes)
//     .replace('ss', seconds)
}

// 组件挂载时获取数据
onMounted(() => {
  try {
	/**
	 * alarmLevels: 01
	   alarmTypes: 01,02,03,04,09,06,05,07,08,10
	   beginDate: 2025-10-01 00:00:00
       endDate: 2025-10-31 23:59:59
	   alarmStatus: 1
       page: 0
       size: 50
	 */
    dataStore.fetchSsgjData({
        alarmLevels,
        alarmTypes,
		beginDate,
		endDate,
        // beginDate: new Date().getMonth() + '-01 00:00:00',
        // endDate: new Date().getMonth() + '-30 23:59:59',
        alarmStatus,
        page,
        size,
	});
  } catch (error) {
    console.error('Failed to fetchStationCount data:', error);
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

// const list = computed<AlarmItem[]>(() => {
// 	console.log('ssgj->', dataStore.ssgj);
// 	return dataStore.ssgj?.data?.content || [];
// });
</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;

	.es-list{
		overflow: hidden;
		.item-card {
			background-color: var(--es-card-bg);
			border-bottom: 1px solid var(--es-screen-text-color);
			font-size: 12px;
			display: flex;


			.item-title {
				margin: 1rem 0rem 0.5rem 0;
			}
		}
		.item-content {
			font-size: 12px;

			.item-title {
				display: flex;		
				.box {
					margin: 1rem 0.3rem 0.5rem 0;
				}
				.circle{
					width: 10px;
					height: 10px;
					border-radius: 50%;
					background-color: #ef4444;
					display: inline-block;
					margin-left: 2px;
				}
				.success{
					background-color: #10b981;
					width: 10px;
					height: 10px;
					border-radius: 50%;
					display: inline-block;
					margin-left: 2px;
				}
				.item-type {
					width: 5rem;
				}
				.item-name {
					width: 4rem;
				}
				.item-setting {
					width: 4rem;
				}
				.item-time {
					// white-space: nowrap;
					margin-right: 0;
				}
			}
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
