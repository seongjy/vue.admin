<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useNotification } from '@compositions/useNotification'
import { AdminApi } from '@/api'
import { ISellerCertifyRequest } from '@types/admin'

const { showToast } = useNotification()
const nodeName = import.meta.env.VITE_NODE_ENV
const isVisible = ref<boolean>(false)
const verifyStatus: { id: string; phone: string; verifyCode: string } = reactive({
  id: '',
  phone: '',
  verifyCode: '',
})

const isPhoneDisabled = ref<boolean>(false)
const verifyCodeRef = ref<HTMLInputElement | null>(null)
const verifyTimeLeft = ref<number>(0)
const verifyTimeOver = ref<boolean>(false)
const verifyTimeLeftMinSecond = computed<string>(() => {
  const min = Math.floor(verifyTimeLeft.value / 60)
  const sec = verifyTimeLeft.value % 60
  return `${min}:${sec < 10 ? '0' + sec : sec}`
})

const VERIFY_CODE_TIMEOUT = 180 // seconds (3분)

const adminApi = new AdminApi()
const verifyTimer = (): void => {
  isPhoneDisabled.value = true
  verifyTimeOver.value = false
  verifyTimeLeft.value = VERIFY_CODE_TIMEOUT

  const timer = setInterval(() => {
    if (verifyTimeLeft.value > 0) {
      verifyTimeLeft.value--
    } else {
      clearInterval(timer)
      isPhoneDisabled.value = false
      verifyTimeOver.value = true
    }
  }, 1000)
}
const validate = (): boolean => {
  switch (true) {
    case !verifyStatus.id:
      showToast({ type: 'error', message: '아이디를 입력해주세요.' })
      return false
    case !verifyStatus.phone:
      showToast({ type: 'error', message: '담당자 핸드폰번호를 입력해주세요.' })
      return false
    default:
      return true
  }
}
const sendVerifyCode = async () => {
  if (!validate()) return

  const paylaod: ISellerCertifyRequest = {
    accountId: verifyStatus.id,
    phoneNumber: verifyStatus.phone,
    isFindPassword: true,
    type: 'sms',
  }

  // 관리자의 경우 문의채널로 안내
  await adminApi.postSellerCertify(paylaod)

  verifyTimer()

  setTimeout(() => {
    verifyCodeRef.value?.focus()
  }, 100)
}
const resetPhone = (): void => {
  verifyStatus.phone = ''
  verifyTimeLeft.value = 0
  verifyTimeOver.value = false
  isPhoneDisabled.value = false
}
const submitVerifyCode = (): void => {
  // TODO Submit verify code API
}
</script>

<template>
  <button
    type="button"
    class="button-find-password"
    @click="showToast({ message: `[문의-${nodeName === 'production' ? '운영' : 'TECH-플랫폼'}] 채널로 문의바랍니다.` })">
    비밀번호 찾기
  </button>

  <a-modal v-model:open="isVisible" width="300px" :mask-closable="false" :closable="false" title="비밀번호 찾기">
    <p class="text-[12px]">인증받은 핸드폰 번호로 <strong>임시 비밀번호</strong>를 문자 발송해드립니다.</p>
    <a-space direction="vertical" size="small" :style="{ width: '100%', minHeight: '120px' }">
      <a-space-compact block>
        <a-input v-model:value="verifyStatus.id" :style="{ width: '100%' }" placeholder="아이디를 입력해주세요" />
      </a-space-compact>
      <a-space-compact block>
        <a-input
          v-model:value="verifyStatus.phone"
          :style="{ width: '100%' }"
          placeholder="담당자 핸드폰번호"
          :disabled="isPhoneDisabled"
          @press-enter="sendVerifyCode" />
        <a-button v-if="isPhoneDisabled" type="primary" @click="resetPhone">재입력</a-button>
        <a-button v-else type="primary" @click="sendVerifyCode">인증번호 발송</a-button>
      </a-space-compact>
      <a-space-compact v-if="isPhoneDisabled" block>
        <a-input
          ref="verifyCodeRef"
          v-model:value="verifyStatus.verifyCode"
          :style="{ width: '100%' }"
          placeholder="인증번호 입력"
          @press-enter="submitVerifyCode" />
        <a-button type="primary" @click="submitVerifyCode">확인</a-button>
        <a-button @click="sendVerifyCode">재전송</a-button>
      </a-space-compact>
      <a-space-compact direction="vertical" class="text-[12px]">
        <p v-if="verifyTimeOver && verifyStatus.phone" style="color: red">인증시간이 만료 되었습니다.</p>
        <template v-if="isPhoneDisabled && !verifyTimeOver">
          <p>인증코드가 SMS로 전송되었습니다.</p>
          <p style="color: #1677ff">남은시간: {{ verifyTimeLeftMinSecond }}</p>
        </template>
      </a-space-compact>
    </a-space>
    <template #footer>
      <a-button key="back" @click="isVisible = false">취소</a-button>
    </template>
  </a-modal>
</template>

<style scoped>
.button-find-password {
  color: white;
  font-size: 12px;
  cursor: pointer;
  background: none;
  border: 0;
}
</style>
