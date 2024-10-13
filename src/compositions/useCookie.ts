import { useCookies } from '@vueuse/integrations/useCookies'
import * as universal_cookie from 'universal-cookie'

export const useCookie = () => {
  const cookies = useCookies([])
  const oneDayInSec = 60 * 60 * 24 // 1일 초 단위로 변환
  const globalProperties: universal_cookie.CookieSetOptions = {
    path: '/',
    domain: '',
    secure: !(import.meta.env.VITE_NODE_ENV === 'development'),
    httpOnly: false,
    maxAge: 7 * oneDayInSec, // defalut 7일
    // expires: '7d',
  }

  const getCookie = (cookie) => cookies.get(cookie)
  const removeCookie = cookies.remove
  const setCookie = (name: string, value: string | number | [] | object, options?: universal_cookie.CookieSetOptions) => {
    return cookies.set(name, value, { ...globalProperties, ...options })
  }
  return {
    oneDayInSec,
    setCookie,
    getCookie,
    removeCookie,
  }
}
