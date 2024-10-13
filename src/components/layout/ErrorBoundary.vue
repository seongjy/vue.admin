<template>
  <Error v-if="hasError" />
  <slot v-else></slot>
</template>
<script setup lang="ts">
import Error from '@components/layout/Error.vue'
import { ref, onErrorCaptured } from 'vue'

const hasError = ref<boolean>(false)

/**
 * 하위 에러 감지
 * https://ko.vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured (참고)
 * (에러 종류) 컴포넌트 렌더, 이벤트 핸들러, 생명주기 훅, setup() 함수, 감시자, 커스텀 디렉티브 훅, 트랜지션 훅
 */
onErrorCaptured(() => {
  hasError.value = true
})
</script>

<style scoped></style>
