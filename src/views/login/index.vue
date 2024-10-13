<script setup lang="ts">
import { onMounted, provide, reactive, ref, defineAsyncComponent, computed, readonly } from 'vue'
import { useCookie, useNotification } from '@/compositions'
import { useCommonStore } from '@stores/common'
import Icon from '@components/icons'
import Footer from '@components/layout/Footer.vue'
import Confirm from '@components/common/Confirm.vue'
import FindPassword from './components/FindPassword.vue'
import { AdminApi } from '@/api'
import { ILoginStatusResponse, TLoginStatus, ILoginRequest } from '@types/admin'
import { useRouter } from 'vue-router'
import { LOGIN_STATUS_MESSAGE } from '@constants/common'

const { setCookie, getCookie } = useCookie()
const { channelNo } = useCommonStore()
const { showToast } = useNotification()
const router = useRouter()
const adminApi = new AdminApi()

type TCommonConfirm = { isVisible: boolean; html: string; title: string; confirm: () => void }
type TFormStatus = { username: string; password: string; certificationCode?: string }
type TFormRules = { [key: 'username' | 'password' | 'certificationCode']: { required: boolean; message: string }[] }

// Login
const nodeName = import.meta.env.VITE_NODE_ENV
const formRules: TFormRules = {
  username: [{ required: true, message: '아이디를 입력해주세요.' }],
  password: [{ required: true, message: '비밀번호를 입력해주세요.' }],
  certificationCode: [{ required: true, message: '인증번호를 입력해주세요.' }],
}
const formStatus = reactive<TFormStatus>({
  username: 'seongjy72@brandi.co.kr',
  password: 'brandi2@',
  certificationCode: '',
})
const isRememberId = ref<boolean>(false)
const isLoading = ref<boolean>(false)

// Login Status Case
const commonConfirm = reactive<TCommonConfirm>({ isVisible: false, html: '', title: '', confirm: null })
const statusResponse = ref<ILoginStatusResponse | null>(null)

// 로그인 상태에 따른 동적 컴포넌트
const asyncComponent = computed<ReturnType<typeof defineAsyncComponent> | null>(() => {
  switch (statusResponse.value?.loginStatus as TLoginStatus) {
    case 'TFACertificationJoin':
      return defineAsyncComponent(() => import('./components/TFACertificationJoin.vue'))
    case 'failWaitingTime':
      return defineAsyncComponent(() => import('./components/FailWaitingTimer.vue'))
    case 'changePassword':
    case 'changePasswordNow':
    case 'tempPassword':
      return defineAsyncComponent(() => import('./components/ChangePassword.vue'))
    default:
      return null
  }
})
const handlerLoginStatusCase = () => {
  const { loginStatus, failCount, message: errorMessage } = statusResponse.value as ILoginStatusResponse
  const message: string = LOGIN_STATUS_MESSAGE[loginStatus] || '관리자에게 문의바랍니다.'

  switch (loginStatus as TLoginStatus) {
    case 'passwordError':
      showToast({ type: 'error', message: errorMessage + ` (${5 - failCount}회 남음)` })
      return
    case 'TFACertification':
    case 'dormantRestoreInProgress':
      showToast({ type: 'info', message: message })
      return
    case 'excessFail':
    case 'failWaitingTime':
      showToast({ type: 'error', message: message })
      return
    case 'accountLock':
      commonConfirm.title = '잠금 해제'
      commonConfirm.html = message
      commonConfirm.isVisible = true
      return
  }
}

// Login API Call
const onSubmit = async () => {
  const payload: ILoginRequest = { accountId: formStatus.username.trim(), password: formStatus.password.trim() }

  // case OTP 인증번호
  if (statusResponse.value?.loginStatus === 'TFACertification') {
    payload['certificationCode'] = formStatus.certificationCode
    payload['type'] = 'TFACertify'
  }
  // case 비밀번호(7일연장 불가능)
  if (statusResponse.value?.loginStatus === 'changePasswordNow') {
    payload['type'] = 'changePwLater'
  }

  try {
    isLoading.value = true
    const response = await adminApi.postSellerLogin(payload)
    const { status, statusResponse: caseResponse, successResponse } = response.data.data

    // CASE 정상 로그인
    if (status === 'success') {
      setCookie('remember-id', formStatus.username)
      setCookie('username', formStatus.username)
      setCookie('token', successResponse?.accessToken)
      setCookie('serviceNo', channelNo)
      router.push('/')
      return
    }

    // CASE 로그인 시 추가사항 확인 필요
    statusResponse.value = caseResponse
    handlerLoginStatusCase()
  } catch (error) {
    console.log('error', error)
  } finally {
    isLoading.value = false
  }
}
const onFinishFailed = () => {
  showToast({ type: 'error', message: '아이디와 비밀번호를 입력해주세요.' })
}
// Mounted
onMounted(() => {
  if (getCookie('remember-id')) {
    formStatus.username = getCookie('remember-id')
    isRememberId.value = true
  }
})

// Provide
provide('providerFormStatus', {
  formStatus: readonly(formStatus),
  login: onSubmit,
})
provide('providerStatusResponse', {
  statusResponse: readonly(statusResponse),
  setStatusResponse: (value?: ILoginStatusResponse) => {
    statusResponse.value = value || null
  },
})
</script>

<template>
  <a-layout-content class="bg-primary text-white">
    <div class="flex justify-center text-center items-center height-login">
      <div class="flex-col -mt-[100px]">
        <div class="w-[300px] text-center">
          <p class="uppercase mb-10 text-center text-sm tracking-[5px]">{{ nodeName }}</p>
          <h1 class="flex justify-center">
            <span class="mr-[12px]">
              <Icon.Logo />
            </span>
            <span class="text-h5 mt-1 self-center whitespace-nowrap align-top text-base opacity-70">관리자 어드민</span>
          </h1>
          <div class="login-form max-w-[340px] px-5 pt-[30px] text-left">
            <a-form :model="formStatus" name="loginForm" :rules="formRules" @finish="onSubmit" @finish-failed="onFinishFailed">
              <a-form-item name="username">
                <a-input v-model:value="formStatus.username" placeholder="아이디" />
              </a-form-item>
              <a-form-item name="password">
                <a-input-password v-model:value="formStatus.password" placeholder="비밀번호" />
              </a-form-item>
              <!-- case OTP 인증번호 -->
              <a-form-item v-if="statusResponse?.loginStatus === 'TFACertification'" name="certificationCode">
                <a-input v-model:value="formStatus.certificationCode" placeholder="OTP 인증번호" />
              </a-form-item>
              <!-- case OTP 등록/임시 비밀번호 변경/비밀번호 변경 -->
              <component :is="asyncComponent" v-if="asyncComponent" />

              <a-form-item>
                <a-button html-type="submit" type="primary" :loading="isLoading" block>로그인</a-button>
              </a-form-item>
            </a-form>

            <a-flex justify="space-between" align="center">
              <a-checkbox v-model:checked="isRememberId" class="checkbox-id-save text-white text-[12px]">아이디 저장</a-checkbox>
              <FindPassword />
            </a-flex>
          </div>
        </div>
      </div>
    </div>
  </a-layout-content>

  <Footer />

  <!-- OTP(TFA) 등록 -->
  <Confirm v-model="commonConfirm.isVisible" :html="commonConfirm.html" :title="commonConfirm.title" :confirm="commonConfirm.confirm" />
</template>

<style scoped lang="scss">
.login-form :deep(.ant-input-group-addon) {
  background-color: #fff;
  border-left: 1px solid #d9d9d9;
}
.height-login {
  height: calc(100vh - 50px);
}
</style>
