<template>
<Header />
<main class="main">
    <router-view></router-view>
</main>
</template>

<script>
import { reactive, toRefs, defineComponent } from 'vue'
import Header from '@/components/header.vue';
export default defineComponent({
    components:{
        Header
    },

    setup(){
        
    }
})
</script>

<style lang="less">
.main{
    height: calc(100% - 45px);
    background-color: #e7e5e5;
    box-sizing: border-box;
}
</style>

    