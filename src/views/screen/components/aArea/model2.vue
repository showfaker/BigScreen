<template>
	<div class="es-block">
		<Title>近期工作计划</Title>
		<div class="scroll-container">
		<div class="list"
		ref="scrollContent"
		:style="{ transform: `translateY(${-scrollPosition}px)` }"
		>
			<div class="item-card" v-for="data in list" :key="data.name" :style="{'border-left': '3px solid'+ data.style}">
			<div class="flex item-title">
				<div class="item-name">
					{{ data.name }}
				</div>
				<div class="item-status" :style="{ color: data.style }">{{ data.status }}</div>
			</div>
			<div class="item-time">{{ data.time }}</div>
			<!-- <div class="flex item-progress">
				<div>进度：{{ data.progress }}%</div>
				<div class="w-24 bg-bg-dark-3 rounded-full h-2.5 mr-2">
					<div class="h-2.5 rounded-full bg-success" :style="{width: data.progress+'%', background: data.style}"></div>
				</div>
			</div> -->
			</div>
		</div>
	</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted } from 'vue'
import Title from '../Title.vue'
import Chart from '@/components/chart/Chart.vue'
import allData from '@/assets/data/plan.json'
import * as echarts from 'echarts'

const list = ref(allData);
const scrollContent = ref<HTMLElement | null>(null)
const scrollPosition = ref(0)
const maxScroll = ref(0)
let lastTime = 0
let animationFrameId: number | null = null

// 计算最大滚动距离
const calculateMaxScroll = () => {
  if (scrollContent.value) {
    const container = scrollContent.value.parentElement
    const contentHeight = scrollContent.value.scrollHeight
    const containerHeight = container?.clientHeight || 0
    maxScroll.value = Math.max(0, contentHeight - containerHeight)
  }
}

// 滚动动画
const scrollAnimation = (timestamp) => {
  if (!lastTime) lastTime = timestamp
  const deltaTime = timestamp - lastTime
  
  // 每秒滚动10px，计算当前帧应该滚动的距离
  if (deltaTime > 0) {
    const scrollPerSecond = 20 // 10px/秒
    const scrollThisFrame = (scrollPerSecond * deltaTime) / 1000
    
    scrollPosition.value += scrollThisFrame
    
    // 循环滚动
    if (scrollPosition.value >= maxScroll.value) {
      scrollPosition.value = 0
    }
    
    lastTime = timestamp
  }
  
//   if (isScrolling.value) {
	animationFrameId = requestAnimationFrame(scrollAnimation)
//   }
}

// 开始滚动
const startScroll = () => {
//   if (!isScrolling.value) {
    // isScrolling.value = true
    lastTime = 0
    animationFrameId = requestAnimationFrame(scrollAnimation)
//   }
}

// 暂停滚动
const pauseScroll = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

// 重置滚动位置
const resetScroll = () => {
  scrollPosition.value = 0
}

onMounted(() => {
	calculateMaxScroll()
	startScroll()
	// 监听窗口大小变化，重新计算最大滚动距离
  	window.addEventListener('resize', calculateMaxScroll)
})

onUnmounted(() => {
  pauseScroll()
  window.removeEventListener('resize', calculateMaxScroll)
})
// const colorArr = [
// 	['#0BA82C', '#4FF778'],
// 	['#2E72BF', '#23E5E5'],
// 	['#5052EE', '#AB6EE5']
// ]
</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;
	// 0ea5e9
	// 6b7280
	.scroll-container {
		height: 650px;
		overflow: hidden;
		// border: 1px solid #e0e0e0;
		// border-radius: 8px;
		position: relative;
		margin-top: 10px;
	}
	.list {
		transition: transform 0.1s linear;
		// max-height: 590px;
		// overflow: auto;
		/* 隐藏滚动条但保留功能 */
		// scrollbar-width: none; /* Firefox */
  		// -ms-overflow-style: none; /* IE and Edge */

		.item-card {
			padding: 5px;
			font-size: 12px;
			background: var(--es-plan-bg);
			border-radius: 8px;
			margin: 1.5rem 0 0.5rem 0;

			.item-title{
				align-items: center;
				margin: 0.5rem 0;

				.item-name{
					justify-self: center;
					align-items: center;
					font-size: 15px;
					line-height: 25px;
					max-width: 180px;
				}
			}
			.item-time{
				color: #7a818f;
				margin: 5px 0;
			}
			.item-status{
				color: #f59e0b;	//change
				background: var(--es-plan-color);
				padding: 5px 10px;
				border-radius: 40%;
			}
			.item-progress {
				color: #424a5a;
				margin-bottom: 10px;

				.bg-bg-dark-3 {
					--tw-bg-opacity: 1;
					background-color: rgb(51 65 85 / var(--tw-bg-opacity, 1));
				}
				.rounded-full {
					border-radius: 9999px;
				}
				.w-24 {
					width: 100px;
				}
				.h-2\.5 {
					height: 0.625rem;
				}
				.mr-2 {
					margin-right: 0.5rem;
				}
			}
			.flex {
				display: flex;
				justify-content: space-between;
			}
		}
	}
	.list::-webkit-scrollbar {
		width: 0;
		height: 0;
		background: transparent; /* Chrome/Safari/Webkit */
	}
}
</style>
