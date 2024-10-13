<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import Nav from '@/components/layout/Nav.vue'
import Footer from '@/components/layout/Footer.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import ErrorBoundary from './ErrorBoundary.vue'

import { RouterView } from 'vue-router'
import { h } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useCommonStore } from '@stores/common'

const indicator = h(LoadingOutlined, { style: { fontSize: '24px' }, spin: true })
const commonStore = useCommonStore()
</script>

<template>
  <Nav />
  <a-layout class="bg-[#f9f9f9]">
    <Header />

    <a-spin :indicator="indicator" :spinning="commonStore.isLoading">
      <a-layout-content class="align-center justify-center main">
        <ErrorBoundary>
          <Breadcrumb />
          <Suspense>
            <RouterView v-slot="{ Component }">
              <transition>
                <component :is="Component" />
              </transition>
            </RouterView>

            <template #fallback> 로딩중... </template>
          </Suspense>
        </ErrorBoundary>
      </a-layout-content>
    </a-spin>

    <Footer />
  </a-layout>
</template>

<style scoped lang="scss">
.main {
  padding: 24px;
  min-height: calc(100vh - 115px);
}
</style>
