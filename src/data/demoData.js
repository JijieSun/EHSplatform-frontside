/** 用户端演示数据（独立，不依赖管理后台） */
export const currentUser = {
  name: '张秀英',
  displayName: '张阿姨',
  phone: '138****5621',
  deviceId: 'XB-20240312-001',
  registerAt: '2024-03-12',
  companionDays: 442,
  chatCount: 2340,
}

export { collectProgress } from './collectQuestions'

export const medications = [
  { id: 1, name: '苯磺酸氨氯地平', dose: '5mg', time: '08:00', frequency: 'daily', weekDays: [], done: true },
  { id: 2, name: '钙尔奇 D', dose: '1 片', time: '12:30', frequency: 'daily', weekDays: [], done: false },
  { id: 3, name: '阿司匹林肠溶片', dose: '100mg', time: '20:00', frequency: 'weekdays', weekDays: [], done: false },
]

export const familyMessages = [
  { id: 1, from: '儿子 张明', content: '妈，周末我来看您，想吃什么跟我说。', time: '昨天 18:30', pinned: true },
  { id: 2, from: '女儿 张丽', content: '记得按时吃药，血压仪不会用随时打电话给我。', time: '3 天前', pinned: false },
  { id: 3, from: '社区网格员', content: '本周三下午有免费血压检测，需要帮您预约吗？', time: '上周', pinned: false },
]

export const familyMembers = [
  { name: '张明', relation: '儿子', online: true },
  { name: '张丽', relation: '女儿', online: false },
]

export const communityServices = [
  { id: 1, name: '社区日间照料', provider: '阳光社区服务中心', icon: '🏠', desc: '周一至周五 8:00–17:00，提供休息、活动、午餐', status: 'online', statusText: '可预约' },
  { id: 2, name: '上门血压检测', provider: '社区卫生站', icon: '🩺', desc: '免费上门测量血压血糖，需提前 1 天预约', status: 'online', statusText: '可预约' },
  { id: 3, name: '助餐配送', provider: '爱心食堂', icon: '🍱', desc: '低盐老年餐，每日 11:30 送达', status: 'busy', statusText: '名额紧张' },
  { id: 4, name: '康复理疗', provider: '社区康复站', icon: '💪', desc: '肩颈康复、步态训练，每周二、四开放', status: 'online', statusText: '可预约' },
]

export const iotDevices = [
  { id: 1, name: '入户门磁', type: '门磁', sn: 'MC-XB-001', online: true, lastOnline: '11:20', log: '设备心跳正常' },
  { id: 2, name: '客厅跌倒雷达', type: '跌倒探测仪', sn: 'FD-XB-002', online: true, lastOnline: '11:18', log: '雷达扫描正常' },
]

export const knowledgeList = [
  { id: 1, q: '高血压日常注意事项', a: '低盐低脂、多吃蔬果、控制体重、规律监测血压…', hits: 892 },
  { id: 2, q: '如何设置用药提醒', a: '在守护页查看用药列表，或在语音设置中开启提醒…', hits: 654 },
  { id: 3, q: '降压药可以一起吃吗？', a: '需遵医嘱，不可自行增减或混用…', hits: 318 },
]

export const chatHistory = [
  { id: 1, date: '今天', preview: '询问今日血压记录与服药；确认已服降压药', time: '10:12', mode: '自由对话' },
  { id: 2, date: '今天', preview: '讨论回忆录「胡同夏天」片段', time: '19:40', mode: '自由对话' },
  { id: 3, date: '昨天', preview: '空腹血糖咨询，确认用药时间', time: '09:38', mode: '知识问答' },
]

export const memoirChapters = [
  { id: 1, title: '第一章 · 弄堂里的夏天', excerpt: '小时候住在上海弄堂，傍晚邻居们一起在门口摇扇子…' },
  { id: 2, title: '第二章 · 纺织厂岁月', excerpt: '十八岁那年进了纺织厂，师傅待我很好…' },
  { id: 3, title: '第三章 · 成家立业', excerpt: '和你爷爷相识于同事介绍，婚礼很简单但很热闹…' },
]

export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return '早上好'
  if (h < 18) return '下午好'
  return '晚上好'
}
