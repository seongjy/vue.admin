<template>
  <a-range-picker
    v-model:value="formState"
    value-format="YYYY-MM-DD"
    :disabled-date="disabledDate"
    :placeholder="['시작일', '종료일']"
    allow-clear
    input-read-only />

  <!-- 기간 컨트롤 버튼 (useRangeBtn = true) -->
  <a-form-item-rest>
    <div v-if="setting.useRangeBtn" class="ml-4 inline">
      <a-radio-group v-model:value="currentRageBtn" :options="rangeDayOptions" option-type="button" />
    </div>
  </a-form-item-rest>
</template>

<script setup lang="ts">
import { computed, watch, ref, toRefs } from 'vue'
import dayjs from 'dayjs'

const props = defineProps<{
  setting: {
    label: string
    type: string
    value: string
    placeholder?: string
    options?: { label: string; value: string }[]
    required?: boolean
    maxDate?: string // 최대 날짜 제한
    minDate?: string // 최소 날짜 제한
    rules?: object[]
    useRangeBtn?: boolean // 기간 컨트롤 버튼 사용 여부
    rangeBtnOptions?: number[] // 기간 컨트롤 버튼 옵션(일자)
  }
  modelValue: string[]
}>()
const emit = defineEmits(['update:modelValue'])
const formState = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
const { minDate, maxDate } = toRefs(props.setting)
watch(
  formState,
  (value) => {
    if (!value || (value && !value[0] && !value[1])) {
      currentRageBtn.value = null
    }
  },
  { deep: true },
)

// 날짜 선택 제한
const disabledDate = (current: any) => {
  const currentDate = dayjs(current).format('YYYY-MM-DD')

  switch (true) {
    case !!(minDate?.value && maxDate?.value):
      return currentDate && (currentDate < minDate.value || currentDate > maxDate.value)
    case !!(minDate?.value && !maxDate?.value):
      return currentDate && currentDate < minDate.value
    case !!(!minDate?.value && maxDate?.value):
      return currentDate && currentDate > maxDate.value
    default:
      return false
  }
}

// 기간 컨트롤 버튼
const currentRageBtn = ref<null | number>(null)
const rangeDays = computed(() => props.setting.rangeBtnOptions || [0, 7, 15, 30])
const rangeDayOptions = computed(() => rangeDays.value.map((day) => ({ label: `${day === 0 ? '오늘' : day + '일'}`, value: day })))
watch(currentRageBtn, (value) => {
  if (value === null) return

  const startDate = (value === 0 ? dayjs().format('YYYY-MM-DD') : dayjs().subtract(value, 'day').format('YYYY-MM-DD')) as string
  const endDate = dayjs().format('YYYY-MM-DD') as string

  formState.value = [startDate, endDate]
})
</script>
