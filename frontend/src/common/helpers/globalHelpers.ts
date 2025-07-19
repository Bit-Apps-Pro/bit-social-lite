/* eslint-disable unicorn/prefer-spread */
/* eslint-disable unicorn/prefer-code-point */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */

// export const hideWpMenu = () => {
//   select('body').style.overflow = 'hidden'
//   if (!Object.prototype.hasOwnProperty.call(process.env, 'PUBLIC_URL')) {
//     select('.wp-toolbar').style.paddingTop = '0'
//     select('#wpadminbar').style.display = 'none'
//     select('#adminmenumain').style.display = 'none'
//     select('#adminmenuback').style.display = 'none'
//     select('#adminmenuwrap').style.display = 'none'
//     select('#wpfooter').style.display = 'none'
//     select('#wpcontent').style.marginLeft = '0'
//   }
// }

// export const showWpMenu = () => {
//   select('body')[0].style.overflow = 'auto'
//   if (!Object.prototype.hasOwnProperty.call(process.env, 'PUBLIC_URL')) {
//     select('.wp-toolbar')[0].style.paddingTop = '32px'
//     select('#wpadminbar').style.display = 'block'
//     select('#adminmenumain').style.display = 'block'
//     select('#adminmenuback').style.display = 'block'
//     select('#adminmenuwrap').style.display = 'block'
//     select('#wpcontent').style.marginLeft = null
//     select('#wpfooter').style.display = 'block'
//   }
// }

export const assign = (obj: any, keyPath: string, value: any) => {
  const lastKeyIndex = keyPath.length - 1

  for (let i = 0; i < lastKeyIndex; ++i) {
    const key = keyPath[i]
    if (!(key in obj)) {
      obj[key] = {}
    }
    obj = obj[key]
  }
  obj[keyPath[lastKeyIndex]] = value
  return value
}

const forEach = (array: any[], iteratee: any) => {
  let index = -1
  const { length } = array

  while (++index < length) {
    iteratee(array[index], index)
  }
  return array
}

export const deepCopy = (target: any, map = new WeakMap()) => {
  if (typeof target !== 'object' || target === null) {
    return target
  }

  const isArray = Array.isArray(target)
  const cloneTarget: any = isArray ? [] : {}

  if (map.get(target)) {
    return map.get(target)
  }
  map.set(target, cloneTarget)

  if (isArray) {
    forEach(target, (value: any, index: number) => {
      cloneTarget[index] = deepCopy(value, map)
    })
  } else {
    forEach(Object.keys(target), (key: string) => {
      cloneTarget[key] = deepCopy(target[key], map)
    })
  }
  return cloneTarget
}

export const sortArrOfObj = (data: any, sortLabel: string) =>
  data.sort((a: any, b: any) => {
    if (a?.[sortLabel]?.toLowerCase() < b?.[sortLabel]?.toLowerCase()) return -1
    if (a?.[sortLabel]?.toLowerCase() > b?.[sortLabel]?.toLowerCase()) return 1
    return 0
  })

