import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useServiceStore = defineStore('service', () => {
  // const channelCode = ref(null)
  // const currentChannelCode = computed(() => {
  //   return document.location.href.match(/(brandi|hiver|seoulstore|selpi)/)?.[0]
  // })

  return {
    // channelCode,
    // currentChannelCode,
  }
})
