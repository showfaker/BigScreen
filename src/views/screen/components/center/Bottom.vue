<template>
<div class="card-list" style="display: flex;">
	<div class="card-gradient" v-for="item in list" :key="item.title">
      <div class="flex justify-between items-start mb-4">
       <div class="text-light-2 text-sm">
        <!-- <p> -->
         {{ item.title }}
        <!-- </p> -->
       </div>
       <div class="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center" @click="handleChangeTheme(item)">
        <!-- !Font Awesome Free 7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 640 640">
          <path :fill="item.color" :d="item.icon"/>
        </svg>
        <!-- <i class="fas fa-power-off text-primary text-xl">
        </i> -->
       </div>
      </div>
      <h3 class="text-[clamp(1.8rem,4vw,2.5rem)] font-bold mt-1">
         {{ item.value }}{{ item.unit }}
        </h3>
      <div class="flex items-center space-x-2">
       <span class="text-success flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" height="10" width="10" viewBox="0 0 640 640">
          <path :fill="item.arrowColor" :d="item.arrow"/>
        </svg>
        {{ item.percent }}
       </span>
       <span class="text-light-2 text-sm">
        {{ item.growth }}
       </span>
      </div>
	</div>
</div>
</template>

<script setup lang='ts'>
import { ref, onMounted, computed } from 'vue'
import 'odometer/themes/odometer-theme-default.css'
import { KnifeFork, IceTea, Coffee, IceCream, Dessert, GobletFull } from '@element-plus/icons-vue'
import { useScreenStore } from '@/store'
import allData from '@/assets/data/station.json'
// import SeamlessScroll from '@/components/SeamlessScroll.vue'
import { useDataStore } from '@/store/dataStore'

const dataStore = useDataStore();
// 组件挂载时获取数据
onMounted(() => {
  try {
    dataStore.fetchStationData({});
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
  actions.value.forEach(item => {
    item.value = Math.floor(Math.random() * 999) + 1
  })
});

const createPlanItem = (data: any, station: any, title?: string) => ({
  title: title || station.title || '',
  value: data.value || station.value || 0,
  unit: data.unit || '',
  percent: station.percent || 0,
  growth: station.growth || 0,
  color: station.color || '',
  icon: station.icon || '',
  arrowColor: station.arrowColor || '',
  arrow: station.arrow || ''
})

const chartOption = computed(() => {
  if (!dataStore.stationData?.data) return [];
  
  const data = removeSpacesFromData(dataStore.stationData.data);
  console.log("station->data", data);
  if (store.system === 'first') {
    data.number.value = 30;
    data.capacity.value = 3.35;
    data.hybirdCapacity.value = 120;
    data.co2.value = (data.co2.value * 1.8).toFixed(2);
    data.pvCapacity.value = 2.70;
    data.wpCapacity.value = 650;
    data.pvNumber.value = 23;
    allData[7].value = "8.21亿元";
  } else {
    allData[7].value = "4.56亿元";
  }
  return [
    createPlanItem(data.number, allData[0]),
    createPlanItem(data.capacity, allData[1]),
    createPlanItem(data.hybirdCapacity, allData[2]),
    createPlanItem(data.co2, allData[3]),
    createPlanItem(data.pvCapacity, allData[4], '光伏'+data.pvNumber.value+data.pvNumber.unit),
    createPlanItem(data.wpCapacity, allData[5], '风机'+data.wpNumber.value+data.wpNumber.unit),
    createPlanItem({value: data.days, unit: '天'}, allData[6]),
    createPlanItem({}, allData[7])
  ];
});

const list = computed(() => chartOption.value);


// const list = ref()
const iconObj = {KnifeFork, IceTea, Coffee, IceCream, Dessert, GobletFull}
const actions = ref([
  { color: 'rgb(24, 144, 255)', icon: 'KnifeFork', value: 0 },
  { color: 'rgb(255, 192, 105)', icon: 'IceTea', value: 0 },
  { color: 'rgb(92, 219, 211)', icon: 'Coffee', value: 0 },
  { color: 'rgb(179, 127, 235)', icon: 'IceCream', value: 0 },
  { color: 'rgb(255, 133, 192)', icon: 'Dessert', value: 0 },
  { color: 'rgb(255, 214, 102)', icon: 'GobletFull', value: 0 },
  { color: 'rgb(24, 144, 255)', icon: 'KnifeFork', value: 0 },
  { color: 'rgb(255, 192, 105)', icon: 'IceTea', value: 0 },
  { color: 'rgb(92, 219, 211)', icon: 'Coffee', value: 0 },
  { color: 'rgb(179, 127, 235)', icon: 'IceCream', value: 0 },
  { color: 'rgb(255, 133, 192)', icon: 'Dessert', value: 0 },
])
const store = useScreenStore()

function handleChangeTheme(data: any) {
  if (data.title === '运维资产总数') {
    store.$patch({
      // theme: store.theme === 'dark' ? 'light' : 'dark'
      system: store.system === 'first' ? 'second' : 'first',
    })
  }
}

// removeSpacesFromData
function removeSpacesFromData(data) {
  if (Array.isArray(data)) {
    return data.map(item => removeSpacesFromData(item));
  } else if (data && typeof data === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = removeSpacesFromData(value);
    }
    return result;
  } else if (typeof data === 'string') {
    // 去除所有空格
    return data.replace(/\s/g, '');
    // 或者只去除首尾空格：return data.trim();
  }
  return data;
}
</script>

<style lang='scss' scoped>
*, ::after, ::before {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb;
}
.fa-classic, .fa-regular, .fa-solid, .far, .fas {
    font-family: "Font Awesome 6 Free";
}
.card-list{
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 8px;
	margin: 5px 10px;
  animation-name: slide;

	.card-gradient {
		width: calc(25% - 20px);
		padding: 20px 5px;
		border-radius: 5px;
		// background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		background-color: var(--es-block-bg);
    border: var(--es-block-border);

    .justify-between {
      justify-content: space-between;
    }
    .items-start {
      align-items: flex-start;
    }
    .flex {
      display: flex;
    }
    .mb-4 {
      // margin-bottom: 1rem;
    }
    .text-primary {
      --tw-text-opacity: 1;
      color: rgb(22 93 255 / var(--tw-text-opacity, 1));
    }
    .text-xl {
      font-size: 13px;
      line-height: 13px;
    }
    .fa-solid, .fas {
      font-weight: 900;
    }
    .font-bold{
      margin: 15px 0;
      font-weight: 600;
      font-size: 19px;
      line-height: 19px;
      text-align: center;
    }
    .text-success{
      font-size: 13px;
      line-height: 20px;
      color: #00ea29;
      margin-right: 5px;
    }
    .text-sm {
      font-size: 13px;
      line-height: 20px;
    }
    .rounded-lg{
      cursor: pointer;
    }
    .space-x-2{
      margin-top: 20px;
    }
	}
}

.es-center-bottom {
	position: relative;
	width: 100%;
	overflow: hidden;
	height: 150px;

	.es-bottom-item {
		position: absolute;
		top: 0;
		left: 0;
		width: 170px;
		height: 150px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 22px;
    	font-weight: 600;
		background-color: var(--es-block-bg);

		.es-item-text {
      		margin-top: 16px;
    	}
	}
}
@keyframes slide {
  0% {
    transform: translateX(100%);
  }
  80% {
    transform: translateX(-50px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
