import { TApiError } from './common'

type TLoginType = {
  changePwLater: '비밀번호 나중에 변경'
  emailCertify: '이메일 인증'
  TFACertify: 'OTP 인증(관리자계정)'
  TFACertifySeller: '휴대폰 인증'
}
export interface ILoginRequest {
  accountId: string
  password: string
  isRemember?: boolean
  type?: keyof TLoginType
  managerNo?: number
  email?: string
  certificationCode?: string // 인증번호
}

export type TLoginStatus = {
  failWaitingTime: '로그인 5회 실패 시 대기 시간'
  excessFail: '로그인 6회 실패. 신규 비밀번호 설정 필요'
  passwordError: '아이디, 비밀번호 불일치'
  dormantRestoreInProgress: '휴면해제 신청 처리 중'
  // dormantSeller: '휴면해제 신청' // 셀러만이라 제외
  changePassword: '90일 만료 비밀번호 변경 (7일 연장 가능)'
  changePasswordNow: '90일 만료 비밀번호 변경 (7일 연장 불가능)'
  tempPassword: '임시 비밀번호 발급으로 비밀번호 변경 필수'
  accountLock: '계정 잠금 상태'
  TFACertificationJoin: 'OTP 등록 필요'
  TFACertification: 'OTP 로그인 필요'
}
export interface ILoginStatusResponse {
  loginStatus?: keyof TLoginStatus // 계정상태
  message?: string
  accountNo: number
  accountType: '1' | '2' // 1: admin, 2: seller
  waitSecond: number // 남은 시간
  failCount?: number // 로그인 실패 횟수
}
export interface ILoginSuccessResponse {
  sellerNo: number
  sellerStatus: string
  sellerEnName: string
  sellerName: string
  accountType: '1' | '2' // 1: admin, 2: seller
  accessToken: string
  siteUrl: string
  imageUrl: string
  smallImageUrl: string
  managerList: [] | null
  isExcelPassword: boolean
  serviceNo: 1 | 2 | 3 | 5
  isHelpi: boolean
  sellerEmail: string
  accessTokenMdm: string
  helpiConversionDate: string | null
}
export interface ILoginResponse {
  status: 'success' | null
  statusResponse: ILoginStatusResponse
  successResponse: ILoginSuccessResponse
  error: TApiError & Record<string, unknown>
  result: boolean
}

export interface IOTPJoin {
  certificationCode: string // OTP 인증 코드
  secretKey: string // OTP 설정 키
  accountId: string // 계정 아이디
}
export interface IQRcodeResponse {
  secretKey: string
  qrcodeUrl?: string
}

export interface IAccountsChangePasswordRequest {
  accountId: string
  password: string
  newPassword: string
  newPasswordRe: string
}

export interface ISellerCertifyRequest {
  accountId: string
  managerNo?: number // 인증 관리 번호
  type: 'email' | 'sms'
  isFindPassword?: boolean // 비밀번호 찾기 여부
  phoneNumber?: string // 비밀번호 찾기 시 이용
}
