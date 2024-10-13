import Api, { ApiConfig, AxiosInstanceConfig } from '@api/base/api'
import { TApiResponseWrapper } from '@types/common'
import { ILoginRequest, ILoginResponse, IOTPJoin, IQRcodeResponse, IAccountsChangePasswordRequest, ISellerCertifyRequest } from '@types/admin'

class AdminApi extends Api {
  constructor(configs?: ApiConfig & AxiosInstanceConfig) {
    super({
      baseURL: `${import.meta.env.VITE_SELLER_API}`,
      ...configs,
    })
  }

  /**
   * 로그인
   * @param payload 로그인 요청
   */
  postSellerLogin(payload: ILoginRequest) {
    return this.requestPost<TApiResponseWrapper<ILoginResponse>>('/seller/login', { ...payload })
  }

  /**
   * OTP QR코드 생성
   * @param accountId 계정 아이디
   */
  getOTPQr(accountId: string) {
    return this.requestGet<TApiResponseWrapper<IQRcodeResponse>>('/otp/qr', { accountId: accountId })
  }

  /**
   * OTP 등록(가입)
   * @param payload OTP 등록 정보
   */
  postOTPJoin(payload: IOTPJoin) {
    return this.requestPost<TApiResponseWrapper>('/otp/join', { ...payload })
  }

  /**
   * 비밀번호 변경
   * @param payload 비밀번호 변경 요청 정보
   */
  postAccountsChangePassword(payload: IAccountsChangePasswordRequest) {
    return this.requestPost<TApiResponseWrapper>('/accounts/change-password', { ...payload })
  }

  /**
   * 셀러 인증번호 발송
   */
  postSellerCertify(payload: ISellerCertifyRequest) {
    return this.requestPost<TApiResponseWrapper>('/seller/certify', { ...payload })
  }
}

export default AdminApi
