import { ref } from 'vue'
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@api/queries/QueryKeys'
import { NoticesApi } from '@/api'
import { INoticesRequest } from '@/types'
import { useNotification } from '@/compositions'

export const useNoticesQuery = () => {
  const noticesApi = new NoticesApi()
  const queryParams = ref<INoticesRequest>({ page: 1, limit: 10 })
  const { isLoading, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.notices,
    queryFn: () => noticesApi.getNotices({ ...queryParams.value, target: 'seller' }),
    select: (res) => res.data,
    // gcTime: Infinity,
    // enabled: false,
  })

  return {
    isFetching, // fetching status
    isLoading, // first fetching status
    isError,
    data,
    error,
    refetch,
    queryParams,
  }
}
export const useNoticesTopsQuery = () => {
  const noticesTopsApi = new NoticesApi()
  const { isLoading, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.noticesTops,
    queryFn: () => noticesTopsApi.getNoticesTops({ page: 1, target: 'seller' }),
    select: (res) => res.data,
    // staleTime:
    // enabled
  })

  return {
    isLoading,
    isFetching,
    isError,
    data,
    error,
    refetch,
  }
}
export const useNoticesMutation = () => {
  const { showToast } = useNotification()
  const noticesApi = new NoticesApi()

  const { data, error, mutate, mutateAsync } = useMutation({
    mutationFn: (prams) => noticesApi.putNotices(prams),
    onError: (err) => {
      showToast({ message: err.response.data.meta.message })
    },
  })

  return {
    data,
    mutate,
    mutateAsync,
    error,
  }
}
