/** 用户个人健康档案（家政扫码可见） */
export const defaultUserArchive = {
  name: '张秀英',
  displayName: '张阿姨',
  gender: '女',
  age: 72,
  height: '158',
  heightUnit: 'cm',
  weight: '55',
  weightUnit: 'kg',
  bloodType: 'A 型',
  phone: '138****5621',
  address: '上海市浦东新区 XX 路 XX 弄 12 号 301 室',
  allergies: '青霉素过敏；海鲜轻微过敏',
  chronic: '高血压',
  medicationHabits: '每日 08:00 降压药餐后服用；12:30 钙片；20:00 阿司匹林睡前服用。勿擅自停药。',
  diet: '低盐低脂，每日饮水 1500ml 以上',
  exercise: '每日散步 30 分钟',
  sleep: '22:00 – 06:30',
  emergencyNote: '听力略弱，请放慢语速。有宠物猫一只，进门请先敲门。',
}

export function buildProfileScanPayload(archive, user) {
  return {
    type: 'xiaoban_user_profile',
    version: 1,
    name: archive.name || user?.name,
    displayName: archive.displayName || user?.displayName,
    age: archive.age,
    gender: archive.gender,
    height: `${archive.height}${archive.heightUnit}`,
    weight: `${archive.weight}${archive.weightUnit}`,
    bloodType: archive.bloodType,
    phone: archive.phone || user?.phone,
    address: archive.address,
    allergies: archive.allergies,
    chronic: archive.chronic,
    medicationHabits: archive.medicationHabits,
    diet: archive.diet,
    exercise: archive.exercise,
    sleep: archive.sleep,
    note: archive.emergencyNote,
    updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  }
}

export function getProfileScanUrl(payload) {
  const json = JSON.stringify(payload)
  const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(json))))
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  return `${base}/profile-scan?d=${encoded}`
}

export function parseProfileScanData(encoded) {
  try {
    const json = decodeURIComponent(escape(atob(decodeURIComponent(encoded))))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function getQrImageUrl(text, size = 180) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`
}
