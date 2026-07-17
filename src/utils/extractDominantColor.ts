import type { RgbColor } from '../types'

// 재귀 분할 깊이. 2^COLOR_BOX_DEPTH개의 색상 상자로 나뉜다
const COLOR_BOX_DEPTH = 3

type RgbTuple = [number, number, number]

interface ColorBox {
  color: RgbColor
  population: number
}

// Median Cut 알고리즘으로 이미지의 대표(vibrant) 색상을 추출한다
export const extractDominantColor = (imageData: ImageData): RgbColor => {
  const pixels: RgbTuple[] = []
  const { data } = imageData
  for (let i = 0; i < data.length; i += 4) {
    // 완전 투명 픽셀은 대표색 계산에서 제외
    if (data[i + 3] === 0) {
      continue
    }
    pixels.push([data[i], data[i + 1], data[i + 2]])
  }

  if (pixels.length === 0) {
    return { r: 0, g: 0, b: 0 }
  }

  const boxes = splitBox(pixels, COLOR_BOX_DEPTH)
  return pickVibrantColor(boxes)
}

// 픽셀 집합을 색상 범위가 가장 넓은 축(R/G/B) 기준으로 정렬해 절반씩 재귀 분할
const splitBox = (pixels: RgbTuple[], depth: number): ColorBox[] => {
  if (depth === 0 || pixels.length <= 1) {
    return [{ color: averageColor(pixels), population: pixels.length }]
  }

  const channel = widestChannel(pixels)
  const sorted = [...pixels].sort((a, b) => a[channel] - b[channel])
  const mid = Math.floor(sorted.length / 2)

  return [...splitBox(sorted.slice(0, mid), depth - 1), ...splitBox(sorted.slice(mid), depth - 1)]
}

// R/G/B 중 값의 범위(max - min)가 가장 넓은 채널을 찾음
const widestChannel = (pixels: RgbTuple[]): 0 | 1 | 2 => {
  const ranges: [number, number, number] = [0, 0, 0]
  for (let channel = 0; channel < 3; channel++) {
    let min = 255
    let max = 0
    for (const pixel of pixels) {
      const value = pixel[channel]
      if (value < min) min = value
      if (value > max) max = value
    }
    ranges[channel] = max - min
  }

  if (ranges[1] >= ranges[0] && ranges[1] >= ranges[2]) return 1
  if (ranges[2] >= ranges[0] && ranges[2] >= ranges[1]) return 2
  return 0
}

const averageColor = (pixels: RgbTuple[]): RgbColor => {
  const total = pixels.reduce(
    (sum, [r, g, b]) => ({ r: sum.r + r, g: sum.g + g, b: sum.b + b }),
    { r: 0, g: 0, b: 0 },
  )
  return {
    r: Math.round(total.r / pixels.length),
    g: Math.round(total.g / pixels.length),
    b: Math.round(total.b / pixels.length),
  }
}

// 채도가 높으면서 픽셀 비중도 큰 상자를 대표색으로 선택 (Spotify류 vibrant swatch 선정과 유사)
const pickVibrantColor = (boxes: ColorBox[]): RgbColor => {
  const totalPixels = boxes.reduce((sum, box) => sum + box.population, 0)

  let best = boxes[0]
  let bestScore = -Infinity

  for (const box of boxes) {
    const saturation = getSaturation(box.color)
    const populationRatio = box.population / totalPixels
    const score = saturation * 0.7 + populationRatio * 0.3
    if (score > bestScore) {
      bestScore = score
      best = box
    }
  }

  return best.color
}

const getSaturation = ({ r, g, b }: RgbColor): number => {
  const max = Math.max(r, g, b) / 255
  const min = Math.min(r, g, b) / 255
  if (max === min) {
    return 0
  }
  const lightness = (max + min) / 2
  const delta = max - min
  return lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)
}
