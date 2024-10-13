<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import Filters from '@components/list/Filters.vue'
import List from '@components/list/List.vue'
import Confirm from '@components/common/Confirm.vue'
import { IFilterTemplate, INoticesRequest, INoticesItems } from '@/types'
import { OPTION_EXPOSUER_YN } from '@/constants'
import { useNotification, useCommonList } from '@/compositions'
import { useNoticesQuery, useNoticesTopsQuery, useNoticesMutation } from '@api/queries'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@api/queries/QueryKeys'

import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()
const queryClient = useQueryClient()

// Filters Settings
const filters = reactive({
  range: null,
  'notice-type': null,
  'exposure-yn': null,
  searchType: null,
  searchKeyword: '',
})
const noticeType: { label: string; value: null | '1' | '2' }[] = [
  { label: '전체', value: null },
  { label: '일반', value: '1' },
  { label: '이벤트', value: '2' },
]
const filterSettings: IFilterTemplate[] = [
  { label: '등록기간', type: 'range', value: 'range', maxDate: dayjs().format('YYYY-MM-DD') as string },
  { label: '공지유형', type: 'radio', value: 'notice-type', options: noticeType },
  { label: '노출상태', type: 'radio', value: 'exposure-yn', options: [{ label: '전체', value: null }, ...OPTION_EXPOSUER_YN] },
  {
    type: 'searchSet',
    set: {
      select: {
        value: 'searchType',
        options: [
          { label: '번호', value: 'no' },
          { label: '글 제목', value: 'title' },
        ],
      },
      input: { value: 'searchKeyword' },
    },
  },
]

// List Settings
const { selectedRowKeys, limit, page } = useCommonList()
const columns = ref([
  { title: '번호', dataIndex: 'id', width: '80px' },
  { title: '공지유형', dataIndex: 'typeTitle', width: '100px' },
  { title: '글 제목', key: 'title', scopedSlots: { customRender: 'title' }, width: '300px' },
  { title: '노출 상태', dataIndex: 'exposureName', width: '100px' },
  { title: '노출 예약 여부', dataIndex: 'isReserved', width: '130px' },
  { title: '노출 예약일', dataIndex: 'exposure_start_date', width: '160px' },
  { title: '작성자', dataIndex: 'writer', width: '120px' },
  { title: '등록일', dataIndex: 'registrant_date', width: '160px' },
  { title: '최종 수정자', dataIndex: 'modifier', width: '120px' },
  { title: '최종 수정일', dataIndex: 'modified_date', width: '160px' },
  { title: 'Actions', key: 'action', scopedSlots: { customRender: 'action' }, width: '100px' },
])

// API Call
const { isFetching: isTopsLoading, data: noticeTopList, refetch: noticesTopsRefetch } = useNoticesTopsQuery()
const { isFetching: isNoticesLoading, data: noticeList, refetch: noticesRefetch, queryParams } = useNoticesQuery()

const setFilters = (queries) => {
  if (queries['start-date'] || queries['end-date']) {
    filters.range = [queries['start-date'], queries['end-date']]
  }

  if (queries?.no || queries?.title) {
    filters.searchType = queries?.no ? 'no' : 'title'
    filters.searchKeyword = queries?.no || queries?.title
  }

  filters['notice-type'] = queries['notice-type'] || null
  filters['exposure-yn'] = queries['exposure-yn'] || null
  limit.value = Number(queries.limit) || 10
  page.value = Number(queries.page) || 1
}
const getQueryParams = (params?) => {
  const data = params ?? filters
  const query = {
    'notice-type': data['notice-type'],
    'exposure-yn': data['exposure-yn'],
    'start-date': data?.range && data?.range[0],
    'end-date': data?.range && data?.range[1],
    page: data?.page || page.value,
    limit: data?.limit || limit.value,
    no: data?.searchType && data?.searchType === 'no' && data?.searchKeyword,
    title: data?.searchType && data?.searchType === 'title' && data?.searchKeyword,
  }

  for (const key in query) {
    if (!query[key]) {
      delete query[key]
    }
  }

  return query as INoticesRequest
}

const queries = route.query
if (Object.keys(queries).length) {
  queryParams.value = getQueryParams(queries)
  setFilters(queries)
}
noticesRefetch()

const getList = (isChangedPage = false) => {
  router.push({ query: isChangedPage ? { ...route.query, page: page.value, limit: limit.value } : { ...getQueryParams() } })
}

watch(
  () => route.query,
  (routeQuery) => {
    if (Object.keys(routeQuery).length && routeQuery) {
      queryParams.value = getQueryParams(routeQuery)
      noticesTopsRefetch()
      noticesRefetch()
    }
  },
)

