import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes.ts'
import { TChannelCode } from '@types/common'
import { useCommonStore } from '@stores/common'
import { useCookie } from '@compositions/useCookie'

const { getCookie } = useCookie()

/**
 * 라우터 설정
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

/**
 * 라우터 이동 전 Hook
 * (참고) https://router.vuejs.kr/guide/advanced/navigation-guards.html#global-before-guards
 */
router.beforeEach((to, from, next) => {
  const commonStore = useCommonStore()
  const isLogin = !!getCookie('token')
  const service: keyof TChannelCode = commonStore.channelCode

  if (isLogin && to.path === '/login') {
    next('/')
    return
  }

  // Case 메인터넌스 모드인 경우 이동
  next()
})

/**
 * 컴포넌트 로컬 가드 내 비동기처리
 * 비동기 경로 컴포넌트가 해결 된 후 최종 결정을 위한 Hook
 * (참고) https://router.vuejs.kr/guide/advanced/navigation-guards.html#global-resolve-guards
 */
// router.beforeResolve(async (to) => {});

/**
 * 라우터 이동 후 Hook (대메뉴)
 * (참고) https://router.vuejs.kr/guide/advanced/navigation-guards.html#global-after-hooks
 */
// router.afterEach((to, from, failure) => {});

export default router
