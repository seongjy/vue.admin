import { message } from 'ant-design-vue'
import type { MessageArgsProps, MessageType } from 'ant-design-vue/es/message'

type ToastType = 'success' | 'info' | 'warning' | 'error'
type ToastEventType = (content: MessageArgsProps | string, duration?: number, onClose?: () => void) => MessageType

export const useNotification = () => {
  const toasts: { [key: ToastType]: ToastEventType } = {
    success: message.success,
    info: message.info,
    warning: message.warning,
    error: message.error,
  }

  const showToast = (settings: { type?: ToastType; message: string; sec?: number }) => {
    toasts[settings.type ?? 'error'](settings.message, settings.sec || 3)
  }

  return {
    showToast,
  }
}
