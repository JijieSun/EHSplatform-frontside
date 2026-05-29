import { reactive, watch } from 'vue'
import { currentUser as demoUser, medications as defaultMeds, familyMessages as defaultMsgs } from '@/data/demoData'
import { defaultVoiceSettings } from '@/data/voiceConfig'
import { defaultUserArchive } from '@/data/userArchive'
import { normalizeMedication } from '@/data/medicationConfig'

const STORAGE_KEY = 'xiaoban_user_app'
export const MAX_FAMILY_MEMBERS = 3

const defaultFamily = [
  { id: 1, name: '张明', relation: '儿子', phone: '139****8820', online: true, notifySos: true },
  { id: 2, name: '张丽', relation: '女儿', phone: '136****3312', online: false, notifySos: true },
]

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function save() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      isLoggedIn: state.isLoggedIn,
      user: state.user,
      familyMembers: state.familyMembers,
      userArchive: state.userArchive,
      deviceNetwork: state.deviceNetwork,
      settings: state.settings,
      medications: state.medications,
      familyMessages: state.familyMessages,
      familyChats: state.familyChats,
      familyChatRead: state.familyChatRead,
    })
  )
}

export const state = reactive({
  isLoggedIn: false,
  user: null,
  familyMembers: [],
  userArchive: { ...defaultUserArchive },
  deviceNetwork: {
    connected: false,
    wifiName: '',
    signal: 0,
    deviceId: demoUser.deviceId,
    battery: 86,
    firmware: 'v2.1.0',
    lastSync: '—',
  },
  settings: {
    ...defaultVoiceSettings,
    medicationRemind: true,
    sosNotify: true,
    familyMsgNotify: true,
  },
  medications: [],
  familyMessages: [],
  familyChats: {},
  familyChatRead: {},
})

let nextFamilyId = 10
let nextMedId = 10
let nextMsgId = 10
let nextChatMsgId = 100

const avatarColors = ['#2b7de9', '#f5a623', '#52c41a', '#eb2f96', '#722ed1']

function defaultFamilyChats() {
  return {
    1: [
      { id: 101, role: 'family', text: '妈，周末我来看您，想吃什么跟我说。', isVoice: false, time: '昨天 18:30' },
      { id: 102, role: 'user', text: '好啊，妈等你回来。', isVoice: false, time: '昨天 19:05' },
    ],
    2: [
      { id: 103, role: 'family', text: '记得按时吃药，血压仪不会用随时打电话给我。', isVoice: false, time: '3 天前' },
    ],
  }
}

function cloneMeds() {
  return defaultMeds.map((m) => normalizeMedication({ ...m }))
}

function normalizeMedList(list) {
  return list.map((m) => normalizeMedication(m))
}

function cloneMsgs() {
  return defaultMsgs.map((m) => ({ ...m, read: false }))
}

function normalizeMessages(msgs) {
  return msgs.map((m) => ({ ...m, read: m.read === true }))
}

function init() {
  const saved = load()
  if (saved) {
    state.isLoggedIn = saved.isLoggedIn
    state.user = saved.user
    state.familyMembers = saved.familyMembers || []
    state.userArchive = { ...defaultUserArchive, ...saved.userArchive }
    state.deviceNetwork = { ...state.deviceNetwork, ...saved.deviceNetwork }
    state.settings = { ...state.settings, ...saved.settings }
    state.medications = saved.medications?.length
      ? normalizeMedList(saved.medications)
      : cloneMeds()
    state.familyMessages = saved.familyMessages?.length
      ? normalizeMessages(saved.familyMessages)
      : cloneMsgs()
    state.familyChats = saved.familyChats && Object.keys(saved.familyChats).length
      ? saved.familyChats
      : defaultFamilyChats()
    state.familyChatRead = saved.familyChatRead || {}
    nextFamilyId = Math.max(10, ...state.familyMembers.map((f) => f.id), 0) + 1
    nextMedId = Math.max(10, ...state.medications.map((m) => m.id), 0) + 1
    nextMsgId = Math.max(10, ...state.familyMessages.map((m) => m.id), 0) + 1
    nextChatMsgId = Math.max(100, ...Object.values(state.familyChats).flat().map((m) => m.id), 0) + 1
  } else {
    state.medications = cloneMeds()
    state.familyMessages = cloneMsgs()
    state.familyChats = defaultFamilyChats()
    state.familyChatRead = {}
    nextMedId = 4
    nextMsgId = 4
    nextChatMsgId = 200
  }
}

