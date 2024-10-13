<template>
  <a-form-item>
    <a-button ghost block @click="isVisible = true">OTP 등록 & 인증 방법</a-button>
  </a-form-item>

  <a-modal v-model:open="isVisible" width="400px" :mask-closable="false" :closable="false" :title="dialogTitle">
    <!-- STEP QR 입력 -->
    <template v-if="['QRCodeImage', 'QRCode'].includes(currentStep)">
      <p class="text-[12px]">
        마스터(개인정보취급자)의 경우 Google OTP 가입 후 로그인 가능합니다. <br />
        먼저
        <a href="https://play.google.com/store/search?q=google%20otp&c=apps&hl=ko-KR" class="text-link" target="_blank"> Google Play 스토어 </a> 또는
        <a href="https://apps.apple.com/kr/app/google-authenticator/id388497605" class="text-link" target="_blank">iOS App Store</a>
        에서 Google OTP를 다운로드합니다.
      </p>

      <!-- CASE 이미지로 스캔 -->
      <template v-if="currentStep === 'QRCodeImage'">
        <ul class="bg-[#f0f0f0] p-10 px-30 text-[12px]">
          <li>Google OTP 앱에서 + 를 클릭합니다.</li>
          <li>QR 코드 스캔을 선택합니다.</li>
          <li>아래의 QR 코드를 스캔합니다.</li>
        </ul>

        <div class="text-center mb-10">
          <a-space direction="vertical" align="center">
            <a-image :src="QRStatus.qrcodeUrl" :width="100" />
          </a-space>
        </div>
        <p class="text-[12px] bg-[#f0f0f0] text-center p-5">스캔이 안되는 경우 <a href="#" @click="currentStep = 'QRCode'">설정 키 입력</a></p>
      </template>
      <!-- CASE 설정키로 등록 -->
      <template v-if="currentStep === 'QRCode'">
        <ul class="bg-[#f0f0f0] p-10 px-30 text-[12px]">
          <li>Google OTP 앱에서 + 를 클릭합니다.</li>
          <li>설정 키 입력을 선택 합니다.</li>
          <li>계정에는 사이트에 대한 별칭을 입력합니다.</li>
          <li>아래의 설정키를 휴대폰의 키 입력란에 입력합니다.</li>
          <li>기준 값은 시간 기준으로 하고 등록합니다.</li>
        </ul>

        <a-input-group compact class="mb-10">
          <a-input v-model:value="QRStatus.secretKey" addon-before="설정키" readonly style="width: calc(100% - 32px)" />
          <a-tooltip title="클립보드로 복사">
            <a-button @click="copy(QRStatus.secretKey)">
              <template #icon><CopyOutlined /></template>
            </a-button>
          </a-tooltip>
        </a-input-group>

        <p class="text-[12px] bg-[#f0f0f0] text-center p-5">스캔으로 설정 시 <a href="#" @click="currentStep = 'QRCodeImage'">QA 코드 스캔</a></p>
      </template>
    </template>
    <!-- STEP OTP 인증 -->
    <template v-else>
      <p class="text-[12px] bg-[#f0f0f0] text-center p-5 mt-20">모바일에 표시된 6자리 코드를 입력하세요.</p>
      <a-form ref="formRef" :model="formState" @finish="onSubmit">
        <a-form-item name="otpCode" :rules="rules">
          <a-input v-model:value="formState.otpCode" class="mb-10" placeholder="코드 입력" @press-enter="onSubmit" />
        </a-form-item>
      </a-form>
    </template>

    <template #footer>
      <a-button key="back" @click="isVisible = false">취소</a-button>
      <a-button
        key="submit"
        :html-type="['QRCodeImage', 'QRCode'].includes(currentStep) ? 'button' : 'submit'"
        type="primary"
        @click="['QRCodeImage', 'QRCode'].includes(currentStep) ? (currentStep = 'Certification') : onSubmit()">
        다음
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, watch } from 'vue'
import { AdminApi } from '@/api'
import { IQRcodeResponse, IOTPJoin } from '@types/admin'
import { CopyOutlined } from '@ant-design/icons-vue'
import { useClipboard } from '@vueuse/core'
import { useNotification } from '@compositions/useNotification'

const { copy } = useClipboard()
const adminApi = new AdminApi()

const providerStatusResponse = inject('providerStatusResponse')
const { formStatus: loginFormStatus } = inject('providerFormStatus')

const isVisible = ref(false)
const currentStep = ref<'QRCodeImage' | 'QRCode' | 'Certification'>('QRCodeImage')
const dialogTitle = computed<string>(() => (currentStep.value === 'Certification' ? 'OTP 인증' : 'OTP QR 스캔'))
const QRStatus = reactive<IQRcodeResponse>({ qrcodeUrl: '', secretKey: '' })

// 모달 초기화
const stateQRCode = ref<'loading' | 'active' | 'expired' | 'scanned'>('scanned')
const getOTPQr = () => {
  stateQRCode.value = 'loading'
  QRStatus.qrcodeUrl = ''
  QRStatus.secretKey = ''
  formState.otpCode = ''

  adminApi
    .getOTPQr(loginFormStatus.username)
    .then((res) => {
      const { qrcodeUrl, secretKey } = res.data.data
      QRStatus.qrcodeUrl = qrcodeUrl
      QRStatus.secretKey = secretKey || ''
      stateQRCode.value = 'active'
    })
    .catch(() => {
      stateQRCode.value = 'expired'
    })
    .finally(() => {
      currentStep.value = 'QRCodeImage'
    })
}
watch(
  () => isVisible.value,
  (value) => {
    if (value) {
      getOTPQr()
    }
  },
)

// 인증처리 API 호출
const formRef = ref<null | HTMLFormElement>(null)
const formState = reactive({ otpCode: '' })
const rules = [
  { required: true, message: '코드를 입력해주세요.', trigger: 'blur' },
  { len: 6, message: '6자리 코드를 입력해주세요.', trigger: 'blur' },
  { pattern: /^[0-9]+$/, message: '숫자만 입력해주세요.', trigger: 'blur' },
]
const { showToast } = useNotification()
const onSubmit = () => {
  formRef.value?.validate().then((res) => {
    const payload: IOTPJoin = {
      certificationCode: res.otpCode,
      secretKey: QRStatus.secretKey,
      accountId: loginFormStatus.username,
    }

    adminApi.postOTPJoin(payload).then(() => {
      isVisible.value = false
      showToast({ type: 'success', message: 'OTP 등록이 완료되었습니다. 로그인해 주세요.' })
      providerStatusResponse.setStatusResponse()
    })
  })
}

onMounted(() => {
  if (loginFormStatus?.username) {
    isVisible.value = true
  }
})
</script>