export const dateTimeFormatter = (dateStr: Date | string, format: string) => {
  const newDate = new Date(dateStr)

  if (newDate.toString() === 'Invalid Date') {
    return 'Invalid Date'
  }

  // Day
  const d = newDate.toLocaleDateString('en-US', { day: '2-digit' })
  const index = newDate.toLocaleDateString('en-US', { day: 'numeric' })
  let S: number | string = Number(index)
  if (S % 10 === 1 && S !== 11) {
    S = 'st'
  } else if (S % 10 === 2 && S !== 12) {
    S = 'nd'
  } else if (S % 10 === 3 && S !== 13) {
    S = 'rd'
  } else {
    S = 'th'
  }
  // Weekday
  const l = newDate.toLocaleDateString('en-US', { weekday: 'long' })
  const D = newDate.toLocaleDateString('en-US', { weekday: 'short' })
  // Month
  const m = newDate.toLocaleDateString('en-US', { month: '2-digit' }).padStart(2, '0')
  const n = newDate.toLocaleDateString('en-US', { month: 'numeric' })
  const F = newDate.toLocaleDateString('en-US', { month: 'long' })
  const M = newDate.toLocaleDateString('en-US', { month: 'short' })
  // Year
  const Y = newDate.toLocaleDateString('en-US', { year: 'numeric' })
  const y = newDate.toLocaleDateString('en-US', { year: '2-digit' }).padStart(2, '0')
  // Time
  const a = newDate.toLocaleTimeString('en-US', { hour12: true }).split(' ')[1].toLowerCase()
  const A = newDate.toLocaleTimeString('en-US', { hour12: true }).split(' ')[1]
  // Hour
  const g = newDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).split(' ')[0]
  const h = newDate.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }).split(' ')[0]
  const G = newDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false })
  const H = newDate.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false }).padStart(2, '0')
  // Minute
  const i = newDate.toLocaleTimeString('en-US', { minute: '2-digit' }).padStart(2, '0')
  // Second
  const s = newDate.toLocaleTimeString('en-US', { second: '2-digit' }).padStart(2, '0')
  // Additional
  const T = newDate.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2]
  const c = newDate.toISOString()
  const r = newDate.toUTCString()
  const U = newDate.valueOf()
  let formattedDate = ''
  const allFormatObj = {
    a,
    A,
    c,
    d,
    D,
    F,
    g,
    G,
    h,
    H,
    i,
    j: index,
    l,
    m,
    M,
    n,
    r,
    s,
    S,
    T,
    U,
    y,
    Y
  }

  const allFormatkeys = Object.keys(allFormatObj) as (keyof typeof allFormatObj)[]
  for (let v = 0; v < format.length; v += 1) {
    if (format[v] === '\\') {
      v += 1
      formattedDate += format[v]
    } else {
      const formatKey = allFormatkeys.find(key => key === format[v])

      const formatDate = formatKey
        ? format[v].replace(formatKey, String(allFormatObj[formatKey]))
        : format[v]
      formattedDate += formatDate
    }
  }

  return formattedDate
}

const cipher = (salt: string) => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0))
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const byteHex = (n: number) => {
    const str = `0${Number(n).toString(16)}`
    return str.slice(Math.max(0, str.length - 2))
  }

  const applySaltToChar = (code: any) => textToChars(salt).reduce((a: number, b: number) => a ^ b, code)

  // eslint-disable-next-line newline-per-chained-call
  return (text: string) => text?.split('')?.map(textToChars).map(applySaltToChar).map(byteHex).join('')
}

const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0))
const decipher = (salt: string) => {
  const applySaltToChar = (code: any) => textToChars(salt).reduce((a, b) => a ^ b, code)
  return (encoded: string) =>
    encoded
      ?.match(/.{1,2}/g)
      ?.map(hex => Number.parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('')
}

export const bitCipher = cipher('btcd')
export const bitDecipher = decipher('btcd')

export const checkValidEmail = (email: string) => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true
  }
  return false
}

export const getColorPreference = () =>
  globalThis.matchMedia && globalThis.matchMedia('(prefers-color-scheme: dark)').matches

export const clsx = (arr: (number | string)[]): string => arr.filter(Boolean).join(' ')

export const trimStr = (content: string, length: number) => {
  if (content.length > length) return `${content.slice(0, Math.max(0, length))}...`
  return content
}
export const pageChecker = (
  currentPage: number,
  limit: number,
  total: number,
  setCurrentPage: (number: number) => void
) => {
  if (currentPage > 1 && Math.ceil((total - 1) / limit) < currentPage) {
    const updateValue = currentPage - 1
    return setCurrentPage(updateValue)
  }
}

export const dateTime = (wpTimeZone: string): string => {
  const date = new Date()
  if (wpTimeZone === 'UTC') {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000).toString()
  }
  if (/(\d+)/.test(wpTimeZone)) {
    let tz
    const [hour, minute] = wpTimeZone.split(':')
    if (Number(minute) > 0) {
      tz = Number(hour) > 0 ? Number(hour) + 0.5 : Number(hour) - 0.5
    } else {
      tz = hour
    }
    const formatZone = date.getTimezoneOffset() + Number(tz) * 60

    return new Date(date.getTime() + formatZone * 60 * 1000).toString()
  }

  return new Date(date.toLocaleString('en-US', { timeZone: wpTimeZone })).toString()
}

