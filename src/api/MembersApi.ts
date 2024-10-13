import Api, { type ApiConfig } from '@api/base/api'
// import { CancelTokenSource } from 'axios'

class MembersApi extends Api {
  // public cancelToken: CancelTokenSource | null = null

  constructor(configs?: ApiConfig) {
    super({
      baseURL: `${import.meta.env.VITE_ADMIN_API_V2}`,
      ...configs,
    })
  }

  /**
   * [상품 목록] 조회
   * @param params 검색 필터
   */
  /*getProducts(params: Product.RequestProducts) {
    return this.requestGet<Common.TApiResponseWrapper<Product.ProductContentsPage>>('/v2/products', {
      ...params,
    })
  }*/
}

export default MembersApi
