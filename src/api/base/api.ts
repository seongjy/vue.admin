import axios, { CancelTokenSource, AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from 'axios'
import router from '@/router'
import { useNotification } from '@compositions/useNotification'
import { TChannelNo, TApiResponseWrapper } from '@types/common'
import { useCommonStore } from '@stores/common'
import { useCookie } from '@compositions/useCookie'
import { inject } from 'vue'

export type ApiConfig = { token?: string }
export type AxiosInstanceConfig = {
  baseURL: string
  headers?: { [key: string]: string | number | object | null | undefined | void }
  [key: string]: string | number | object | null | undefined | void
}

const SEC = 1000
const SESSION_TIMEOUT = 1 // 1시간

abstract class Api {
  public token: string | null | undefined
  public domain: string
  public TIME_OUT = SEC * 30 // 30초
  public axios: AxiosInstance
  public cancelToken: CancelTokenSource | null = null
  public commonStore = useCommonStore()
  public notification = useNotification()
  public maintenance = null
  public cookie = useCookie()

  constructor({ baseURL, token, ...configs }: ApiConfig & AxiosInstanceConfig) {
    const { getCookie } = this.cookie
    this.domain = baseURL
    this.token = token || getCookie('token')
    this.maintenance = inject('maintenance')

    const channelNo: TChannelNo[keyof TChannelNo] = this.commonStore.channelNo ?? 1
    const config = {
      baseURL: this.domain as string,
      timeout: this.TIME_OUT,
      headers: { 'Service-No': channelNo },
      ...configs,
    }

    if (this.token) {
      config['headers']['Authorization'] = 'Token c2VvbmdqeTcyQGJyYW5kaS5jby5rcg==:739c48bbb689c8b9c6a3f73bbf10233d.1726804338' || this.token
    }

    // config['headers']['referer-type'] = 'master-admin'

    switch (this.domain) {
      case import.meta.env.VITE_ADMIN_API_V2:
        config['headers']['service-no'] = 1
        config['headers']['solution-no'] = 6
        config['headers']['b-referer'] = location.href
        break
      case import.meta.env.VITE_ADMIN_API_V3:
        config['headers']['referer-type'] = 'new-admin'
        break
    }

    this.axios = axios.create(config as CreateAxiosDefaults)

    this.axios.interceptors.response.use(this.onResponse.bind(this), this.onError.bind(this))
    this.axios.interceptors.request.use(this.onRequest.bind(this), undefined)
  }

  onServerErrorHandler(error: AxiosError<TApiResponseWrapper>) {
    const { showToast } = this.notification
    if (error.response && error.response.data?.error?.code) {
      switch (error.response.data.error.code) {
        // 인증만료 or 토큰 유효성 검사 실패
        case 401:
        case 403:
          router.push('/logout')
          showToast({ message: error.response.data.error?.message || '인증이 만료되었습니다. 로그인을 해주세요.' })
          break
        // 메인터넌스
        case 503:
          this.maintenance.setMaintenance(true, error.response.data.error.message)
          router.push('/maintenance')
          break
        case 500:
        case 400:
          // order-api 에러 공통처리
          // admin-api 에러 공통처리
          // * 그 외 API 는 에러처리 별도 구현 필요
          if (
            error.request?.responseURL.includes('https://order-api') ||
            error.request?.responseURL.includes('https://admin-api') ||
            error.request?.responseURL.includes('https://seller-api')
          ) {
            // this.commonStore.commit('closeErrorBanner')
            this.commonStore.setLoading(false)
            showToast({ message: error.response.data.error.message || '[문의-TECH-플랫폼] 채널로 문의바랍니다.' })
          }
          break
        case 404:
          this.commonStore.setLoading(false)
          // this.store.commit('openErrorBanner', { text: error.response.data.error.message, type: 'error' })
          break
      }
    }
  }

  onError(error: AxiosError<TApiResponseWrapper>) {
    switch (true) {
      case axios.isCancel(error): // Axios 중복 요청 에러 처리
        return Promise.reject(error)
      case !!error.response: // 서버 에러 처리
        this.onServerErrorHandler(error)
        return Promise.reject(error)
      default:
        this.commonStore.setLoading(false)
        // this.store.commit('setMaintenanceText', { text: null, isMaintenance: false })
        // this.store.commit('openErrorBanner', error.response?.data?.error?.message || error)
        return Promise.reject(error)
    }
  }

  onParamsEscape(params: URLSearchParams) {
    const URL = new URLSearchParams()

    for (const key in params) {
      if (params[key] !== null && params[key] !== undefined) {
        URL.append(key, params[key])
      }
    }

    return URL
  }

  onQueryStringEscape(url: string) {
    if (url.includes('?')) {
      const [baseUrl, queryString] = url.split('?')
      const URL = new URLSearchParams(queryString)

      for (const key of URL.keys()) {
        if (URL.get(key) === '' || URL.get(key) === null || URL.get(key) === undefined) {
          URL.delete(key)
        }
      }

      return baseUrl + (URL.toString() && `?${URL.toString()}`)
    }

    return url
  }

  onRequest(config: AxiosRequestConfig) {
    const { showToast } = this.notification
    const { getCookie } = this.cookie

    // localStorage에 sesstionTime 있으면 현재시간과 비교해 넘었으면 로그아웃
    if (getCookie('token') && localStorage.getItem('sessionTime')) {
      const sessionTime = Number(localStorage.getItem('sessionTime'))
      const nowTime = new Date().getTime()
      const diffTime = nowTime - sessionTime
      const diffHour = Math.floor(diffTime / 1000 / 60 / 60)

      if (diffHour >= SESSION_TIMEOUT && import.meta.env.NODE_ENV !== 'development') {
        router.push('/logout')
        showToast({ message: '인증이 만료되었습니다. 로그인을 해주세요.' })
        localStorage.removeItem('sessionTime')

        return Promise.reject()
      }
    }

    // localStorage에 sesstionTime 저장
    localStorage.setItem('sessionTime', String(new Date().getTime()))

    // 호출 API 공통처리(URL escape)
    config.params = this.onParamsEscape(config.params)
    config.url = this.onQueryStringEscape(config.url as string)

    return config
  }

  onResponse(response: AxiosResponse<TApiResponseWrapper>) {
    console.log(`%c[Response API URL(${response.config.method.toUpperCase()})] `, 'font-weight:bold;color:skyblue;', response.config.url)
    console.log(`%c[Response body] `, 'font-weight:bold;color:skyblue;', response.data)
    return Promise.resolve(response)
  }

  console(API, requestType, payload?) {
    if (import.meta.env.VITE_NODE_ENV === 'production') return

    return (
      console.log(`%c[Request API URL(${requestType ?? '-'})] `, 'font-weight:bold;', API),
      payload && console.log(`%c[PAYPLOAD] `, 'font-weight:bold;', payload)
    )
  }

  /**
   * GET 요청
   * @param URL
   * @param params (not required)
   * @param configs (not required)
   */
  requestGet<T>(URL: string, params?: object, configs?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // 중복 요청 취소
    if (this.cancelToken) {
      this.cancelToken.cancel()
    }

    this.cancelToken = axios.CancelToken.source()
    this.console(URL, 'GET', params)

    return this.axios.get(URL, {
      ...configs,
      params: params,
      cancelToken: this.cancelToken.token,
    })
  }

  /**
   * POST 요청
   * @param URL
   * @param data (body) (not required)
   * @param configs (not required)
   */
  requestPost<T>(URL: string, data?: object, configs?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // 중복 요청 취소
    if (this.cancelToken) {
      this.cancelToken.cancel()
    }

    this.cancelToken = axios.CancelToken.source()
    this.console(URL, 'POST', data)

    return this.axios.post(URL, data, {
      ...configs,
      cancelToken: this.cancelToken.token,
    })
  }

  /**
   * PUT 요청
   * @param URL
   * @param data (body) (not required)
   * @param configs (not required)
   */
  requestPut<T>(URL: string, data?: object, configs?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // 중복 요청 취소
    if (this.cancelToken) {
      this.cancelToken.cancel()
    }

    this.cancelToken = axios.CancelToken.source()
    this.console(URL, 'PUT', data)

    return this.axios.put(URL, data, {
      ...configs,
      cancelToken: this.cancelToken.token,
    })
  }

  /**
   * PATCH 요청
   * @param URL
   * @param data (body) (not required)
   * @param configs (not required)
   */
  requestPatch<T>(URL: string, data?: object, configs?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // 중복 요청 취소
    if (this.cancelToken) {
      this.cancelToken.cancel()
    }

    this.cancelToken = axios.CancelToken.source()
    this.console(URL, 'PATCH', data)

    return this.axios.patch(URL, data, {
      ...configs,
      cancelToken: this.cancelToken.token,
    })
  }

  /**
   * DELETE 요청
   * @param URL
   * @param configs (not required)
   */
  requestDelete<T>(URL: string, configs?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // 중복 요청 취소
    if (this.cancelToken) {
      this.cancelToken.cancel()
    }

    this.cancelToken = axios.CancelToken.source()
    this.console(URL, 'DELETE')

    return this.axios.delete(URL, {
      ...configs,
      cancelToken: this.cancelToken.token,
    })
  }
}

export default Api
