<template>
	<div class="es-block">
		<Title>电站分布</Title>
    	<div style="width: 100%;height: 100%;">
			<Chart :option="option" />
		</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, onMounted, computed } from 'vue'
import Title from '../Title.vue'
import Chart from '@/components/chart/Chart.vue'
import allData from '@/assets/data/map.json'
import chinaJson from '@/assets/data/china.json'
import * as echarts from 'echarts'
import { useDataStore } from '@/store/dataStore';

const dataStore = useDataStore();
echarts.registerMap('china', chinaJson as any)

const chartOption = computed(() => {
	if (!dataStore.stationMap) return {}
	return {
		geo: {
			type: 'map',
			map: 'china',
			width: '89%',
			top: '8%',
			bottom: '20%',
			itemStyle: {
				areaColor: '#2E72BF',
				borderColor: '#333'
			}
		},
		legend: {
			left: '0%',
			bottom: '10%',
			orient: 'vertical',
			data: dataStore.stationMap.map(item => item.name),
			textStyle: {
				color: '#112240'
			}
		},
		series: dataStore.stationMap.map(item => {
			// return的这个对象就代表的是一个类别下的所有散点数据
			// 如果想在地图中显示散点的数据, 我们需要给散点的图表增加一个配置, coordinateSystem:geo
			return {
				type: 'effectScatter',
				rippleEffect: {
					scale: 5,
					brushType: 'stroke'
				},
				name: item.name,
				data: item.children,
				coordinateSystem: 'geo'
			}
		})
	}
})


// 组件挂载时获取数据
onMounted(() => {
  // dataType=day&date=2025-09-16
  try {
    dataStore.fetchStationMap({});
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});

const option = ref(chartOption)
</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;
	padding: 10px 0;
	margin-top: 60px;
}
.es-screen-title{
	color: #112240;
}
.es-screen-title::before{
	background-color: #112240;
}
</style>
