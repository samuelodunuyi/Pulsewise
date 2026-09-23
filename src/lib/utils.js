import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => twMerge(clsx(inputs))

export const initials = (name = '') =>
  name
    .replace(/^Dr\.?\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

// ---- Numbers -------------------------------------------------------------

export const formatNumber = (value, options) => new Intl.NumberFormat('en-US', options).format(value)

export const formatCompact = (value) =>
  formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

export const formatMoney = (value) =>
  formatNumber(value, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export function formatValue(value, format) {
  switch (format) {
    case 'currency':
      return formatMoney(value)
    case 'percent':
      return `${formatNumber(value, { maximumFractionDigits: 1 })}%`
    case 'minutes':
      return `${value} min`
    default:
      return formatNumber(value)
  }
}

// ---- Dates ---------------------------------------------------------------
// Dates are stored as local "YYYY-MM-DD" strings so they never shift across timezones.

export const today = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export const addDays = (date, days) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/** Monday of the week containing `date`. */
export const startOfWeek = (date) => addDays(date, -((date.getDay() + 6) % 7))

export const toISODate = (date) =>
  [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')

export const todayISO = () => toISODate(today())

export const parseDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const formatDate = (iso, options = { month: 'short', day: 'numeric', year: 'numeric' }) =>
  parseDate(iso).toLocaleDateString('en-US', options)

export function formatRelativeDay(iso) {
  const diff = Math.round((parseDate(iso) - today()) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  return formatDate(iso, { weekday: 'short', month: 'short', day: 'numeric' })
}

export const formatTime = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return new Date(2000, 0, 1, h, m).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

/** "08:00" → "8 AM", "08:30" → "8:30 AM" — for tight spaces like rota cells. */
export const formatTimeShort = (hhmm) => formatTime(hhmm).replace(':00', '')

export function ageFrom(dob) {
  const birth = parseDate(dob)
  const now = today()
  let age = now.getFullYear() - birth.getFullYear()
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age--
  return age
}

export function timeAgo(minutes) {
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
  return `${Math.floor(minutes / 1440)}d ago`
}
