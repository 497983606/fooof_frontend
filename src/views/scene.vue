<template>
  <div class="scene" ref="sceneRef"></div>
  <div class="right_btns">
    <n-button @click="openMeasure" type="primary">
      <i class="fooof icon-juliceliang" v-if="!state.measure"></i>
      <i class="fooof icon-mti-qingchu" v-else></i>
    </n-button>
    <n-button @click="closeMeasure" v-if="state.measure" type="error" >
      <i class="fooof icon-guanbi"></i>
    </n-button>
    <n-button type="success" @click="state.show = true"><i class="fooof icon-tushu"></i></n-button>
    <n-button type="info" :disabled="state.loadingGeo" @click="getlocation()"><i class="fooof icon-dingwei"></i></n-button>
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
      <p><span>Date：</span>{{ state.info?.info.date }}</p>
      <p><span>Author：</span>{{ state.info?.info.author }}</p>
      <p><span>City：</span>{{ state.info?.location }}</p>
      <p><span>Title：</span>{{ state.info?.info.title }}</p>
    </div>
    <div class="center" style="margin-top: 20px"> FOOOF.TOP <a href="https://wangyesheji.cn/about"> Link Me</a></div>
  </n-modal>
  <div style="width: 300px; background: #fff; text-align: center; position:absolute; bottom: 0; left: 0">
    <span v-if="state.geolocation.position">
      {{ state.geolocation.position.latitude }}, 
      {{  state.geolocation.position.longitude }}, 
      {{  state.geolocation.position.altitude }}
      {{ state.geolocation.relativePosition.map(i => i.toFixed(2)).join() }}
      {{ state.geolocation.isInBoundingBox }}
    </span>
    <span v-else> {{ state.loadingGeo ? "定位中..." : "未开启定位" }}</span>
  </div>
</template>

<script setup>
import lib from './scene.js'
import { LocationChecker } from './location'
import { reactive, ref, watch } from 'vue'
import sunny from '@zkqh/c3d/assets/sunny.hdr?url'
import { useRoute, useRouter} from 'vue-router'
import { debounce, dateFormat } from '@/utils/index.js'
import request from '@/service/index.js'
const sceneRef = ref(null)
let scene = null, locationChecker = null, watchId = null
const state = reactive({
  info: {},
  uuid: null,
  measure: false,
  show: false,
  geolocation: {},
  loadingGeo: false
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
    state.uuid = state.info.uuid
    document.title = state.info.info.title + '-FoooF-Look China'
    router.replace({ query: { uuid: state.info.uuid } })
    initScene()
  } 
}

watch(() => route.query, (val) => {
  if( val.uuid && val.uuid == state.uuid ) return
  if( val.uuid ) getData({ uuid: val.uuid })
  else getData({ pageSize: 1, page: 1 })
}, { immediate: true })

const getlocation = async () => {
  state.loadingGeo = true
  if(state.geolocation.position){
    if(watchId) locationChecker.stopWatching(watchId)
    locationChecker = null
    watchId = null
    state.geolocation = {}
    state.loadingGeo = false
    return false
  }
  locationChecker = new LocationChecker()
  try{
    // 初始化
    await locationChecker.initialize(state.info.url);
    // 获取单次位置
    state.geolocation = await locationChecker.checkUserPosition()
  }catch(e){
    $message.error(e);
    state.loadingGeo = false
    return false 
  }
  // 持续监听位置
  watchId = locationChecker.watchPosition(
      (result) => {
          state.geolocation = result
      },
      (error) => {
          $message.error(error);
      }
  )
  state.loadingGeo = false
}

watch(() => state.geolocation.position, (val) => {
  if(val){
    const { relativePosition } = state.geolocation
    scene.setMe(relativePosition[0], relativePosition[1])
  }else{
    scene.removeMe()
  }
})

const initScene = async () => {
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
      maxPolarAngle: 80
    }
  })
  scene.load( state.info.url )
  
  scene.controlChange = debounce((e) => {
    if(!route.query.uuid) return
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
    margin-top: 10px;
  }
}

.scene{
  width: 100%;
  height: 100%;
  position: relative;
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