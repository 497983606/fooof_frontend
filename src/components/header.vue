<template>
  <div class="header">
    <span class="logo">
      <img src="../assets/img/fooof.svg" />
      See China
    </span>
    <span class="user">
      <n-button size="small" style="margin-right: 10px"  @click="menu"> <i class="iconfont icon-shitujuzhen"></i></n-button>
      <n-button size="small" @click="manger"> <i class="iconfont icon-shezhi"></i></n-button>
    </span>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue'
import router from '@/router/index.js'
import {  } from '@/service/api'
export default defineComponent({
  name: 'Header',
  setup(){
    const manger = () => {
      router.push('/admin')
    }

    const logout = () => {
      localStorage.clear()
      location.reload()
    }

    return {
      manger,
      logout
    }
  }
})
</script>

<style lang="less">
.header{
  height: 45px;
  background: linear-gradient( to top, #7f13b1, #9c1ac4);
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;
  .nav{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    color: #fff;
    font-weight: bold;
    .n-button{
      background-color: #fff;
    }
  }
  .user{
    .n-button{
      background: #fff;
    }
  }
  .logo{
    color: #ffffff8f;
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    margin-top: -2px;

    img{
      height: 26px;
      margin-right: 10px;
    }
  }
}
</style>
