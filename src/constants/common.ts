import { type TChannelNo, type TChannelCode } from '@types/common'
import { TLoginStatus } from '@types/admin'

export const SERVICE_NO: TChannelNo = {
  brandi: 1,
  hiver: 2,
  selpi: 3,
  seoulstore: 5,
}

export const SERVICE_NAME: TChannelCode = {
  brandi: '브랜디',
  hiver: '하이버',
  selpi: '셀피',
  seoulstore: '서울스토어',
}

export const LOGIN_STATUS_MESSAGE: { [key: keyof TLoginStatus]: string } = {
  TFACertification: `마스터(개인정보취급자)의 경우 Google OTP 인증 후 로그인 가능합니다.`,
  accountLock: `해당 계정은 3개월 이상 로그인 되지 않아 잠금처리 된 계정입니다.<br />잠금 해제를 신청하시겠습니까?<br />`,
  dormantRestoreInProgress: `휴면해제 신청 처리 중 입니다. 잠시 후 로그인 부탁 드립니다. (최대 10분 정도 소요될 수 있습니다.)`,
  excessFail: `계정이 잠겼습니다. [문의-${import.meta.env.VITE_NODE_ENV === 'production' ? '운영' : 'TECH-플랫폼'}] 채널에 잠금해제 요청해 주세요.`,
  failWaitingTime: `로그인 5회 실패하여 5분 동안 로그인이 불가능합니다. 잠시 후 다시 로그인 해주세요.`,
}
