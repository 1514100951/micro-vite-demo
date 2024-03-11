import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import microApp from '@micro-zoe/micro-app'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

microApp.start({
    // 'router-mode': 'native',
    lifeCycles: {
        created() {
            console.log('created 全局监听')
        },
        beforemount() {
            console.log('beforemount 全局监听')
        },
        mounted() {
            console.log('mounted 全局监听')
        },
        unmount() {
            console.log('unmount 全局监听')
        },
        error() {
            console.log('error 全局监听')
        }
    },
    // 预加载
    preFetchApps: [
        //当子应用是vite时，除了name和url外，还要设置第三个参数iframe为true，开启iframe沙箱。
        { name: 'child-app-1', url: 'http://localhost:4002/child-app-1/', iframe: true, level: 3 }
    ],
    plugins: {

    },
    /**
     * 自定义fetch
     * @param url 静态资源地址
     * @param options fetch请求配置项
     * @returns Promise<string>
     * (url: string, options: Record<string, unknown>, appName: string | null) => Promise<string>
     */
    fetch(url: string, options: any, appName: string | null) {
        return fetch(url, Object.assign(options, {})).then((res) => {
            return res.text()
        })
    }
})


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
