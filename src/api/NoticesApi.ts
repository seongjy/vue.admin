import Api, { type ApiConfig } from '@api/base/api'
import { TApiAdminV2ResponseWrapper } from '@types/common'
import { INoticesItems, INoticesRequest, INoticesTopsRequest, INoticesPutRequest } from '@types/notices'

class NoticesApi extends Api {
  constructor(configs?: ApiConfig) {
    super({
      baseURL: `${import.meta.env.VITE_ADMIN_API_V2}`,
      // baseURL: '/api/',
      ...configs,
    })
  }

  /**
   * 공지사항 목록 조회
   * @param params 검색 필터
   */
  getNotices(params: INoticesRequest) {
    return this.requestGet<TApiAdminV2ResponseWrapper<INoticesItems[]>>('notices/', {
      ...params,
    })
  }

  /**
   * 공지사항 목록 조회(상단 고정 공지)
   * @param params 검색 필터
   */
  getNoticesTops(params: INoticesTopsRequest) {
    return this.requestGet<TApiAdminV2ResponseWrapper<INoticesItems[]>>('notices/tops/', {
      ...params,
    })
  }

  /**
   * 공지사항 수정
   * @param params 검색 필터
   */
  putNotices(params: INoticesPutRequest) {
    return this.requestPut<TApiAdminV2ResponseWrapper>('notices/put/', {
      ...params,
    })
  }
}

export default NoticesApi
