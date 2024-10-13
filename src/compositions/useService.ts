import { useCommonStore } from '@stores/common'
import { TChannelCode } from '@/types'
import { SERVICE_NAME } from '@/constants'
import { useCookie } from '@compositions/useCookie'

export const useService = () => {
  const commonStore = useCommonStore()

  /**
   * 서비스 정보 가져오기
   * @param service (default: 현재 서비스)
   */
  const getServiceInfo = (service: keyof TChannelCode = commonStore.channelCode) => {
    switch (service) {
      case 'brandi':
        return {
          // 사업자 등록번호
          COMPANY_REGISTRATION_NUMBER: '220-88-93187',
          // 통신판매업신고
          BUSINESS_REPORT_NUMBER: '169-87-03229',
          // 회사명
          COMPANY_NAME: '(주)뉴넥스',
          // 회사주소
          COMPANY_ADDRESS: '서울 성동구 왕십리로 125, 11층(성수동1가, 케이디타워)',
          // CS 이메일
          CS_EMAIL: 'brandis@brandi.co.kr',
        }
      case 'hiver':
        return {
          COMPANY_REGISTRATION_NUMBER: '169-87-03229',
          BUSINESS_REPORT_NUMBER: '2024-서울성동-0074호',
          COMPANY_NAME: '(주)하이버',
          COMPANY_ADDRESS: '서울 성동구 왕십리로 125, 11층(성수동1가, 케이디타워)',
          CS_EMAIL: 'hivers@brandi.co.kr',
        }
      case 'seoulstore':
        return {
          COMPANY_REGISTRATION_NUMBER: '720-81-03129',
          BUSINESS_REPORT_NUMBER: '2024-서울성동-0075호',
          COMPANY_NAME: '(주)인벤트',
          COMPANY_ADDRESS: '서울 성동구 왕십리로 125, 11층(성수동1가, 케이디타워)',
          CS_EMAIL: 'seoulstore.cs@brandi.co.kr',
        }
      case 'selpi':
        return {
          COMPANY_REGISTRATION_NUMBER: '220-88-93187',
          BUSINESS_REPORT_NUMBER: '169-87-03229',
          COMPANY_NAME: '(주)뉴넥스',
          COMPANY_ADDRESS: '서울 성동구 왕십리로 125, 11층(성수동1가, 케이디타워)',
          CS_EMAIL: 'selpis@brandi.co.kr',
        }
      case 'helpi':
        return {
          COMPANY_REGISTRATION_NUMBER: '220-88-93187',
          BUSINESS_REPORT_NUMBER: '169-87-03229',
          COMPANY_NAME: '(주)뉴넥스',
          COMPANY_ADDRESS: '서울 성동구 왕십리로 125, 11층(성수동1가, 케이디타워)',
          CS_EMAIL: 'help@helpi.co.kr',
        }
    }
  }

  /**
   * 서비스명 가져오기
   * @param service (default: 현재 서비스)
   */
  const getServiceName = (service: keyof TChannelCode = commonStore.channelCode) => {
    return SERVICE_NAME[service] || '브랜디'
  }

  return {
    getServiceInfo,
    getServiceName,
  }
}
