<template>
	<div class="es-block">
		<Title>物料统计</Title>
    	<div style="width: 100%;height: 90%;margin-top: 10px;">
			<Chart :option="option" />
		</div>
		
	</div>
</template>

<script setup lang='ts'>
import { ref, onMounted, computed } from 'vue'
import Title from '../Title.vue'
import Chart from '@/components/chart/Chart.vue'
import { useDataStore } from '@/store/dataStore';
import { useScreenStore } from '@/store';
import { height, width } from '@/utils/useResize';

const dataStore = useDataStore()
const store = useScreenStore()
// 组件挂载时获取数据
onMounted(() => {
  try {
    dataStore.fetchMaterialCount({});
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});

const chartOption = computed(() => {
  if (!dataStore.materialCount) return {};
  const data = dataStore.materialCount;
  const color = computed(() => store.theme === 'dark' ? "#fff" : "#000");
  let bpbj = data['01'];
  let gqj = data['02'];
  let fszw = data['03'];
  if (store.system === 'first') {
    bpbj*=2; gqj*=2; fszw*=2;
  }

  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      // top: 'bottom',
      left: 'center',
      bottom: 25,
      textStyle: {
        color: color.value,
      },
      data: ['备品备件', '非生产物资', '工器具']
    },
    series: [
      {
        type: 'pie',
        // width: '86%',
        // height: '100%',
        radius: ['60%', '0%'], // 减小半径
        center: ['50%', '40%'], // 调整中心位置
        label: {
          show: true,
          color: color.value,
          alignTo: 'edge',
          formatter: '{name|{b}}\n{time|{c}}',
          minMargin: 15,
          edgeDistance: 0,
          lineHeight: 15,
          rich: {
            time: {
              fontSize: 12,
            }
          },
          position: 'outside',
        },
        labelLine: {
          show: true,
          showAbove: true,
          length: 10,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        data: [
          { value: bpbj, name: '备品备件' },
          { value: fszw, name: '非生产物资' },
          { value: gqj, name: '工器具' }
        ]
      }
    ]
  }
})

const option = ref(chartOption)
  // 	"status": 0,
  // 	"data": {
  // 		"01": 477,
  // 		"02": 222,
  // 		"03": 83
  // 	}
  // }
  // 物料类型: 01-备品备件 02-工器具 03-非生产物资
</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;
  // margin-top: 2rem;
}
</style>
