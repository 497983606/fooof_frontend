import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userinfo = localStorage.getItem('token')
  if (to.meta.auth) {
    if ( userinfo ) next()
    else next({ path: '/login' })
  } else {
    if (userinfo && to.path == '/login') next({ path: '/' })
    else next()
  }
})

export default router