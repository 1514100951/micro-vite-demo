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



/**
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

<style scoped>
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logoc {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
