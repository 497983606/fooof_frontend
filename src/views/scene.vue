<template>
  <div class="scene" ref="sceneRef"></div>
  <div class="right_btns">
    <n-button @click="openMeasure" type="primary">
      <i class="iconfont icon-bianjibiaoge" v-if="!state.measure"></i>
      <i class="iconfont icon-delete" v-else></i>
    </n-button>
    <n-button @click="closeMeasure" v-if="state.measure" type="primary" >
      <i class="iconfont icon-square-remove"></i>
    </n-button>
    <n-button type="success" @click="state.show = true"><i class="iconfont icon-gongzuobaogao"></i></n-button>
  </div>
  <n-modal
  v-model:show="state.show"
  style="width: 100%; max-width: 400px"
  preset="card"
  title="Scene Info"
  size="small"
  :bordered="false"
  >
  <div class="scene_info">
    <p>{{ state.info?.info.description }}</p>
    <p><span>日期：</span>{{ state.info?.info.date }}</p>
    <p><span>作者：</span>{{ state.info?.info.author }}</p>
    <p><span>城市：</span>{{ state.info?.location }}</p>
    <p><span>名称：</span>{{ state.info?.info.title }}</p>
  </div>
  <div class="center" style="margin-top: 20px"> FOOOF.TOP <a href="https://wangyesheji.cn/about"> Link Me</a></div>
  </n-modal>
</template>

<script setup>
import lib from './scene.js'
import { onMounted, reactive, ref, watch } from 'vue'
import sunny from '@zkqh/c3d/assets/sunny.hdr?url'
import { useRoute, useRouter} from 'vue-router'
import { debounce, dateFormat } from '@/utils/index.js'
import request from '@/service/index.js'
const sceneRef = ref(null)
let scene = null, timer = null
const state = reactive({
  info: {},
  uuid: null,
  measure: false,
  show: false,
})

const router = useRouter()
const route = useRoute()

const openMeasure = () => {
  scene.c3d.photog.openMeasure('dis')
  state.measure = true
}

const closeMeasure = () => {
  scene.c3d.photog.closeMeasure()
  state.measure = false 
}

const getData = async (params) => {
  if( params.uuid ) state.uuid = params.uuid
  let res = await request.get(params)
  if( res.success ) {
    state.info = Array.isArray(res.data) ? res.data[0] : res.data
    state.info.info = JSON.parse(state.info.info)
    state.info.info.date = dateFormat( 'YYYY-mm-dd', new Date(state.info.info.date))
    initScene()
  } 
}

watch(() => route.query, (val) => {
  if( val.uuid == state.uuid ) return
  if( val.uuid ) getData({ uuid: val.uuid })
  else getData({ pageSize: 1, page: 1 })
}, { immediate: true })

const initScene = () => {
  const { camera: _camera, control: _control } = route.query
  if( scene ) {
    scene.destroy()
    sceneRef.value.innerHTML = ''
    scene = null
  }
  const { camera, control } = state.info.info
  scene = new lib(sceneRef.value)
  scene.init({
    sky: sunny,
    camera: {
      position: _camera ? _camera.split(',') : camera.length ? camera : [0, 150, 150],
      near: 0.1,
      far: 1000000,
    },
    control: {
      target: _control ? _control.split(',') : control.length? control : [0, 0, 0],
      maxDistance: 150000,
      minDistance: 0.1,
      maxPolarAngle: 180
    }
  })
  scene.load( state.info.url )
  scene.controlChange = debounce((e) => {
    const query = { 
    ...route.query,
      camera: e.camera.join(','),
      control: e.control.join(',')
    }
    router.replace({ query })
  }, 2000)
  
}

</script>

<style lang="less">
.right_btns{
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
  .n-button{
    display: block;
    margin-top: 20px;
  }
}

.scene{
  width: 100%;
  height: 100%;
}
.center{
  text-align: center;
  padding: 10px 0;
}
.scene_info{
  width: 100%;
  p{
    padding: 3px 0;
    border-bottom: 1px solid #eee;
    line-height: 1.5;
    &:nth-child(1){
      border-top: 1px solid #eee;
      background-color: #eee;
      padding: 5px;
      box-sizing: border-box;
      line-height: 1.5;
    }
    span{
      color: #999;
    }
  }
}
</style>