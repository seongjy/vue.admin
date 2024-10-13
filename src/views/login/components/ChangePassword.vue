<script setup lang="ts">
import { inject, onMounted, ref, toRefs, reactive } from 'vue'
import { Form } from 'ant-design-vue'
import { AdminApi } from '@/api'
import { useNotification } from '@compositions/useNotification'

const { formStatus: loginFormStatus, login } = inject('providerFormStatus')
const { statusResponse, setStatusResponse } = inject('providerStatusResponse')
const { loginStatus } = toRefs(statusResponse.value)

const isVisible = ref<boolean>(false)
const formStatus = reactive<{ newPassword: string; newPasswordConfirm: string }>({
  newPassword: '',
  newPasswordConfirm: '',
})
const rules = {
  newPassword: [
    { required: true, message: '새 비밀번호를 입력해주세요.' },
    { min: 8, message: '8자 이상 입력해주세요.' },
    { max: 20, message: '20자 이하로 입력해주세요.' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])(?!.*[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{8,20}$/,
      message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
    },
    {
      validator: (_, value) => {
        return !/(.)\1\1/.test(value) ? Promise.resolve() : Promise.reject('비밀번호에 연속된 숫자를 3회 이상 사용할 수 없습니다.')
      },
    },
    {
      validator: (_, value) => {
        return !/(012|123|234|345|456|567|678|789)/.test(value) ? Promise.resolve() : Promise.reject('비밀번호에 연속된 숫자를 3회 이상 사용할 수 없습니다.')
      },
    },
  ],
  newPasswordConfirm: [
    { required: true, message: '새 비밀번호 확인을 입력해주세요.' },
    {
      validator: (_, value) => {
        return value === formStatus.newPassword ? Promise.resolve() : Promise.reject('비밀번호가 일치하지 않습니다.')
      },
    },
  ],
}
const isLoading = ref<boolean>(false)

const useForm = Form.useForm
const { validate, validateInfos } = useForm(formStatus, reactive(rules))

const { showToast } = useNotification()

const adminApi = new AdminApi()

const changePassword = async () => {
  await validate()

  try {
    isLoading.value = true

    const payload = {
      accountId: loginFormStatus.username,
      password: loginFormStatus.password,
      newPassword: formStatus.newPassword,
      newPasswordRe: formStatus.newPassword,
    }

    await adminApi.postAccountsChangePassword(payload)

    showToast({ type: 'success', message: '비밀번호가 변경되었습니다. 로그인 해주세요.' })
    isVisible.value = false
    setStatusResponse()
  } catch (error) {
    showToast({ message: error?.response?.data?.error.message || '[문의-TECH-플랫폼] 채널로 문의바랍니다.' })
  } finally {
    isLoading.value = false
  }
}
const changePasswordLater = () => {
  isVisible.value = false
  login()
}

onMounted(() => {
  isVisible.value = true
})
</script>

<template>
  <a-modal v-model:open="isVisible" width="320px" :mask-closable="false" :closable="false" title="비밀번호 변경">
    <p v-if="loginStatus === 'tempPassword'" class="text-[12px] break-keep">임시 비밀번호로 로그인 하셨습니다.<br />비밀번호를 변경해주세요.</p>
    <p v-else class="text-[12px] break-keep">
      개인정보 유출을 방지하고 보호하기 위해 3개월마다 비밀번호 변경을 권장하고 있습니다. <br />비밀번호를 변경해주세요.
    </p>

    <a-form class="change-password-form" label-align="left" :label-col="{ span: 24 }">
      <a-form-item block label="새 비밀번호" v-bind="validateInfos.newPassword">
        <a-input-password v-model:value="formStatus.newPassword" :style="{ width: '100%' }" placeholder="새 비밀번호를 입력해주세요" allow-clear />
      </a-form-item>
      <a-form-item block label="새 비밀번호 확인" v-bind="validateInfos.newPasswordConfirm">
        <a-input-password v-model:value="formStatus.newPasswordConfirm" :style="{ width: '100%' }" placeholder="새 비밀번호 확인을 입력해주세요" allow-clear />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-button v-if="loginStatus === 'changePassword'" @click="changePasswordLater">7일 후에 변경</a-button>
      <a-button html-type="submit" type="primary" :loading="isLoading" @click.prevent="changePassword">비밀번호 변경</a-button>
    </template>
  </a-modal>
</template>

<style scoped>
.change-password-form :deep(.ant-form-item-label-left) {
  padding-bottom: 0;
}
</style>