export function login({ phone, name, displayName }) {
  state.isLoggedIn = true
  state.user = {
    name: name || demoUser.name,
    displayName: displayName || demoUser.displayName,
    phone: phone || demoUser.phone,
    deviceId: demoUser.deviceId,
    companionDays: demoUser.companionDays,
    chatCount: demoUser.chatCount,
  }
  if (!state.userArchive?.name || state.userArchive.name === defaultUserArchive.name) {
    state.userArchive = {
      ...defaultUserArchive,
      name: state.user.name,
      displayName: state.user.displayName,
      phone: state.user.phone,
    }
  }
  if (state.familyMembers.length === 0) {
    state.familyMembers = defaultFamily.map((f) => ({ ...f }))
    nextFamilyId = 3
  }
  save()
}

export function register({ phone, name, displayName }) {
  login({ phone, name, displayName })
}

export function logout() {
  state.isLoggedIn = false
  state.user = null
  state.familyMembers = []
  save()
}

export function addFamilyMember(member) {
  if (state.familyMembers.length >= MAX_FAMILY_MEMBERS) return false
  state.familyMembers.push({
    id: nextFamilyId++,
    name: member.name,
    relation: member.relation,
    phone: member.phone,
    online: false,
    notifySos: member.notifySos !== false,
  })
  save()
  return true
}

export function updateFamilyMember(id, patch) {
  const item = state.familyMembers.find((f) => f.id === id)
  if (!item) return false
  Object.assign(item, patch)
  save()
  return true
}

export function deleteFamilyMember(id) {
  const idx = state.familyMembers.findIndex((f) => f.id === id)
  if (idx === -1) return false
  state.familyMembers.splice(idx, 1)
  save()
  return true
}

export function connectDevice() {
  const now = new Date()
  const p = (n) => String(n).padStart(2, '0')
  state.deviceNetwork.connected = true
  state.deviceNetwork.wifiName = '家庭 Wi-Fi_5G'
  state.deviceNetwork.signal = 92
  state.deviceNetwork.deviceId = state.user?.deviceId || demoUser.deviceId
  state.deviceNetwork.battery = 86
  state.deviceNetwork.lastSync = `${p(now.getHours())}:${p(now.getMinutes())}`
  save()
}

export function disconnectDevice() {
  state.deviceNetwork.connected = false
  state.deviceNetwork.wifiName = ''
  state.deviceNetwork.signal = 0
  state.deviceNetwork.lastSync = '—'
  save()
}

export function updateUserArchive(patch) {
  Object.assign(state.userArchive, patch)
  if (state.user) {
    if (patch.displayName) state.user.displayName = patch.displayName
    if (patch.name) state.user.name = patch.name
    if (patch.phone) state.user.phone = patch.phone
  }
  save()
}

export function updateSettings(patch) {
  Object.assign(state.settings, patch)
  save()
}

export function getEmergencyContact() {
  const members = state.familyMembers.filter((f) => f.notifySos !== false)
  const contact = members[0] || state.familyMembers[0]
  if (contact) {
    return {
      name: contact.name,
      relation: contact.relation,
      phone: contact.phone,
      dialPhone: contact.phone.replace(/\*/g, '0'),
    }
  }
  return {
    name: '张明',
    relation: '儿子',
    phone: '139****8820',
    dialPhone: '13900008820',
  }
}

export function resetVoiceSettings() {
  Object.assign(state.settings, { ...defaultVoiceSettings })
  save()
}

