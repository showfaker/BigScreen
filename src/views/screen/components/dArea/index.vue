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
import mobel1 from './mobel6.vue'
import mobel2 from './mobel7.vue'
import mobel3 from './mobel8.vue'

const components = shallowRef([
	{ name: 'right1', component: mobel1 },
	{ name: 'right2', component: mobel2 },
	{ name: 'right3', component: mobel3 }
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

#right2 {
	height: 350px;
}

#right3 {
	height: 340px;
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
