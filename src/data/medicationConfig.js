/** 用药提醒周期配置 */
export const WEEKDAY_OPTIONS = [
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
  { value: 7, label: '周日' },
]

export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: '每天' },
  { value: 'weekdays', label: '每周一至五' },
  { value: 'weekly', label: '每周指定日' },
  { value: 'monthly', label: '每月' },
]

const weekdayLabel = Object.fromEntries(WEEKDAY_OPTIONS.map((d) => [d.value, d.label]))

export function normalizeMedication(med) {
  return {
    ...med,
    frequency: med.frequency || 'daily',
    weekDays: Array.isArray(med.weekDays) ? med.weekDays : [],
  }
}

export function formatMedSchedule(med) {
  const m = normalizeMedication(med)
  const time = m.time || '--:--'
  switch (m.frequency) {
    case 'weekdays':
      return `周一至五 ${time}`
    case 'weekly': {
      if (!m.weekDays.length) return `每周 ${time}`
      const days = [...m.weekDays].sort((a, b) => a - b).map((d) => weekdayLabel[d]).join('、')
      return `每周${days} ${time}`
    }
    case 'monthly':
      return `每月 ${time}`
    default:
      return `每天 ${time}`
  }
}

export function defaultMedForm() {
  return {
    name: '',
    dose: '',
    timeValue: '08:00',
    frequency: 'daily',
    weekDays: [],
  }
}

export function medToForm(med) {
  const m = normalizeMedication(med)
  return {
    name: m.name,
    dose: m.dose,
    timeValue: m.time,
    frequency: m.frequency,
    weekDays: [...m.weekDays],
  }
}

export function formToMedPayload(form) {
  return {
    name: form.name.trim(),
    dose: form.dose.trim(),
    time: form.timeValue,
    frequency: form.frequency,
    weekDays: form.frequency === 'weekly' ? [...form.weekDays].sort((a, b) => a - b) : [],
  }
}
