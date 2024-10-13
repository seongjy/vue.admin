<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { OPTION_LIMIT } from '@constants/filters'

// (참고) https://www.antdv.com/components/table#components-table-demo-summary
const props = defineProps<{
  list: object[]
  columns: object[]
  limit: number
  page: number
  fetch: () => void // getList 사용자 정의
  totalCount: number
  selectedRowKeys?: string[]
  settings?: object
}>()
const emit = defineEmits(['update:selectedRowKeys', 'update:limit', 'update:page'])
const selectedRowKeys = computed({
  get: () => props.selectedRowKeys,
  set: (value: string[]) => emit('update:selectedRowKeys', value),
})
const limit = computed({
  get: () => props.limit || 10,
  set: (value) => emit('update:limit', value),
})
const page = computed({
  get: () => props.page || 1,
  set: (value) => emit('update:page', value),
})

const onSelectChange = (selectedKeys: string[]) => {
  selectedRowKeys.value = selectedKeys
}

const settings = computed(() => {
  return {
    size: props.settings?.size || 'small',
    rowKey: props.settings?.rowKey || ((record) => record.id),
    columns: props.columns.map((column) => ({ ...column, align: 'center' })),
    pagination: false,
    locale: props.settings?.locale || { emptyText: '검색 결과가 없습니다.' },
    dataSource: props.list,
    rowSelection: props.selectedRowKeys && {
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
    },
    ...props.settings.configs,
  }
})
</script>

<template>
  <a-row class="mb-10 items-end">
    <a-col :xs="24" :sm="12">
      전체 조회건 수 : <span class="font-bold">{{ totalCount || 0 }}</span> 건
      <slot name="left"></slot>
    </a-col>
    <a-col :xs="24" :sm="12" class="text-right">
      <a-select v-model:value="limit" :options="OPTION_LIMIT" style="width: 120px; text-align: left" placeholder="선택" @change="[(page = 1), fetch(true)]" />
      <slot name="right"></slot>
    </a-col>
  </a-row>

  <a-table bordered v-bind="settings" :class="$attrs.class">
    <template #headerCell="{ title, column }">
      <slot name="headers" :title="title" :column="column"> </slot>
    </template>
    <template #bodyCell="{ text, record, index, column }">
      <slot name="body" :text="text" :record="record" :index="index" :column="column"></slot>
    </template>
  </a-table>

  <a-pagination
    v-if="props.list.length > 0"
    v-model:current="page"
    v-model:page-size="limit"
    :total="props.totalCount"
    class="mt-[20px] text-center"
    @change="fetch(true)" />
</template>
