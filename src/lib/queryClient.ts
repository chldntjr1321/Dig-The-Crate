import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      // 기본값(networkMode: 'online')은 오프라인일 때 mutation을 아예 실행하지 않고
      // 온라인 복귀 시까지 paused 상태로 대기시켜, onError(롤백 + 에러 토스트)가
      // 호출되지 않는다. 오프라인에서도 즉시 실패시켜 롤백/토스트가 동작하게 한다.
      networkMode: 'always',
    },
  },
})

export default queryClient
