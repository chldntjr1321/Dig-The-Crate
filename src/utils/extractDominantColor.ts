import type { RgbColor } from '../types'

// 재귀 분할 깊이. 2^COLOR_BOX_DEPTH개의 색상 상자로 나뉜다
// 값이 클수록 더 세밀한 색상 후보군을 얻지만, 재귀/정렬 연산량도 늘어남
const COLOR_BOX_DEPTH = 14

type RgbTuple = [number, number, number]

interface ColorBox {
  color: RgbColor
  population: number
}

// 색상 후보를 고를 때 이미 선택된 색과 이만큼(RGB 유클리드 거리, 0~441) 이상 떨어져야 함
const MIN_COLOR_DISTANCE = 80

// Median Cut 알고리즘으로 이미지의 대표(vibrant) 색상을 최대 2개 추출한다
export const extractDominantColor = (imageData: ImageData): RgbColor[] => {
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
    return [{ r: 0, g: 0, b: 0 }]
  }

  const boxes = splitBox(pixels, COLOR_BOX_DEPTH)
  return pickVibrantColors(boxes, 2)
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

// 채도가 높으면서 픽셀 비중도 큰 상자를 우선으로, 서로 충분히 다른 색만 최대 count개 선택
// (Spotify류 vibrant swatch 선정과 유사하되, 비슷한 색끼리 중복 선택되는 것을 방지)
const pickVibrantColors = (boxes: ColorBox[], count: number): RgbColor[] => {
  const totalPixels = boxes.reduce((sum, box) => sum + box.population, 0)

  const ranked = boxes
    .map((box) => ({
      color: box.color,
      score: getSaturation(box.color) * 0.7 + (box.population / totalPixels) * 0.3,
    }))
    .sort((a, b) => b.score - a.score)

  const picked: RgbColor[] = []
  for (const candidate of ranked) {
    if (picked.length >= count) {
      break
    }
    const isDistinctEnough = picked.every(
      (existing) => colorDistance(existing, candidate.color) >= MIN_COLOR_DISTANCE,
    )
    if (isDistinctEnough) {
      picked.push(candidate.color)
    }
  }

  // 이미지 전체가 비슷한 색이라 기준을 만족하는 색을 하나도 못 찾았으면, 1등 색만이라도 보장
  if (picked.length === 0) {
    picked.push(ranked[0].color)
  }

  return picked
}

const colorDistance = (a: RgbColor, b: RgbColor): number => {
  const dr = a.r - b.r
  const dg = a.g - b.g
  const db = a.b - b.b
  return Math.sqrt(dr * dr + dg * dg + db * db)
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
