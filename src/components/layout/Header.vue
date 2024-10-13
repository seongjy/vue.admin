<script setup lang="ts">
import { LogoutOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useCookie } from '@compositions/useCookie'
import { computed } from 'vue'

const router = useRouter()
const { getCookie } = useCookie()
</script>

<template>
  <a-layout-header class="header bg-primary justify-items-end text-right">
    <a-tooltip>
      <template #title>Logout</template>
      <button class="text-white text-xs cursor-pointer" @click="router.push('/logout')">
        <LogoutOutlined class="text-sm" />
        <span class="ml-5">{{ getCookie('username') }}</span>
      </button>
    </a-tooltip>
  </a-layout-header>
</template>

<style scoped lang="scss">
.header {
  padding-inline: 20px;
}
</style>
