<template>
  <a-result class="error-page" status="500" title="500" sub-title="서비스를 불러오는데 실패했습니다.">
    <template #extra>
      <a-button type="primary" @click="reload">새로고침</a-button>
    </template>
  </a-result>
</template>

<script setup lang="ts">
const reload = () => {
  window.location.reload()
}
</script>

<style scoped>
.error-page {
  padding-top: 20vh;
}
</style>
