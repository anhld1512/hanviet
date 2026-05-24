// 원고지 (Wongoji) counting logic
// Moi o vuong = 1 ky tu Hangul hoac 1 dau cau
// Khong dem: khoang trang dau dong (thut le), xuong dong

export function countWongojiChars(text: string): number {
  if (!text) return 0
  // Dem tat ca ky tu tru newline
  return text.replace(/\n/g, "").length
}

export function getCounterColor(count: number, min: number, max: number): "green" | "yellow" | "red" {
  if (count < min * 0.8) return "green"
  if (count <= max) return "yellow"
  return "red"
}

export function getCounterStatus(count: number, min: number, max: number): string {
  if (count === 0) return ""
  if (count < min) return `Con thieu ${min - count} chu`
  if (count <= max) return "Dung do dai"
  return `Vuot ${count - max} chu`
}

// Kiem tra xem co phai Hangul khong
export function isHangul(char: string): boolean {
  const code = char.charCodeAt(0)
  return (
    (code >= 0xAC00 && code <= 0xD7A3) || // Hangul syllables
    (code >= 0x1100 && code <= 0x11FF) || // Hangul Jamo
    (code >= 0x3130 && code <= 0x318F)    // Hangul Compatibility Jamo
  )
}
