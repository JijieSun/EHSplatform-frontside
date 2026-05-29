import { activeEmergencyContacts } from './userProfile'

/** 亲情账号绑定列表（由用户档案紧急联系人同步） */
export let familyBindingRows = []

/**
 * 从用户列表中的紧急联系人同步亲情账号绑定
 * @param {import('./mockUsers').mockUsers} users
 */
export function syncFamilyBindingsFromUsers(users) {
  const rows = []
  users.forEach((user) => {
    activeEmergencyContacts(user.emergencyContacts).forEach((c, idx) => {
      rows.push({
        id: `${user.id}-${idx}`,
        userId: user.id,
        elderUser: user.name,
        elderPhone: user.phone,
        deviceId: user.deviceId || '—',
        familyName: c.name,
        familyPhone: c.phone,
        relation: c.relation,
        priority: c.priority,
        notifySos: c.notifySos,
        syncedAt: formatSyncTime(),
        source: '用户档案 · 紧急联系人',
      })
    })
  })
  familyBindingRows = rows
  return rows
}

function formatSyncTime() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
