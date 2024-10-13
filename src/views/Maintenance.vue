<template>
  <a-result class="error-page" status="warning" title="서비스 점검중 입니다." sub-title="점검시간 동안 서비스 이용이 제한되는 점 양해 부탁드립니다. ">
    <template #extra>
      <a-button @click="router.back()">뒤로가기</a-button>
      <a-button type="primary" @click="goToHome">홈으로</a-button>
    </template>
    <div class="desc">
      <p>{{ maintenanceMessage }}</p>
      <p class="text-[12px]">* 작업 시간은 사정에 의해 다소 변경될 수 있습니다.</p>
    </div>
  </a-result>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { maintenanceMessage } = inject('maintenance')

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
