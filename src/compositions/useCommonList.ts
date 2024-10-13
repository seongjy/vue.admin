import { onMounted, ref } from 'vue'

export const useCommonList = () => {
  const selectedRowKeys = ref<string[]>([])
  const loading = ref<boolean>(false)
  const limit = ref<number>(10)
  const page = ref<number>(1)

  const totalCount = ref<number>(0)
  const list = ref([])

  return {
    selectedRowKeys,
    loading,
    limit,
    page,
    totalCount,
    list,
  }
}
