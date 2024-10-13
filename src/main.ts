import { createApp, provide, readonly, ref } from 'vue'
import { createPinia } from 'pinia'
// Global styles
import 'ant-design-vue/dist/reset.css'
import './assets/main.css'
// Library
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(Antd)
app.use(VueQueryPlugin, { enableDevtoolsV6Plugin: true })

// Global variable example
/*app.config.globalProperties.$ENV = {
  nodeName: import.meta.env.VITE_NODE_ENV,
  // Add more global variables here
}*/

// Global Provide
const IS_MAINTENANCE = ref<boolean>(false)
const MAINTENANCE_MESSAGE = ref<string | null>(null)
app.provide('nodeName', import.meta.env.VITE_NODE_ENV)
app.provide('maintenance', {
  isMaintenance: readonly(IS_MAINTENANCE),
  maintenanceMessage: readonly(MAINTENANCE_MESSAGE),
  setMaintenance: (isMaintenance?: boolean, message?: string) => {
    IS_MAINTENANCE.value = isMaintenance ?? false
    MAINTENANCE_MESSAGE.value = message ?? null
  },
})

app.mount('#app')
