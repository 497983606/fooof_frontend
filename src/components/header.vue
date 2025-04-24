<template>
  <div class="header">
    <span class="logo">
      <img src="../assets/img/fooof.svg" />
    </span>
    <span class="user">
      <n-button size="small" style="margin-right: 10px"  @click="menu = true"> <i class="fooof icon-liebiao"></i></n-button>
      <n-button size="small" v-if="hasToken" @click="logout"> <i class="fooof icon-tuichu"></i></n-button>
      <n-button size="small" v-else @click="login"> <i class="fooof icon-banshou"></i></n-button>
    </span>
  </div>

  <n-modal
  v-model:show="menu"
  style="width: 100%; max-width: 400px"
  preset="card"
  title="Menu"
  :mask-closable="false"
  size="small"
  :bordered="false"
  >
    <Menu @close="menu = false"/>
  </n-modal>

</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import router from '@/router/index.js'
import Menu from './menu.vue'

export default defineComponent({
  name: 'Header',
  components: { Menu },
  setup(){
    const menu = ref(false)

    const login = () => {
      router.push('login')
    }

    const logout = () => {
      $dialog.warning({
        title: 'Logout',
        content: 'Are you sure you want to logout?',
        positiveText: 'Logout',
        negativeText: 'Cancel',
        onPositiveClick: () => {
          localStorage.clear()
          location.reload()
        }
      })
    }

    watch(() => router.currentRoute.value, () => {
      menu.value = false
    }, {  deep: true })

    return {
      login,
      logout,
      hasToken: localStorage.getItem('token'),
      menu
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
