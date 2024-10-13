export type TChannelCode = { brandi: '브랜디'; hiver: '하이버'; seoulstore: '서울스토어'; selpi: '셀피' }
export type TChannelNo = { brandi: 1; hiver: 2; seoulstore: 5; selpi: 3 }
export type TNodeEnv = 'development' | 'production' | 'sprint' | 'staging'

export type TApiError = {
  code: number
  message: string
  validation: string
}
export type TApiResponseWrapper<D = any, M = Record<string, unknown>> = {
  data: D
  error: TApiError & M
  result: boolean
}

// Admin-v1 response wrapper
export type TApiAdminV1ResponseWrapper<D = any> = {
  result: boolean
  data: D
  count?: number
  message?: string
}
// Admin-v2 response wrapper
export type TApiAdminV2ResponseWrapper<D = any> = {
  result: D
  meta: { code: number }
  count?: number
  message?: string
  next: string | null
  previous: string | null
}

// Filter Template Interface
export interface IFilterTemplate {
  type: 'range' | 'rangeSet' | 'select' | 'input' | 'date' | 'searchSet' | 'radio'
  label?: string // 라벨 필요없다면 생략 가능
  value?: string // 필터명 입력 필요 ({명칭}Set 형태는 미사용)
  required?: boolean
  options?: { label: string | number; value: string | number }[] // Type: Select, Radio, rangeSet 사용
  minDate?: string // Type: Range, Date 사용
  maxDate?: string // Type: Range, Date 사용
  rules?: object[] // required rules는 따로 추가 필요없음. (위 required 속성으로 대체)
  set?: object // Type: {명칭}Set 사용에 사용
  useRangeBtn?: boolean // Type: Range 사용 : 기간별 선택버튼
  rangeBtnOptions?: number[] // Type: Range 사용 : 기간별 선택버튼 일자 옵션 (default: 0일(오늘)/3일/7일/15일/30일) (ex. [0, 3, 7, 15, 30])
}
