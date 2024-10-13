<script setup lang="ts">
import Icon from '@/components/icons'
import switchLogoHiver from '@/assets/img/switch_logo_h.png'
import switchLogoBrandi from '@/assets/img/switch_logo_b.png'
import { useCommonStore } from '@stores/common'
import { computed, ref } from 'vue'
import { TChannelCode } from '@types/common'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'

const commonStore = useCommonStore()
const isBrandi = computed(() => commonStore.channelCode === 'brandi')
const switcher = [
  { src: switchLogoBrandi, name: '브랜디', style: { width: '130px' }, key: 'brandi' },
  { src: switchLogoHiver, name: '하이버', style: { width: '130px' }, key: 'hiver' },
]

const isVisible = ref(false)
const openChange = (open: boolean) => (isVisible.value = open)
const handleSwitch = (key: keyof TChannelCode) => {
  if (commonStore.channelCode === key) return

  // todo : 채널 변경
}
</script>
<template>
  <RouterLink to="/">
    <Icon.Logo :img-width="isBrandi ? '170px' : '120px'" />
  </RouterLink>
  <a-dropdown :trigger="['click']" :placement="'bottomRight'" :arrow="{ pointAtCenter: true }" @open-change="openChange">
    <UpOutlined v-if="isVisible" class="text-white" @clck.prevent />
    <DownOutlined v-else class="text-white" @clck.prevent />

    <template #overlay>
      <a-menu>
        <a-menu-item v-for="item in switcher" :key="item.key">
          <button @click="handleSwitch(item.key)"><img :src="item.src" :alt="item.name" :style="item.style" @click="handleSwitch(item.key)" /></button>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
