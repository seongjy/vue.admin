type TFilter = { label: string | number; value: string | number }

// limit
export const OPTION_LIMIT: TFilter[] = [
  { label: '10개씩 보기', value: 10 },
  { label: '20개씩 보기', value: 20 },
  { label: '50개씩 보기', value: 50 },
  { label: '100개씩 보기', value: 100 },
]

// 노출상태
export const OPTION_EXPOSUER_YN: TFilter[] = [
  { label: '노출', value: 'Y' },
  { label: '미노출', value: 'N' },
]
