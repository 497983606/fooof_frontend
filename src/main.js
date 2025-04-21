import { createApp } from 'vue'

// 引入naiveui
import naive from 'naive-ui'

import './assets/font/common/iconfont.css'

import router from './router/index'
import App from './app.vue'
import './assets/css/common.less'

const app = createApp(App)
app.use(naive).use(router).mount('#app')
