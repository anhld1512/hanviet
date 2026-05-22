export type CardState = {
  ease_factor: number
  interval_days: number
  repetitions: number
}

export function sm2(card: CardState, quality: 0 | 1 | 2 | 3 | 4 | 5): CardState & { next_review: Date } {
  let { ease_factor, interval_days, repetitions } = card

  if (quality < 3) {
    repetitions = 0
    interval_days = 1
  } else {
    if (repetitions === 0) interval_days = 1
    else if (repetitions === 1) interval_days = 6
    else interval_days = Math.round(interval_days * ease_factor)
    repetitions++
    ease_factor = Math.max(1.3, ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  }

  const next_review = new Date()
  next_review.setDate(next_review.getDate() + interval_days)

  return { ease_factor, interval_days, repetitions, next_review }
}
