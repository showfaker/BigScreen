<template>
	<div ref="containerRef">
		<component
			v-for="item in components"
			:key="item.name"
			:is="item.component"
			class="es-screen-left-item"
			:name="item.name"
		>
		</component>
	</div>
</template>

<script setup lang='ts'>
import { shallowRef } from 'vue'
import { useSortable } from '@/utils/useSortable'

import Left1 from './Left1.vue'
import Left2 from './Left2.vue'
const components = shallowRef([
	{ name: 'left2', component: Left2 },
	{ name: 'left1', component: Left1 },
])

const { containerRef } = useSortable(components)
</script>

<style lang='scss' scoped>
.es-screen-left-item {
	width: 100%;
	height: 430px;
	background-color: var(--es-block-bg);
	padding: 10px;
	animation-name: slide;

	& + & {
		margin-top: 10px;
	}
	&:nth-child(1) {
		height: 550px;
		animation-duration: .8s;
	}
	&:nth-child(2) {
		animation-duration: 1.5s;
	}
}

@keyframes slide {
  0% {
    transform: translateX(-100%);
  }
  80% {
    transform: translateX(20px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
