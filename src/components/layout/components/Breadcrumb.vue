<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const meta = computed(() => route.meta)
const prevPath = computed(() => {
  const match = route.fullPath.match(/^(.+?)(?=\/\d+)/)
  return match ? match[1] : route.fullPath
})
</script>

<template>
  <a-page-header :title="meta.title" :sub-title="meta.subTitle" class="p-0" @back="() => $router.go(-1)" />
  <a-breadcrumb class="mb-[20px] mt-[10px] text-[12px]">
    <a-breadcrumb-item>{{ meta.parentTitle }}</a-breadcrumb-item>
    <a-breadcrumb-item>
      <a :href="prevPath">{{ meta.title }}</a>
    </a-breadcrumb-item>
    <a-breadcrumb-item>{{ meta.subTitle }}</a-breadcrumb-item>
  </a-breadcrumb>
</template>
