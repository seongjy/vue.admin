import { ref } from 'vue'

export const useForm = (name, status, errorMsgs) => {
  const error = ref(false)
  const errorMessages = ref([])

  const validate = () => {
    error.value = !status.value
    errorMessages.value = errorMsgs.value
  }

  return {
    error,
    errorMessages,
    validate,
  }
}
