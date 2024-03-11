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
