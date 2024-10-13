<template>
  <a-result status="404" title="404" sub-title="찾을 수 없는 페이지입니다." class="error-page">
    <template #extra>
      <a-button @click="router.back()">뒤로가기</a-button>
      <a-button type="primary" @click="goToHome">홈으로</a-button>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.error-page {
  height: 100vh;
  background-color: #fff;
  align-content: center;
}
</style>
