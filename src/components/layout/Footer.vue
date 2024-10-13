<script setup lang="ts">
import { computed } from 'vue'
import { useService } from '@compositions/useService'

const { getServiceInfo } = useService()
const serviceInfo = computed(() => getServiceInfo())
const { COMPANY_ADDRESS, COMPANY_NAME, CS_EMAIL, COMPANY_REGISTRATION_NUMBER, BUSINESS_REPORT_NUMBER } = serviceInfo.value ?? {
  COMPANY_ADDRESS: '',
  COMPANY_NAME: '',
  CS_EMAIL: '',
  COMPANY_REGISTRATION_NUMBER: '',
  BUSINESS_REPORT_NUMBER: '',
}
</script>

<template>
  <a-layout-footer class="footer">
    <div class="text-[0.65rem] text-center">
      회사명 : {{ COMPANY_NAME }} | 주소 : {{ COMPANY_ADDRESS }} | 사업자등록번호 : {{ COMPANY_REGISTRATION_NUMBER }} | 통신판매업신고 :
      {{ BUSINESS_REPORT_NUMBER }} 이메일 : {{ CS_EMAIL }} | 2024 © brandi inc.
    </div>
  </a-layout-footer>
</template>

<style scoped lang="scss">
.footer {
  padding: 20px 15px;
  background-color: #f9f9f9f9;
}
</style>
