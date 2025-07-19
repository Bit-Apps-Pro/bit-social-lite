export const DELAY_TYPE_IMMEDIATELY = '0'

export function parseTimeInput(timeInput: string) {
  if (timeInput === DELAY_TYPE_IMMEDIATELY) {
    return {
      every: 0,
      unit: ''
    }
  }
  const parts = timeInput.split('-')

  const every = Number.parseInt(parts[0], 10)
  const unit = parts[1]

  return {
    every: every,
    unit: unit
  }
}

export function formatPostDelayInput(timeObj: { every: number; unit: string }) {
  const { every, unit } = timeObj
  if (every === 0 && unit === '') {
    return 'immediately'
  }
  return 'delay'
}
