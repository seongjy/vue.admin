import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { SERVICE_NO } from '@constants/common'
import { TChannelCode, TChannelNo } from '@types/common'

export const useCommonStore = defineStore('common', () => {
  // Common 공통로딩
  const isLoading = ref<boolean>(false)
  const setLoading = (state: boolean) => {
    isLoading.value = state
  }

  // Common 현재 채널코드, 현재 채널번호
  const channelCode = ref<keyof TChannelCode>((document.location.href.match(/(brandi|hiver|seoulstore|selpi)/)?.[0] as keyof TChannelCode) ?? 'brandi')
  const channelNo = computed<TChannelNo[keyof TChannelNo]>(() => SERVICE_NO[channelCode.value])
  const setChannelCode = (code: keyof TChannelCode) => {
    channelCode.value = code
  }

  return { isLoading, setLoading, channelCode, channelNo, setChannelCode }
})
