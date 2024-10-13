<template>
  <a-date-picker v-model:value="formState" value-format="YYYY-MM-DD" :disabled-date="disabledDate" :placeholder="setting.label" allow-clear input-read-only />
</template>

<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { computed, toRefs } from 'vue'

const props = defineProps<{
  setting: {
    label: string
    type: string
    value: string
    placeholder?: string
    options?: { label: string; value: string }[]
    required?: boolean
    maxRange?: number
    maxDate?: string
    minDate?: string
  }
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])
const formState = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
const { minDate, maxDate } = toRefs(props.setting)

const disabledDate = (current: any) => {
  const currentDate = useDateFormat(current.$d, 'YYYY-MM-DD')

  switch (true) {
    case !!(minDate?.value && maxDate?.value):
      return currentDate.value && (currentDate.value < minDate.value || currentDate.value > maxDate.value)
    case !!(minDate?.value && !maxDate?.value):
      return currentDate.value && currentDate.value < minDate.value
    case !!(!minDate?.value && maxDate?.value):
      return currentDate.value && currentDate.value > maxDate.value
    default:
      return false
  }
}
</script>
