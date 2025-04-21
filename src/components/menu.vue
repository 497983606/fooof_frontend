<template>
  <div class="menu">
    <div class="_header">
      <n-cascader
        v-model:value="state.city"
        :options="state.options"
        check-strategy="all"
        placeholder="Please Select city"
        size="small"
      />
      <n-select
        v-if="state.data.totalPages"
        v-model:value="state.page"
        size="small"
        style="margin-left: 10px; width: 220px"
        placeholder="Page Number"
        :options="state.pages"
      >
      </n-select>
    </div>
    <div class="list">
      
    </div>
    <div class="_footer">
      <n-button @click="close">cancel</n-button>
      <n-button type="primary" @click="getData()">ok</n-button>
    </div>
  </div>
</template>

<script setup>
import request from '@/service/'
import { reactive } from 'vue'
const state = reactive({
  data: {},
  options: [],
  page: 1,
  city: [],
  pages: []
})
const emit = defineEmits(['close'])
const close = () => emit('close')
const getData = async () => {
  state.options = [ { label: "all", value: "all" } ]
  const city = Array.isArray(state.city) ? state.city.join(',') : state.city
  const res = await request.get({ searchField:'location', searchValue: city, page: state.page })
  state.data = res
  state.pages = new Array(res.totalPages).fill(2).map( (_i, i) => ({ label: 'Page ' + (i+1), value: i+1 }))
  res.data.forEach(item => {
    let location = item.location.split(',')
    let parent = state.options.find(i => i.label === location[0])
    let children = {
      label: location[1],
      value: location[1]
    }
    if (!parent) {
      parent = {
        label: location[0],
        value: location[0],
        children: [children]
      }
      state.options.push(parent)
    } else {
      if ( !parent.children.find(  i => i.label === location[1]) ) parent.children.push(children)
    }
  })
}

getData()

</script>

<style lang="less">
._header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
._footer{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  .n-button{
    margin-left: 10px;
    min-width: 100px;
    margin-top: 20px;
  }
}
</style>