export function addMedication(med) {
  const item = normalizeMedication({ ...med, done: false })
  state.medications.push({
    id: nextMedId++,
    name: item.name,
    dose: item.dose,
    time: item.time,
    frequency: item.frequency,
    weekDays: item.weekDays,
    done: false,
  })
  save()
}

export function updateMedication(id, patch) {
  const item = state.medications.find((m) => m.id === id)
  if (!item) return false
  Object.assign(item, patch)
  save()
  return true
}

export function deleteMedication(id) {
  const idx = state.medications.findIndex((m) => m.id === id)
  if (idx === -1) return false
  state.medications.splice(idx, 1)
  save()
  return true
}

export function toggleMedicationDone(id) {
  const item = state.medications.find((m) => m.id === id)
  if (!item) return false
  item.done = !item.done
  save()
  return true
}

export function addFamilyMessage(msg) {
  state.familyMessages.unshift({
    id: nextMsgId++,
    from: msg.from,
    content: msg.content,
    time: msg.time || '刚刚',
    pinned: !!msg.pinned,
    read: false,
  })
  save()
}

export function updateFamilyMessage(id, patch) {
  const item = state.familyMessages.find((m) => m.id === id)
  if (!item) return false
  Object.assign(item, patch)
  save()
  return true
}

export function deleteFamilyMessage(id) {
  const idx = state.familyMessages.findIndex((m) => m.id === id)
  if (idx === -1) return false
  state.familyMessages.splice(idx, 1)
  save()
  return true
}

export function getDisplayFamilyMembers() {
  return state.familyMembers.length ? state.familyMembers : defaultFamily.map((f) => ({ ...f }))
}

export function getMemberAvatarColor(index) {
  return avatarColors[index % avatarColors.length]
}

export function getFamilyChat(memberId) {
  return state.familyChats[memberId] || []
}

export function getFamilyChatPreview(memberId) {
  const list = getFamilyChat(memberId)
  const last = list[list.length - 1]
  if (!last) return '暂无消息'
  return last.isVoice ? '[语音]' : last.text
}

export function getFamilyChatLastTime(memberId) {
  const list = getFamilyChat(memberId)
  const last = list[list.length - 1]
  return last?.time || ''
}

export function getMemberUnreadCount(memberId) {
  const lastReadId = state.familyChatRead[memberId] || 0
  return getFamilyChat(memberId).filter((m) => m.role === 'family' && m.id > lastReadId).length
}

export function markMemberChatRead(memberId) {
  const list = getFamilyChat(memberId)
  if (!list.length) return
  const lastId = list[list.length - 1].id
  if (state.familyChatRead[memberId] !== lastId) {
    state.familyChatRead[memberId] = lastId
    save()
  }
}

export function sendFamilyChatMessage(memberId, { role, text, isVoice, time }) {
  if (!state.familyChats[memberId]) state.familyChats[memberId] = []
  state.familyChats[memberId].push({
    id: nextChatMsgId++,
    role: role || 'family',
    text,
    isVoice: !!isVoice,
    time: time || '刚刚',
  })
  if (role === 'family') {
    const member = getDisplayFamilyMembers().find((f) => f.id === memberId)
    const from = member ? `${member.relation} ${member.name}` : '家人'
    addFamilyMessage({ from, content: text, time: time || '刚刚' })
  }
  save()
}

export function getCareBadgeCount() {
  const members = getDisplayFamilyMembers()
  const threadUnread = members.reduce((sum, m) => sum + getMemberUnreadCount(m.id), 0)
  const feedUnread = state.familyMessages.filter((m) => !m.read).length
  return Math.max(threadUnread, feedUnread)
}

export function markCareMessagesRead() {
  let changed = false
  state.familyMessages.forEach((m) => {
    if (!m.read) {
      m.read = true
      changed = true
    }
  })
  getDisplayFamilyMembers().forEach((m) => {
    markMemberChatRead(m.id)
  })
  if (changed) save()
}

watch(
  () => [state.familyMembers, state.settings, state.userArchive, state.deviceNetwork, state.medications, state.familyMessages, state.familyChats, state.familyChatRead],
  () => save(),
  { deep: true }
)

init()
