<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useCommonStore } from '@stores/common'

import brandiLogo from '@/assets/img/logo_b.png'
import hiverLogo from '@/assets/img/logo_h.png'
import seoulstoreLogo from '@/assets/img/logo_s.png'
import selpiLogo from '@/assets/img/logo_selpi2.png'
import helpiLogo from '@/assets/img/logo_helpi.png'

const props = defineProps({ imgWidth: { type: String, default: '' }, channelCode: { type: String, default: '' } })
const { channelCode } = useCommonStore()
const logos = {
  brandi: { src: brandiLogo, name: '브랜디', width: '200px' },
  hiver: { src: hiverLogo, name: '하이버', width: '120px' },
  seoulstore: { src: seoulstoreLogo, name: '서울스토어', width: '196px' },
  helpi: { src: helpiLogo, name: '헬피', width: '160px' },
  selpi: { src: selpiLogo, name: '셀피', width: '140px' },
}

const serviceLogo = computed(() => logos[props.channelCode || channelCode])
const { src, name, width } = toRefs(serviceLogo.value)
</script>

<template>
  <img :src="src" :alt="name" :style="{ width: props.imgWidth || width }" />
</template>
