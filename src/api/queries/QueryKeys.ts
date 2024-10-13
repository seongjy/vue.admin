import { useCommonStore } from '@stores/common'
const { channelNo } = useCommonStore()

/**
 * Query key[]의 구성
 * [0] : API PATH
 * [1] : channelNo
 * [2]? : optional
 */
export const QUERY_KEYS = {
  notices: ['/notices', channelNo],
  noticesTops: ['/notices/tops', channelNo],
}