const totalCount = computed(() => noticeList.value?.count + noticeTopList.value?.count)
const list = computed(() => {
  return [...(noticeTopList.value?.results || []), ...(noticeList.value?.results || [])].map((item: INoticesItems) => ({
    ...item,
    typeTitle: item.type.name,
    exposureName: item.is_exposure ? '노출' : '미노출',
    isReserved: item.is_reserved ? 'Y' : 'N',
    modifier: item.modifier.name,
    writer: item.registrant.name,
  }))
})

// 상단 고정 처리
const { showToast } = useNotification()
const { mutate } = useNoticesMutation()

const confirmData = reactive({ visible: false, message: '', record: null })
const onClickFixed = (record) => {
  confirmData.record = record ?? null
  confirmData.message = `선택한 공지사항을 상단 고정${record.is_fixed ? ' 해제' : ''}하시겠습니까?`
  confirmData.visible = true
}

const setStatus = async (prams, successMessage) => {
  mutate(prams, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notices })
      showToast({ type: 'success', message: successMessage })
      noticesTopsRefetch()
      noticesRefetch()
    },
  })
}
const setFixed = () => {
  setStatus(
    {
      id: confirmData.record.id,
      target: 'seller',
      process_type: 'singular',
      fix_yn: confirmData.record.is_fixed ? 'N' : 'Y',
    },
    `상단 고정 ${confirmData.record.is_fixed ? '해제' : ''} 처리가 완료되었습니다.`,
  )
}

// 노출여부 일괄처리
const exposureState = ref<string | null>(null)
const onClickExposure = () => {
  if (!exposureState.value) {
    showToast({ message: '노출 여부를 선택해주세요.' })
    return
  }
  if (selectedRowKeys.value.length <= 0) {
    showToast({ message: '게시글을 선택하고 재시도해주세요.' })
    return
  }

  confirmData.visible = true
  confirmData.message = `선택된 ${selectedRowKeys.value.length}개의 공지사항을 아래 같이 일괄 처리 하시겠습니까? <br>노출 여부 : <strong>${exposureState.value === 'Y' ? '노출' : '미노출'}</strong>`
  confirmData.record = null
}
const setExposure = () => {
  setStatus(
    {
      id: selectedRowKeys.value,
      target: 'seller',
      process_type: 'multiple',
      exposure_yn: exposureState.value,
    },
    `노출 여부 변경이 완료되었습니다.`,
  )
}
</script>
<template>
  <Filters v-model="filters" :settings="filterSettings" :submit="() => getList(false)" />

  <a-row class="mb-[30px]">
    <a-col>
      <p class="text-[12px] text-[#1e90ff]">
        <ExclamationCircleOutlined /> 공지사항은 <strong>최대 3개</strong>까지 상단 고정 가능합니다. (상단 고정은 노출 상태의 공지사항만 설정 가능합니다.)
      </p>
    </a-col>
  </a-row>

  <div class="list-table">
    <List
      v-model:selected-row-keys="selectedRowKeys"
      v-model:limit="limit"
      v-model:page="page"
      :total-count="totalCount"
      :list="list"
      :columns="columns"
      :fetch="getList"
      :settings="{
        rowKey: 'id',
        configs: {
          scroll: { x: 1400 },
          loading: isNoticesLoading || isTopsLoading,
          rowClassName: (record) => (record.is_fixed ? 'fixed-top-notice' : null),
        },
      }">
      <template #right>
        <div class="mt-5">
          <a-space>
            <a-select
              v-model:value="exposureState"
              :options="[{ label: '노출여부', value: null }, ...OPTION_EXPOSUER_YN]"
              style="width: 120px; text-align: left"
              placeholder="노출여부" />
            <a-button type="primary" @click="onClickExposure">적용</a-button>
          </a-space>
        </div>
      </template>
      <template #body="{ record, column }">
        <template v-if="column.key === 'title'">
          <router-link class="link" :to="`/clientNotices/${record.id}`">{{ record.title }}</router-link>
        </template>
        <template v-if="column.key === 'action'">
          <a-button size="small" type="primary" :danger="record.is_fixed" :disabled="!record.is_exposure" @click="onClickFixed(record)">
            {{ record.is_fixed ? '고정해제' : '상단고정' }}
          </a-button>
        </template>
      </template>
    </List>
  </div>

  <Confirm v-model="confirmData.visible" :html="confirmData.message" :confirm="confirmData.record ? setFixed : setExposure" />
</template>

<style scoped>
.link {
  word-break: break-all;
  white-space: normal;
}
.list-table :deep(.ant-table-row.fixed-top-notice td) {
  background-color: #eff8fc !important;
  font-weight: bold !important;
}
</style>
