<template>
  <div class="timer">{{ remainingTime }}후에 로그인 가능합니다.</div>
</template>

<script setup lang="ts">
import { computed, inject, toRefs } from 'vue'

const { statusResponse, setStatusResponse } = inject('providerStatusResponse')
const { waitSecond } = toRefs(statusResponse.value)

const timer = setInterval(() => {
  if (waitSecond.value === 0) {
    clearInterval(timer)
    setStatusResponse() // init
    return
  }
  waitSecond.value--
}, 1000)

const remainingTime = computed(() => {
  return Math.floor(waitSecond.value / 60) + ':' + (waitSecond.value % 60).toString().padStart(2, '0')
})
</script>

<style scoped>
.timer {
  color: #fff;
  text-align: center;
  font-size: 12px;
  margin-bottom: 10px;
}
</style>
