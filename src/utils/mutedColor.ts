import type { RgbColor } from '../types'

const SATURATION_SCALE = 0.6 // 채도를 60% 수준으로 낮춤
const MAX_LIGHTNESS = 0.55 // 밝기가 이 이상 올라가지 않도록 캡 (흰색에 가까운 색이 나오는 것 방지)

// 추출된 색을 텍스트와 항상 대비되도록 채도를 낮추고 밝기 상한을 둔 "톤 다운" 버전으로 변환
export const mutedColor = (color: RgbColor): RgbColor => {
  const { h, s, l } = rgbToHsl(color)
  const mutedS = s * SATURATION_SCALE
  const cappedL = Math.min(l, MAX_LIGHTNESS)
  return hslToRgb(h, mutedS, cappedL)
}

const rgbToHsl = ({ r, g, b }: RgbColor): { h: number; s: number; l: number } => {
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const l = (max + min) / 2

  if (max === min) {
    return { h: 0, s: 0, l }
  }

  const delta = max - min
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

  let h: number
  if (max === rNorm) {
    h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60
  } else if (max === gNorm) {
    h = ((bNorm - rNorm) / delta + 2) * 60
  } else {
    h = ((rNorm - gNorm) / delta + 4) * 60
  }

  return { h, s, l }
}

const hslToRgb = (h: number, s: number, l: number): RgbColor => {
  if (s === 0) {
    const gray = Math.round(l * 255)
    return { r: gray, g: gray, b: gray }
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hNorm = h / 360

  const toChannel = (t: number): number => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }

  return {
    r: Math.round(toChannel(hNorm + 1 / 3) * 255),
    g: Math.round(toChannel(hNorm) * 255),
    b: Math.round(toChannel(hNorm - 1 / 3) * 255),
  }
}
