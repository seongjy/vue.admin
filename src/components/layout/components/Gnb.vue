<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    class="gnb"
    mode="inline"
    theme="dark"
    :items="menus"
    :style="customCss"
    @click="handleClick" />
</template>

<script setup lang="ts">
import { ref, h, computed } from 'vue'
import { MailOutlined, CalendarOutlined, AppstoreOutlined, SettingOutlined, NotificationOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const openKeys = ref(['/noticesSettings'])
const selectedKeys = ref(['/notices'])
const menus = computed(() => {
  // todo
  return [
    {
      key: '/noticesSettings',
      icon: () => h(NotificationOutlined),
      label: '공지사항 관리',
      children: [
        { key: '/notices', label: `브랜디 공지사항` },
        { key: '/clientNotices', label: '고객 공지사항' },
      ],
    },
  ]
})

const customCss = {
  backgroundColor: 'transparent',
}

const router = useRouter()
const handleClick = ({ keyPath }) => router.push(keyPath.join(''))
</script>

<style scoped lang="scss">
.gnb :deep(.ant-menu.ant-menu-sub) {
  background: transparent;
}
.gnb :deep(.ant-menu-item-selected) {
  background: #414247;
}
.gnb :deep(.ant-menu-submenu-title[aria-expanded='true']) {
  //background: #27272b;
}
</style>
