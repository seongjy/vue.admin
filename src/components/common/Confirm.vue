<template>
  <a-modal v-model:open="isVisible" :title="title || ''" centered ok-text="확인" cancel-text="취소" v-bind="$attrs.configs" @ok="onSubmit">
    <div v-html="props.html"></div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ modelValue: boolean; html: string; confirm?: () => void; title?: string }>()
const emit = defineEmits(['update:modelValue'])
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const onSubmit = () => {
  isVisible.value = false

  if (props.confirm) {
    props.confirm()
  }
}
</script>
