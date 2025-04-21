<template>
    <div class='login'>
        <div class='login_box'>
            <h1>
                FOOOF
            </h1>
            <n-form :model="params">
                <n-form-item label="Username" :rule="[required]" path="username">
                <n-input v-model:value="params.username"></n-input>
                </n-form-item>
                <n-form-item label="Password" :rule="[required]" path="password">
                <n-input v-model:value="params.password" type="password"></n-input>
                </n-form-item>
            </n-form>
            <n-button type="primary" @click="login" :disabled="logining" >Login</n-button>
            <n-button type="success" style="margin-top: 20px" @click="router.push('/')" :disabled="logining" >Back Browsing</n-button>
        </div>
    </div>
</template>
<script>
    import { onMounted, reactive, ref, toRefs} from 'vue'
    import { useRouter } from 'vue-router'
    import { user } from '@/service/api'
    export default {
        setup(){
            const required = { required: true, message: "Plase input required field", trigger: "blur" }
            const router = useRouter()
            const state = reactive({
                params: {
                    username: null,
                    password: null
                },
                logining: false
            })
            const login = async () => {
                if(!state.params.username ||!state.params.password) return $message.error('Password or username is false')
                state.logining = true
                // 请自行实现登录
                // let res = await user.login(state.params)
                // if(res.code == 200){
                //     localStorage.setItem('token', JSON.stringify(res.data))
                //     router.push('/')
                // }else{
                //   $message.error(res.msg)
                // }

                // 模拟登录
                localStorage.setItem('token', JSON.stringify({ username: 'chaoxl', token: "4554545", alias: "chaoxl" }))
                router.push('/')

                state.logining = false
            }

            // 监听回车键
            onMounted(() => {
                window.addEventListener('keydown', e => { 
                if( e.key === 'Enter') login()
                });
            })
            return {
                required,
                router,
                ...toRefs(state),
                login
            }
        }
    }
</script>

<style lang="less">
.login{
  width: 100%;
  height: 100%;
  background: #333333 center;

  position: relative;
  h1{
    color: #2c2c2c;
    text-align: center;
    padding: 0;
    margin-top: 40px;
  }
  .login_box{
    width: 400px;
    padding-bottom: 20px;
    background: #fff;
    border: 1px solid rgb(0, 0, 0);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.349);
    .n-form{
      padding: 20px;
    }
    .n-button{
      margin: auto;
      display: block;
      color: #fff;
      width: 160px;
      height: 40px;
      .n-button__content{
        display: block;
      }
    }
  }
}

</style>