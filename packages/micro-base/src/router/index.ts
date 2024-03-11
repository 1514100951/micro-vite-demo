import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about2',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    name: 'child-app-1',
    // 👇 非严格匹配，/child-app-1/* 都指向 vue3-vite 页面
    path: '/child-app-1/:page*',
    component: () => import('../views/AppOne.vue')
  },
]

const pageRoutes = [
  {
    path: '/',
    name: 'home',
    app: 'main'
  },
  {
    path: '/about2',
    name: 'about',
    app: 'main'
  },
  {
    path: '/child-app-1',
    name: '合同管理',
    children: [
      {
        path: '/child-app-1/',
        name: '收款',
        app: 'child-app-1'
      },
      {
        path: '/child-app-1/element-plus',
        name: '付款',
        app: 'child-app-1'
      },
      {
        path: '/child-app-1/ant-design-vue',
        name: '首页d',
        app: 'child-app-1'
      }
    ]
  },
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router

export {
  routes,
  pageRoutes
}
