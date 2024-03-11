# micro-vite-demo
基于micro-app的vite示例demo

## 安装
```
pnpm install
```

## 运行

```
pnpm run dev:base
```

## 示例
![本地路径](./doc/image1.png "相对路径演示")

## 实现步骤
## 主应用
### 1. 基座应用入口文件修改
```
import microApp from '@micro-zoe/micro-app'

microApp.start({
    // 预加载
    preFetchApps: [
        //当子应用是vite时，除了name和url外，还要设置第三个参数iframe为true，开启iframe沙箱。
        { name: 'child-app-1', url: 'http://localhost:4002/child-app-1/', iframe: true, level: 3 }
    ],
    plugins: { },
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
```
### 2. 嵌入子应用 
```
// views/AppOne.vue
<template>
    <div>
        <micro-app name='child-app-1' url='http://localhost:4002/child-app-1/' :data="data" inline iframe
            @datachange='handleDataChange'></micro-app>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
const data = ref({
    type: '发送给子应用的数据'
})

function handleDataChange(e: CustomEvent): void {
    console.log('来自子应用 child-vite 的数据:', e.detail.data)
}
</script>

<style scoped></style>
```
### 3. APP.vue控制跳转
```
<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logoc" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <template v-for="item in pageRoutes">
          <template v-if="item.children">
            <a-sub-menu :key="item.path">
              <template #title>
                <span>
                  <user-outlined />
                  {{ item.name }}
                </span>
              </template>
              <a-menu-item v-for="child in item.children" :key="child.path" @click="select(child)">
                <user-outlined />
                <span>{{ child.name }}</span>
              </a-menu-item>
            </a-sub-menu>
          </template>
          <template v-else>
            <a-menu-item :key="item.path" @click="select(item)">
              <user-outlined />
              <span>{{ item.name }}</span>
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '91vh' }">
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">

import { RouterView, useRouter } from 'vue-router'
import { ref } from 'vue';
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';
import microApp, { getActiveApps } from '@micro-zoe/micro-app'
import { pageRoutes } from '@/router'

const router = useRouter()
const selectedKeys = ref<string[]>(['/']);
const collapsed = ref<boolean>(false);

/** 用户子菜单内部路由跳转回显主应用选中状态
 * @param {object} to 即将要进入的路由
 * @param {object} from 正要离开的路由
 * @param {string} name 子应用的name
 * @return cancel function 解绑路由监听函数
 */

microApp.router.beforeEach((to, from, name) => {
  selectedKeys.value = [to.pathname]
})

// 用户点击菜单时控制基座应用跳转
function select(item: any) {
  // 获取子应用appName
  const appName = item.app
  router.push(item.path)

  if (item.app !== 'main') {
    // 判断子应用是否存在
    if (getActiveApps().includes(appName)) {
      // 子应用存在，控制子应用跳转
      microApp.router.replace({
        name: appName,
        path: item.path,
      })
    } else {
      // 子应用不存在，设置defaultPage，控制子应用初次渲染时的默认页面
      microApp.router.setDefaultPage({
        name: appName, path: item.path
      })
    }
  }
}

</script>
```
### 4. 设置应用路由
```
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
```
### 4. 设置菜单路由
```
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
```
## 子应用
### 1.修改index.html
修改 index.html根元素 id ,app => vite-app，并在main.ts中挂载位置相应修改
### 2. 修改vite.config.ts
```
// 添加base路径
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

export default defineConfig({
  base: '/child-app-1/',
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 4002,
    host: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    // Allow services to be provided for non root directories of projects
    fs: {
      strict: false
    },
  }
})
```
### 3. 修改APP.vue, 监听路由变化
```
<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { watch, ref } from 'vue';

const router = useRouter()
const activeIndex = ref('/')

watch(() =>
  router.currentRoute.value.path,
  (toPath) => {
    activeIndex.value = toPath
    window.microApp.dispatch({ toPath })
  }, { deep: true })

</script>

<template>
  <div>
    <div>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router>
        <el-menu-item index="/">home</el-menu-item>
        <el-menu-item index="/element-plus">element-plus</el-menu-item>
        <el-menu-item index="/ant-design-vue">ant-design-vue</el-menu-item>
      </el-menu>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
```
