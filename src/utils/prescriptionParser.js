/** 从处方 OCR 文本解析用药提醒 */

const TIME_MAP = {
  早: '08:00',
  晨: '08:00',
  上午: '09:00',
  中: '12:00',
  午: '12:30',
  晚: '20:00',
  夜: '21:00',
  睡前: '21:00',
}

function normalizeTime(raw) {
  if (!raw) return '08:00'
  const hm = raw.match(/(\d{1,2})[:：点时](\d{0,2})/)
  if (hm) {
    const h = String(hm[1]).padStart(2, '0')
    const m = hm[2] ? String(hm[2]).padStart(2, '0') : '00'
    return `${h}:${m}`
  }
  for (const [key, val] of Object.entries(TIME_MAP)) {
    if (raw.includes(key)) return val
  }
  return '08:00'
}

function parseFrequency(text) {
  if (/每周|星期/.test(text)) return 'weekly'
  if (/周一至五|工作日|周一到周五/.test(text)) return 'weekdays'
  if (/每月/.test(text)) return 'monthly'
  return 'daily'
}

function parseDose(text) {
  const m = text.match(/(\d+(?:\.\d+)?\s*(?:mg|g|ml|毫克|克|毫升)|\d+\s*片|每次\s*\d+\s*片)/i)
  return m ? m[1].replace(/\s+/g, '') : '1 片'
}

function parseName(line) {
  const cleaned = line
    .replace(/用法[:：]?.*$/i, '')
    .replace(/每日.*?次/g, '')
    .replace(/每晚.*?次/g, '')
    .replace(/口服|饭后|饭前|餐前|餐后/g, '')
    .trim()
  const m = cleaned.match(/^[\u4e00-\u9fa5A-Za-z（）()·\-]+?(?:片|胶囊|颗粒|丸|散|口服液|滴丸)?/)
  if (m) return m[0].trim()
  const parts = cleaned.split(/\s+/)
  return parts[0] || cleaned.slice(0, 20)
}

function splitTimes(text) {
  if (/一日三次|每天三次|tid/i.test(text)) {
    return ['08:00', '12:30', '20:00']
  }
  if (/一日两次|每天两次|bid/i.test(text)) {
    return ['08:00', '20:00']
  }
  if (/每晚|睡前|qn/i.test(text)) {
    return ['21:00']
  }
  const hm = text.match(/\d{1,2}[:：]\d{2}/g)
  if (hm?.length) return [...new Set(hm.map((t) => t.replace('：', ':')))]

  const times = []
  for (const key of Object.keys(TIME_MAP)) {
    if (text.includes(key)) times.push(TIME_MAP[key])
  }
  return times.length ? [...new Set(times)] : ['08:00']
}

/**
 * @param {string} text OCR 识别全文
 */
export function parsePrescriptionText(text) {
  if (!text?.trim()) return []

  const lines = text
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter((l) => l.length > 3 && !/^处方|医院|姓名|性别|年龄|诊断|医师|日期|单位/.test(l))

  const results = []

  lines.forEach((line) => {
    if (!/[\u4e00-\u9fa5]/.test(line)) return
    if (!/(mg|片|胶囊|口服|每日|每次|早|中|晚|\d{1,2}[:：]\d{2})/i.test(line)) return

    const name = parseName(line)
    if (!name || name.length < 2) return

    const dose = parseDose(line)
    const frequency = parseFrequency(line)
    const times = splitTimes(line)

    times.forEach((time) => {
      results.push({
        name,
        dose,
        time: normalizeTime(time),
        frequency,
        weekDays: [],
      })
    })
  })

  const deduped = []
  const seen = new Set()
  results.forEach((item) => {
    const key = `${item.name}|${item.dose}|${item.time}|${item.frequency}`
    if (!seen.has(key)) {
      seen.add(key)
      deduped.push(item)
    }
  })

  return deduped
}

/** 演示：无有效识别结果时的样例处方文本 */
export const DEMO_PRESCRIPTION_OCR = `苯磺酸氨氯地平片 5mg 每日一次 早8:00 口服
阿司匹林肠溶片 100mg 每晚一次 20:00 饭后
钙尔奇D咀嚼片 1片 每日一次 午12:30`
