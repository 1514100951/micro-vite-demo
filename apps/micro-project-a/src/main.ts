import './assets/main.css'

import { createApp, } from 'vue'
import { createRouter, createWebHistory, } from 'vue-router'
import { routes } from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'

declare global {
    interface Window {
        microApp: any
        mount: CallableFunction
        unmount: CallableFunction
        __MICRO_APP_ENVIRONMENT__: string
        __MICRO_APP_BASE_ROUTE__: string
        __MICRO_APP_NAME__: string
        __MICRO_APP_PUBLIC_PATH__: string
        __MICRO_APP_BASE_APPLICATION__: string
    }
}

let app: any = null
let router: any = null
let history: any = null

function handleMicroData() {
    console.log('child-vite getData:', window.microApp?.getData())

    // 监听基座下发的数据变化
    window.microApp?.addDataListener((data: any) => {
        console.log('child-vite addDataListener:', data)
    }, true)

    // 向基座发送数据
    setTimeout(() => {
        window.microApp?.dispatch({ myname: 'child-vite' })
    }, 3000)
}


// 将渲染操作放入 mount 函数
window.mount = (data: any) => {

    history = createWebHistory(window.__MICRO_APP_BASE_ROUTE__ || import.meta.env.BASE_URL)
    router = createRouter({
        history,
        routes,
    })

    app = createApp(App)
    app.use(router)
    app.use(ElementPlus)
    app.use(Antd)
    app.mount('#vite-app')

    handleMicroData()
}

// 将卸载操作放入 unmount 函数
window.unmount = () => {
    app && app.unmount()
    history && history.destroy()
    app = null
    router = null
    history = null
    console.log('微应用vite卸载了 -- UMD模式');
}

// 非微前端环境直接渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
    window.mount()
}