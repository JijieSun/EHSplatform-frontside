/** 紧急联系人固定 3 个槽位 */
export const EMERGENCY_CONTACT_SLOTS = 3

export const USER_STATUS_OPTIONS = ['正常', '禁用']

export function emptyEmergencyContact(slot = 0) {
  return {
    name: '',
    relation: '',
    phone: '',
    priority: slot === 0 ? '主联系人' : '备用',
    notifySos: slot === 0,
  }
}

export function padEmergencyContacts(contacts) {
  const filled = (contacts || [])
    .filter((c) => c && (c.name?.trim() || c.phone?.trim()))
    .slice(0, EMERGENCY_CONTACT_SLOTS)
  const list = [...filled]
  while (list.length < EMERGENCY_CONTACT_SLOTS) {
    list.push(emptyEmergencyContact(list.length))
  }
  return list.slice(0, EMERGENCY_CONTACT_SLOTS)
}

export function activeEmergencyContacts(contacts) {
  return padEmergencyContacts(contacts).filter((c) => c.name?.trim() || c.phone?.trim())
}

export function normalizeUserStatus(status) {
  return status === '禁用' || status === '已禁用' ? '禁用' : '正常'
}

export function cloneUser(user) {
  const u = JSON.parse(JSON.stringify(user))
  u.status = normalizeUserStatus(u.status)
  u.emergencyContacts = padEmergencyContacts(u.emergencyContacts)
  return u
}

export function emptyMedication() {
  return { name: '', dose: '', schedule: '', note: '' }
}

export function emptyReminder() {
  return { type: '用药', content: '', enabled: true, repeat: '每天' }
}
