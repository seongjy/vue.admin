<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import Filters from '@components/list/Filters.vue'
import List from '@components/list/List.vue'
import Confirm from '@components/common/Confirm.vue'
import { NoticesApi } from '@/api'
import { IFilterTemplate, INoticesRequest, INoticesItems } from '@/types'
import { OPTION_EXPOSUER_YN } from '@/constants'
import dayjs from 'dayjs'
import { useNotification, useCommonList } from '@/compositions'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute, LocationQueryValue } from 'vue-router'

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
const { selectedRowKeys, loading, limit, page, totalCount, list } = useCommonList()
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
const router = useRouter()
const route = useRoute()
const noticesApi = new NoticesApi()
const getList = async (isChangedPage = false) => {
  try {
    loading.value = true

    const getNoticesTops = new NoticesApi().getNoticesTops({ page: 1, target: 'member' })
    const params: INoticesRequest = isChangedPage
      ? { ...route.query, page: page.value, limit: limit.value, target: 'member' }
      : Object.keys(filters).reduce(
          (acc, key) => {
            if (['notice-type', 'exposure-yn'].includes(key) && filters[key]) {
              acc[key] = filters[key]
            }
            if (key === 'range' && filters[key]) {
              acc['start-date'] = filters.range[0]
              acc['end-date'] = filters.range[1]
            }
            if (key === 'searchType' && filters[key]) {
              acc[filters[key]] = filters.searchKeyword
            }
            return acc
          },
          { page: page.value, limit: limit.value, target: 'member' },
        )

    const res = await Promise.allSettled([getNoticesTops, noticesApi.getNotices(params)])

    totalCount.value = res[0].value.data.count + res[1].value.data.count
    list.value = res
      .map((items) => items.value.data.results)
      .flat()
      .map((item: INoticesItems) => {
        return {
          ...item,
          typeTitle: item.type.name,
          exposureName: item.is_exposure ? '노출' : '미노출',
          isReserved: item.is_reserved ? 'Y' : 'N',
          modifier: item.modifier.name,
          writer: item.registrant.name,
        }
      })

    router.push({ path: route.path, query: { ...params } })
  } catch (e) {
  } finally {
    loading.value = false
  }
}

// 상단 고정 처리
const { showToast } = useNotification()
const confirmData = reactive({ visible: false, message: '', record: null })
const onClickFixed = (record) => {
  confirmData.record = record ?? null
  confirmData.message = `선택한 공지사항을 상단 고정${record.is_fixed ? ' 해제' : ''}하시겠습니까?`
  confirmData.visible = true
}

const setStatus = async (prams, successMessage) => {
  try {
    loading.value = true

    await noticesApi.putNotices(prams)

    showToast({ type: 'success', message: successMessage })
    getList(false)
  } catch (e) {
    showToast({ message: e.response.data.meta.message })
    loading.value = false
  }
}
const setFixed = async () => {
  setStatus(
    {
      id: confirmData.record.id,
      target: 'member',
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
      target: 'member',
      process_type: 'multiple',
      exposure_yn: exposureState.value,
    },
    `노출 여부 변경이 완료되었습니다.`,
  )
}

// Mounted
const beforeRouteEnter = () => {
  if (Object.keys(route.query).length <= 0) {
    return
  }

  const {
    limit: limitSize,
    page: pageSize,
    'notice-type': noticeType,
    'exposure-yn': exposureYn,
    'start-date': startDate,
    'end-date': endDate,
    no,
    title,
  }: LocationQueryValue[] = route.query

  limit.value = limitSize ? Number(limitSize) : 10
  page.value = pageSize ? Number(pageSize) : 1

  filters['notice-type'] = noticeType || null
  filters['exposure-yn'] = exposureYn || null
  filters.searchKeyword = (no || title) ?? null

  if (startDate && endDate) {
    filters.range = [startDate, endDate]
  }
  if (no || title) {
    filters.searchType = no ? 'no' : 'title'
  }
}
onMounted(() => {
  beforeRouteEnter()
  getList(false)
})
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
          loading: loading,
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
