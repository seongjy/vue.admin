<template>
  <div class="border-2 border-[#f0f0f0] border-solid rounded p-20 mb-30">
    <a-form ref="formRef" name="formRef" :model="formState" :rules="rules" v-bind="layout" @finish="onSubmit">
      <a-form-item
        v-for="setting in settings"
        :key="setting.value"
        :name="setting.value"
        :required="setting.required"
        :label="setting.label"
        :class="['rangeSet', 'searchSet'].includes(setting.type) && 'mb-0'"
        :wrapper-col="['searchSet', 'rangeSet', 'range'].includes(setting.type) ? { span: 15 } : layout.wrapperCol"
        label-align="left">
        <!-- TYPE Input -->
        <template v-if="setting.type === 'input'">
          <a-input
            v-model:value="formState[setting.value]"
            :placeholder="setting.placeholder || (setting.label && `${setting.label}을(를) 입력해주세요.`)"
            :rules="[{ required: true, message: 'input something' }]" />
        </template>
        <!-- TYPE Select -->
        <template v-if="setting.type === 'select'">
          <a-select
            v-model:value="formState[setting.value]"
            :placeholder="setting.placeholder || (setting.label && `${setting.label}을 선택해주세요.`)"
            :options="setting.options"
            :rules="[{ required: true, message: 'select something' }]"
            style="width: auto; min-width: 150px"
            allow-clear>
          </a-select>
        </template>
        <!-- TYPE Date(단일 날짜 선택)-->
        <template v-if="setting.type === 'date'">
          <DatePicker v-model="formState[setting.value]" :setting="setting" />
        </template>
        <!-- TYPE Range(기간 선택) -->
        <template v-if="setting.type === 'range'">
          <RangePicker v-model="formState[setting.value]" :setting="setting" />
        </template>
        <!-- TYPE Range(기간 + 구분) -->
        <template v-if="setting.type === 'rangeSet'">
          <a-row gutter="5">
            <a-col span="5">
              <a-form-item :name="setting.set.select.value">
                <a-select v-model:value="formState[setting.set.select.value]" :options="setting.set.select.options" placeholder="Select" allow-clear />
              </a-form-item>
            </a-col>
            <a-col span="19">
              <a-form-item :name="setting.set.range.value">
                <RangePicker v-model="formState[setting.set.range.value]" :setting="setting.set.range" />
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <!--  TYPE SearchSet(검색어구분 + 검색어입력)-->
        <template v-if="setting.type === 'searchSet'">
          <a-row gutter="5">
            <a-col span="8">
              <a-form-item :name="setting.set.select.value">
                <a-select v-model:value="formState[setting.set.select.value]" :options="setting.set.select.options" placeholder="Select" allow-clear />
              </a-form-item>
            </a-col>
            <a-col span="16">
              <a-form-item :name="setting.set.input.value">
                <a-input v-model:value="formState[setting.set.input.value]" :placeholder="`${setting.label || '검색어'}을(를) 입력해주세요.`" />
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <!-- TYPE Radio  -->
        <template v-if="setting.type === 'radio'">
          <a-radio-group v-model:value="formState[setting.value]" option-type="button" :options="setting.options" />
        </template>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24 }" class="text-center mb-0">
        <a-button type="primary" html-type="submit" class="w-120">검색</a-button>
        <a-button style="margin: 0 8px" class="w-120" @click="() => formRef.resetFields()">초기화</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef, useAttrs } from 'vue'
import { FormInstance } from 'ant-design-vue'
import DatePicker from '@/components/Form/DatePicker.vue'
import RangePicker from '@/components/Form/RangePicker.vue'

const emit = defineEmits(['update:filters'])
const props = defineProps({
  modelValue: { type: Object, required: true },
  settings: { type: Array, required: true },
  layout: {
    type: Object,
    default: () => {
      return {
        layout: 'horizontal', // 'horizontal', 'vertical', 'inline'
        labelCol: { span: 2, style: { maxWidth: '160px' } },
        wrapperCol: { span: 13 },
      }
    },
  },
})

const formRef = ref<FormInstance>()
const settings = toRef(props, 'settings')
const formState = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:filters', value),
})
const rules = computed(() => {
  return settings.value.reduce((acc, setting) => {
    const valueNames = ['searchSet', 'rangeSet'].includes(setting.type)
      ? [setting.set.select.value, setting.type === 'searchSet' ? setting.set.input.value : setting.set.range.value]
      : [setting.value]

    // Required Rules 추가
    if (setting.required) {
      if (['searchSet', 'rangeSet'].includes(setting.type)) {
        acc[setting.set.select.value] = [{ required: true, message: false }]
        if (setting.type === 'searchSet') {
          acc[setting.set.input.value] = [{ required: true, message: `${setting.label || '검색어'}을(를) 입력해주세요.` }]
        }
        if (setting.type === 'rangeSet') {
          acc[setting.set.range.value] = [{ type: 'array', required: true, message: `${setting.label || '기간'}을(를) 선택해주세요.` }]
        }
      } else {
        acc[setting.value] = [
          {
            type: setting.type === 'range' ? 'array' : 'string',
            required: true,
            message: `${setting.label || '필터'}을(를) ${setting.type === 'input' ? '입력' : '선택'}해주세요.`,
          },
        ]
      }
    }
    // 커스텀 Rules 추가
    if (setting.rules) {
      valueNames.forEach((valueName) => {
        acc[valueName] = acc[valueName] ? [...acc[valueName], ...setting.rules] : setting.rules
      })
    }

    return acc
  }, {})
})

// Submit
const attrs = useAttrs()
const onSubmit = (values) => {
  if (attrs.submit && attrs.submit instanceof Function) {
    attrs.submit(values)
  }
}
</script>

<!--# (참고) settings example-->
<!--# (참고) @types/common - IFilterTemplate-->
<!--
[
  { label: '기간설정', type: 'range', value: 'range', minDate: 'YYYY-MM-DD', maxDate: useDateFormat(useNow(), 'YYYY-MM-DD'), useRangeBtn: true, rangeBtnOptions: [0, 10, 30, 90] },
  {
    label: '구분+기간설정',
    type: 'rangeSet',
    required: true,
    set: {
      select: {
        value: 'searchType',
        options: [
          { label: '등록일', value: 'registDate' },
          { label: '수정일', value: 'modifyDate' },
        ],
      },
      range: {
        value: 'range',
        maxDate: dayjs().format('YYYY-MM-DD') as string,
        useRangeBtn: true,
      },
    },
  },
  { label: '단일날짜선택', type: 'date', value: 'date', minDate: 'YYYY-MM-DD', maxDate: useDateFormat(useNow(), 'YYYY-MM-DD') },
  { label: '셀렉트', type: 'select', value: 'noticeType', options: [{label: '테스트', value: 'test'}] },
  { label: '입력', type: 'input', value: 'noticeTitle' },
  {
    label: '셀렉트+입력 혼합',
    type: 'searchSet',
    required: true,
    set: {
      select: {
        value: 'searchType',
        options: [
          { label: '번호', value: 'no' },
          { label: '제목', value: 'title' },
        ],
      },
      input: { value: 'searchKeyword' },
    },
  },
  {
    label: '라디오버튼',
    type: 'radio',
    value: 'radio',
    options: [
      { label: '전체', value: null },
      { label: '진열', value: 'Y' },
      { label: '미진열', value: 'N', disabled: true },
    ],
  },
]

-->
