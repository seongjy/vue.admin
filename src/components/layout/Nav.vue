<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCommonStore } from '@stores/common'
import { MenuOutlined } from '@ant-design/icons-vue'
import { TNodeEnv } from '@/types/common'
import ServiceSwitcher from './components/ServiceSwitcher.vue'
import Icon from '@/components/icons'
import Gnb from './components/Gnb.vue'

const commonStore = useCommonStore()
const collapsed = ref<boolean>(false)
const nodeName: TNodeEnv = import.meta.env.VITE_NODE_ENV

const breakpoints = inject('breakpoints')
const navStyle = computed<string>(() => {
  return breakpoints.smallerSm.value ? '80vw' : '220px'
})
const handleBreakpoint = (breakpoint: string): void => {
  // console.log(breakpoint)
}
</script>
<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    collapsible
    reverse-arrow
    class="bg-primary"
    breakpoint="sm"
    collapsed-width="0"
    :width="navStyle"
    @breakpoint="handleBreakpoint">
    <!--LOGO(Switcher)-->
    <div class="flex align-center mt-[20px] cursor-pointer justify-center h-[60px] items-center">
      <RouterLink v-if="['seoulstore', 'selpi'].includes(commonStore.channelCode)" to="/"> <Icon.Logo :img-width="'160px'" /> </RouterLink>
      <ServiceSwitcher v-else></ServiceSwitcher>
    </div>
    <div class="uppercase justify-center pt-[10px] pb-[10px] text-center tracking-[5px] opacity-70 text-white text-[10px]">{{ nodeName }}</div>

    <!--MENU-->
    <Gnb class="mt-20" />

    <slot name="trigger">
      <button class="button-toggle" @click="collapsed = !collapsed"><MenuOutlined /></button>
    </slot>
  </a-layout-sider>
</template>

<style scoped lang="scss">
.button-toggle {
  position: absolute;
  top: 10px;
  left: 100%;
  margin-left: 10px;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px 12px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
