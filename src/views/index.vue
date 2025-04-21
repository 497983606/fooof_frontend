<template>
<Header />
<main class="main">
    <Scene />
</main>
</template>

<script>
import { reactive, toRefs, defineComponent } from 'vue'
import Scene from '@/components/scene.vue';
import Header from '@/components/header.vue';
export default defineComponent({
    components:{
        Header,
        Scene
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

    