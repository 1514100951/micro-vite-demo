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