/**
 * Convert a WordPress date format string to a Day.js date format string.
 *
 * @param wordPressFormat - The WordPress date format string to convert.
 *                         - The string must only contain characters from the set: Y, y, m, n, d, j, F, M, a, A, g, G, h, H, i, s, T.
 *                         - The string may contain additional characters that are not in the set above.
 * @returns The Day.js date format string.
 */
export function convertWordPressToDayjsDateFormat(wordPressFormat: string): string {
  // A conversion table that maps WordPress format characters to Day.js format characters
  const conversionTable: Record<string, string> = {
    a: 'a',
    A: 'A',
    d: 'DD',
    F: 'MMMM',
    g: 'h',
    G: 'H',
    h: 'hh',
    H: 'HH',
    i: 'mm',
    j: 'D',
    m: 'MM',
    M: 'MMM',
    n: 'M',
    s: 'ss',
    T: 'ZZ',
    Y: 'YYYY',
    y: 'YY'
  }

  // Split the WordPress format string into individual characters,
  // convert each character using the conversion table, and then join
  // the characters back into a string.
  const dayjsFormat = wordPressFormat
    .split('')
    .map(char => conversionTable[char] || char)
    .join('')

  // Return the Day.js date format string.
  return dayjsFormat
}

function convertMySQLTimestampOffset(dateString: string, utcOffset: string) {
  const date = new Date(dateString)
  const offsetHours = Number.parseInt(utcOffset.slice(1, 3), 10)
  const offsetMinutes = Number.parseInt(utcOffset.slice(4), 10)
  const utcTime = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
  const localTime = new Date(utcTime - (offsetHours * 60 + offsetMinutes) * 60 * 1000)
  const formattedDate = localTime.toLocaleDateString('en-US')
  const formattedTime = localTime.toLocaleTimeString('en-US')

  return `${formattedDate}, ${formattedTime}`
}

function convertMySQLTimestampUTC(timestamp: string) {
  // Convert the MySQL timestamp to a JavaScript date object
  const date = timestamp.replace(' ', 'T')

  // Return the date formatted for WordPress
  return date
}

function convertMySQLTimestamp(timestamp: string, WPtimeZone: string) {
  // Get the user's browser timezone offset in minutes
  const offset = new Date().getTimezoneOffset()

  // Convert the MySQL timestamp to a JavaScript date object
  const date = new Date(timestamp.replace(' ', 'T'))

  // Adjust the date for the user's timezone offset and DST
  date.setMinutes(date.getMinutes() - offset)
  // Return the date formatted for WordPress
  return date.toLocaleString('en-US', { timeZone: WPtimeZone })
}

export const convertMySQLTimeToWptimeZone = (timeStamp: string, wpTimeZone: string) => {
  if (wpTimeZone === 'UTC') {
    return convertMySQLTimestampUTC(timeStamp)
  }
  if (/(\d+)/.test(wpTimeZone)) {
    return convertMySQLTimestampOffset(timeStamp, wpTimeZone)
  }
  return convertMySQLTimestamp(timeStamp, wpTimeZone)
}

/**
 * Check if two objects are equal
 *
 * @param obj1 First Object
 * @param obj2 Second Object
 * @returns Boolean
 */
export const isObjectEqual = <T, J>(obj1: T, obj2: J) => JSON.stringify(obj1) === JSON.stringify(obj2)

/**
 * uppercase first letter of a string
 *
 * @param str string
 * @returns string
 */
export const ucFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

interface IfCondition {
  else: (falseValue: string) => IfCondition
  elseIf: (newCondition: boolean) => IfCondition
  end: () => string
  then: (trueValue: string) => IfCondition
}

export function _if(condition: boolean): IfCondition {
  let result: string | undefined
  let currentCondition = condition
  let finalConditionMet = false

  const chain: IfCondition = {
    else: function (falseValue: string) {
      if (!finalConditionMet) {
        result = falseValue
        finalConditionMet = true
      }
      return chain
    },
    elseIf: function (newCondition: boolean) {
      if (!finalConditionMet) {
        currentCondition = newCondition
      }
      return chain
    },
    end: function () {
      return result!
    },
    // eslint-disable-next-line unicorn/no-thenable
    then: function (trueValue: string) {
      if (currentCondition && !finalConditionMet) {
        result = trueValue
        finalConditionMet = true
      }
      return chain
    }
  }

  return chain
}
