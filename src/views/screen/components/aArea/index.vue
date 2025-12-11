<template>
	<div ref="containerRef">
		<component
			v-for="item in components"
			:key="item.name"
			:is="item.component"
			class="es-screen-right-item"
			:id="item.name"
		>
			{{ item.name }}
		</component>
	</div>
</template>

<script setup lang='ts'>
import { shallowRef } from 'vue'
import { useSortable } from '@/utils/useSortable'
import Right1 from './model1.vue'
import Right2 from './model2.vue'
import Right3 from './Right3.vue'
const components = shallowRef([
	{ name: 'left1', component: Right1 },
	{ name: 'left2', component: Right2 },
	// { name: 'right3', component: Right3 }
])

const { containerRef } = useSortable(components)
</script>

<style lang='scss' scoped>
.es-screen-right-item {
	width: 100%;
	height: 278px;
	background-color: var(--es-block-bg);
	border: var(--es-block-border);
	border-radius: 5px;
	padding: 10px;
	animation-name: slide;
	// background: url('@/assets/images/screen/window.png') no-repeat;

	&:nth-child(1) {
		animation-duration: 0.5s;
	}
	&:nth-child(2) {
		animation-duration: 1s;
	}
	&:nth-child(3) {
		animation-duration: 1.5s;
	}
	& + & {
		margin-top: 10px;
	}
}
#left2{
	height: 700px;
}

@keyframes slide {
  0% {
    transform: translateX(100%);
  }
  80% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>