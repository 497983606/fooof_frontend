<template>
  <div class="menu">
    <n-spin :show="state.loading">
      <div class="_header">
        <n-cascader
          v-model:value="state.city"
          :options="state.options"
          check-strategy="all"
          placeholder="Please Select city"
        />
        <n-select
          v-model:value="state.page"
          style="margin-left: 10px; width: 100px"
          placeholder="Page"
          :options="state.pages"
        >
        </n-select>
        <n-button style="margin-left: 10px;">
          <i class="iconfont icon-add"></i>
        </n-button>
      </div>
      <div class="list">
        <p v-for="i in state.data.data">
          {{  i.url }}
          <span class="btns">
            <i class="iconfont icon-delete" @click="del(i)"></i>
            <i class="iconfont icon-highlighter" @click="edit(i)"></i>
          </span>
        </p>
      </div>
    </n-spin>
  </div>
</template>

<script setup>
import request from '@/service/'
import { reactive, watch, defineEmits} from 'vue'
import { pcTextArr } from "element-china-area-data";
const state = reactive({
  data: {},
  options: [{ label: 'All', value: 'All' }, ...pcTextArr],
  page: 1,
  city: 'All',
  pages: [],
  loading: false
})
const emit = defineEmits(['close'])
const close = () => emit('close')

const getData = async () => {
  state.loading = true
  const city = Array.isArray(state.city) ? state.city.join(',') : state.city
  const params = { searchField:'location', searchValue: city, page: state.page }
  if( city === 'All' ) {
    delete params.searchField
    delete params.searchValue
  }
  const res = await request.get(params)
  state.data = res
  res.totalPages = res.totalPages > 1 ? res.totalPages : 1
  state.pages = new Array(res.totalPages).fill(2).map( (_i, i) => ({ label: (i+1), value: i+1 }))
  state.loading = false
}

const del = (i) => {
  $dialog.warning({
      title: '警告',
      content: 'Are you sure you want to delete？',
      positiveText: 'ok',
      negativeText: 'not',
      draggable: true,
      onPositiveClick: async () => {
        state.loading = true
        await request.delete(i.uuid)
        getData()
        state.loading = false
      }
    })
}

const ok = () => {
  
}

watch(() => state.city, () => {
  state.page = 1
  getData()
})

watch(() => state.page, () => {
  getData()
}, { immediate: true })

</script>

<style lang="less">
.menu{
  ._header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .list{
    p{
      padding: 10px 0;
      cursor: pointer;
      border-bottom: 1px solid #eee; 
      position: relative;
      .btns{
        position: absolute;
        right: 0;
        i.iconfont{
          padding: 5px;
          background-color: #eee;
          margin-left: 10px;
        }
      }
    }
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
}
</style>