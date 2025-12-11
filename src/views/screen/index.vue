<template>
	<div :class="['es-screen-container', store.theme]">
		<div ref="screenRef" class="es-screen">
			<Header />

			<div class="es-screen-main">
				<div class="es-screen-left">
					<aArea />
				</div>
				<div class="es-screen-left">
					<bArea />
					 <!-- 马克1 -->
				</div>
				<div class="es-screen-center">
					<Center />
				</div>
				<div class="es-screen-right">
					<dArea />
				</div>
				<div class="es-screen-right">
					<!-- 马克2 -->
					<eArea />
				</div>
			</div>
		</div>
	</div>

</template>

<script setup lang='ts'>
import Header from './components/Header.vue'
import { useResize } from '@/utils/useResize'
import aArea from './components/aArea/index.vue'
import bArea from './components/bArea/index.vue'
import Center from './components/center/index.vue'
import dArea from './components/dArea/index.vue'
import eArea from './components/eArea/index.vue'
import { useScreenStore } from '@/store'

const store = useScreenStore()
const { screenRef } = useResize()

</script>
<style lang='scss' scoped>

.es-screen-container {
	--es-screen-width: 1920px;
  	--es-screen-height: 1080px;
	--es-header-height: 72px;
	--es-block-bg: #112240;
	--es-screen-bg: rgb(0, 80, 192, 0.2);
	--es-screen-text-color: #fff;
	--es-block-border: 1px solid #23a5d1;
	--es-card-bg: #0d1e38;
	--es-plan-bg: rgb(22, 21, 34);
	--es-plan-color: #262527;
	--es-ground-img: url('@/assets/images/screen/background.png');
	--es-header-img: url('@/assets/images/screen/background_top.png');
	background-image: var(--es-ground-img);
	position: relative;
	margin: 0;
	width: 100%;
	height: 100%;
	background-size: 100% 115%;
	overflow: hidden;
	color: var(--es-screen-text-color);
}
.es-screen {
  position: absolute;
  user-select: none;
  top: 50%;
  left: 50%;
  width: var(--es-screen-width);
  height: var(--es-screen-height);
  margin-left: calc(var(--es-screen-width) * 0.5 - var(--es-screen-width));
  margin-top: calc(var(--es-screen-height) * 0.5 - var(--es-screen-height));
  background-size: 100% 100%;
//   padding: 0 20px;
	&-main {
		position: relative;
		display: flex;
		height: calc(100% - var(--es-header-height));
		background: var(--es-screen-bg);
	}
	&-center {
		flex: 1;
		width: calc(var(--es-screen-width) - 1000px);
	}
	&-left, &-right {
		width: 320px;
		padding: 5px 5px 50px 5px;
	}
}
.light {
	--es-screen-bg: rgb(238, 238, 238);
	--es-block-bg: #fff;
	--es-screen-text-color: rgb(22, 21, 34);
	--es-card-bg: rgb(238, 238, 238);
	--es-plan-color: #fff;
	--es-ground-img: #fff;
	--es-header-img: url('@/assets/images/screen/header_border_dark.png');
	--es-plan-bg: rgb(238, 238, 238);
}
</style>
