<template>
  <div class="scene" ref="sceneRef"></div>
</template>

<script setup>
import lib from './scene.js'
import { onMounted, ref } from 'vue'
const sceneRef = ref(null)
onMounted(() => {
  const scene = new lib(sceneRef.value)
  scene.init()
})
</script>

<style>
.scene{
  width: 100%;
  height: 100%;
}
</style>