// 서비스 공지사항(커머스)
export interface IServiceNoticesItems {
  fixYn: boolean // 상단고정 여부
  isRecent: boolean // 최근 7일 이내에 올라온 공지사항 여부
  noticeNo: number
  noticeType: string
  noticeTitle: string
  noticeRegister: string
  noticeRegistDete: string
}
export type TServiceNoticesResponse = {
  list: IServiceNoticesItems[]
}
export type TNoticeType = { '01': '공통'; '02': '하루제휴'; '03': '헬피'; NO: '일반' }
export interface IServiceNoticesRequest {
  offset: number
  limit: number
  noticeType?: keyof TNoticeType
  noticeTitle?: string
  noticeRegistFrom?: string
  noticeRegistTo?: string
}

export type TNoticeTarget = { seller: '셀러향'; member: '고객향' }
interface IListRequest {
  page: number
}

// 공통 공지사항
export interface INoticesRequest extends IListRequest {
  limit: number
  'page-size'?: number
  'exposure-yn'?: 'Y' | 'N'
  'notice-type'?: '01' | '02' | '1' | '2' | 'NO'
  target?: keyof TNoticeTarget
  'start-date'?: string
  'end-date'?: string
  id?: number
  title?: string
}
export interface INoticesItems {
  id: string // 공지 번호
  title: string // 공지 제목
  contents: string // 공지 글 내용
  is_fixed: boolean // 고정 여부
  is_exposure: boolean // 노출 여부
  is_reserved: boolean // 예약일 설정 여부
  exposure_start_date: string // 예약일 시작 일시
  type: { code: string; name: string }
  exposure_end_date: string // 예약일 종료 일시 (기본 2037-12-31 23:59:59)
  registrant: { id: string; name: string } // 등록자 정보 (id: 관리자 계정 번호, name: 관리자 계정 ID) ** 수정정보 없는 경우 각 항목 하이픈(-)으로 대체 응답
  modifier: { id: string; name: string } //수정자 정보 (id: 관리자 계정 번호, name: 관리자 계정 ID) ** 수정정보 없는 경우 각 항목 하이픈(-)으로 대체 응답
  registrant_date: string // 공지 등록일시 ** 수정정보 없는 경우 각 항목 하이픈(-)으로 대체 응답
  modified_date: string | null // 공지 수정일시
}
export interface INoticesTopsRequest extends IListRequest {
  target: keyof TNoticeTarget
}
export interface INoticesPutRequest {
  id: string
  target: keyof TNoticeTarget
  process_type?: 'multiple' | 'singular'
  title?: string
  contents?: string
  exposure_yn?: 'Y' | 'N'
  fix_yn?: 'Y' | 'N'
  notice_type?: '01' | '02' | '1' | '2' | 'NO'
}
