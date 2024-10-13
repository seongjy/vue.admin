<script setup lang="ts">
import { inject } from 'vue'

const toasts = inject('toasts')
</script>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-alert
      v-for="(toast, index) in toasts"
      :key="`${toast.type}${index}`"
      :type="toast.type"
      :show-icon="toast.showIcon ?? true"
      :closable="toast.closable ?? false"
      :message="toast.message" />
  </a-space>
</template>

<style scoped></style>
