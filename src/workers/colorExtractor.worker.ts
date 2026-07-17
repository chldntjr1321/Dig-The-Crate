import { extractDominantColor } from '../utils/extractDominantColor'

// self를 Worker로 캐스팅해 별도 tsconfig(webworker lib) 없이 타입을 맞춤
const ctx = self as unknown as Worker

ctx.onmessage = (event: MessageEvent<ImageData>) => {
  const colors = extractDominantColor(event.data)
  ctx.postMessage(colors)
}
