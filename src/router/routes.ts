import { RouteRecordRaw } from 'vue-router'
import { useCookie } from '@compositions/useCookie'

const { getCookie, removeCookie } = useCookie()

// 페이지 목록 정의
export const routes: RouteRecordRaw[] = [
  { path: '/ping', redirect: '/' }, // for health check
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@views/login/index.vue'),
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import(/* webpackChunkName: "logout" */ '@views/logout/index.vue'),
    beforeEnter: (to, from, next) => {
      return getCookie('token') ? next() : next('/login')
    },
  },
  {
    path: '',
    component: () => import('@components/layout/Layout.vue'),
    children: [
      { path: '', redirect: '/noticesSettings/notices' },
      { path: '/noticesSettings', redirect: '/noticesSettings/notices' },
      {
        path: '/noticesSettings/notices',
        name: 'adminNotices',
        meta: { parentTitle: '공지사항 관리', title: '브랜디 공지사항', subTitle: '목록' },
        component: () => import(/* webpackChunkName: "adminNotices" */ '@views/notices/index.vue'),
      },
      {
        path: '/noticesSettings/notices/:id(\\d+)',
        name: 'adminNoticesDetail',
        meta: { parentTitle: '공지사항 관리', title: '브랜디 공지사항', subTitle: '수정' },
        component: () => import(/* webpackChunkName: "adminNoticesDetail" */ '@views/notices/details/index.vue'),
      },
      {
        path: '/noticesSettings/notices/regist',
        name: 'adminNoticesRegister',
        meta: { parentTitle: '공지사항 관리', title: '브랜디 공지사항', subTitle: '등록' },
        component: () => import(/* webpackChunkName: "adminNoticesRegister" */ '@views/notices/register/index.vue'),
      },
      {
        path: '/noticesSettings/clientNotices',
        name: 'clientNotices',
        meta: { parentTitle: '공지사항 관리', title: '고객 공지사항', subTitle: '목록' },
        component: () => import(/* webpackChunkName: "adminNotices" */ '@views/clientNotices/index.vue'),
      },
      {
        path: '/noticesSettings/clientNotices/:id(\\d+)',
        name: 'clientNoticesDetail',
        meta: { parentTitle: '공지사항 관리', title: '고객 공지사항', subTitle: '수정' },
        component: () => import(/* webpackChunkName: "adminNoticesDetail" */ '@views/notices/details/index.vue'),
      },
      {
        path: '/noticesSettings/clientNotices/regist',
        name: 'clientNoticesRegister',
        meta: { parentTitle: '공지사항 관리', title: '고객 공지사항', subTitle: '등록' },
        component: () => import(/* webpackChunkName: "adminNoticesRegister" */ '@views/notices/register/index.vue'),
      },
    ],
    beforeEnter: (to, from, next) => {
      return getCookie('token') ? next() : next('/login')
    },
  },
  {
    path: '/maintenance',
    name: 'maintenance',
    component: () => import(/* webpackChunkName: "maintenance" */ '@/views/Maintenance.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import(/* webpackChunkName: "not-found" */ '@/views/NotFound.vue'),
    beforeEnter: (to, from, next) => {
      return getCookie('token') ? next() : next('/login')
    },
  },
]
