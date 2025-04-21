export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: "fooof login",
      auth: false
    },
    component: () => import('@/views/login.vue')
  },{
    path: '/',
    name: 'index',
    meta: {
      title: "fooof",
      auth: false
    },
    component: () => import('@/views/index.vue'),
    children: [
    ]
  },{
    path: '/admin',
    name: 'admin',
    meta: {
      title: "admin",
      auth: true
    },
    component: () => import('@/views/admin.vue'),
    children: [
    ]
  }
]
