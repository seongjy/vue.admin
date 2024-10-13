<script setup lang="ts">
import { provide } from 'vue'
import { RouterView } from 'vue-router'
import { breakpointsAntDesign, useBreakpoints } from '@vueuse/core'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools' // Development VueQuery DevTools

// Provide UI breakpoint
const breakpoints = useBreakpoints(breakpointsAntDesign)
const activeBreakpoint = breakpoints.active()
provide('breakpoints', {
  active: activeBreakpoint,
  smallerSm: breakpoints.smaller('sm'),
  smallerMd: breakpoints.smaller('md'),
})
</script>

<template>
  <a-layout>
    <RouterView />
  </a-layout>
  <VueQueryDevtools :button-position="'bottom-left'" :initial-is-open="true" />
</template>
