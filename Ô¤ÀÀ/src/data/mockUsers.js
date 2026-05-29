/** 演示用用户档案数据（管理后台） */
import { padEmergencyContacts } from './userProfile'

const rawUsers = [
  {
    id: 1,
    name: '张秀英',
    phone: '138****5621',
    deviceId: 'XB-20240312-001',
    status: '正常',
    age: 72,
    gender: '女',
    registerAt: '2024-03-12',
    habits: {
      height: '158 cm',
      weight: '55 kg',
      bloodType: 'A 型',
      sleepTime: '22:00 – 06:30',
      exercise: '每日散步 30 分钟',
      diet: '低盐低脂',
      chronic: '高血压',
    },
    medications: [
      { name: '苯磺酸氨氯地平', dose: '5mg', schedule: '每日 08:00', note: '餐后服用' },
      { name: '钙尔奇 D', dose: '1 片', schedule: '每日 12:30', note: '—' },
      { name: '阿司匹林肠溶片', dose: '100mg', schedule: '每日 20:00', note: '睡前' },
    ],
    reminders: [
      { type: '用药', content: '降压药 08:00', enabled: true, repeat: '每天' },
      { type: '用药', content: '钙片 12:30', enabled: true, repeat: '每天' },
      { type: '运动', content: '公园散步', enabled: true, repeat: '每天 16:00' },
      { type: '饮水', content: '喝水 200ml', enabled: true, repeat: '每 2 小时' },
      { type: '复诊', content: '心内科复查', enabled: true, repeat: '2026-06-15 09:00' },
    ],
    emergencyContacts: [
      { name: '张明', relation: '儿子', phone: '139****8820', priority: '主联系人', notifySos: true },
      { name: '张丽', relation: '女儿', phone: '136****3312', priority: '备用', notifySos: true },
      { name: '社区网格员', relation: '社区', phone: '021-****6688', priority: '备用', notifySos: false },
    ],
  },
  {
    id: 2,
    name: '李建国',
    phone: '159****1043',
    deviceId: 'XB-20240508-002',
    status: '正常',
    age: 68,
    gender: '男',
    registerAt: '2024-05-08',
    habits: {
      height: '172 cm',
      weight: '70 kg',
      bloodType: 'O 型',
      sleepTime: '21:30 – 05:30',
      exercise: '太极拳，每周 3 次',
      diet: '糖尿病饮食',
      chronic: '2 型糖尿病',
    },
    medications: [
      { name: '二甲双胍', dose: '0.5g', schedule: '每日 07:30、19:30', note: '餐前' },
      { name: '格列美脲', dose: '2mg', schedule: '每日 07:30', note: '餐前' },
    ],
    reminders: [
      { type: '用药', content: '二甲双胍（早）', enabled: true, repeat: '每天 07:30' },
      { type: '用药', content: '二甲双胍（晚）', enabled: true, repeat: '每天 19:30' },
      { type: '测血糖', content: '空腹血糖监测', enabled: true, repeat: '每天 06:00' },
      { type: '用餐', content: '午餐提醒', enabled: false, repeat: '每天 11:30' },
    ],
    emergencyContacts: [
      { name: '李芳', relation: '配偶', phone: '158****2201', priority: '主联系人', notifySos: true },
      { name: '李强', relation: '儿子', phone: '137****9903', priority: '备用', notifySos: true },
      { name: '', relation: '', phone: '', priority: '备用', notifySos: false },
    ],
  },
  {
    id: 3,
    name: '王美华',
    phone: '186****7789',
    deviceId: 'XB-20250120-003',
    status: '正常',
    age: 75,
    gender: '女',
    registerAt: '2025-01-20',
    habits: {
      height: '155 cm',
      weight: '52 kg',
      bloodType: 'B 型',
      sleepTime: '23:00 – 07:00',
      exercise: '室内保健操',
      diet: '清淡易嚼',
      chronic: '骨质疏松',
    },
    medications: [
      { name: '阿仑膦酸钠', dose: '70mg', schedule: '每周一 08:00', note: '空腹，服后勿躺' },
      { name: '碳酸钙 D3', dose: '600mg', schedule: '每日 20:00', note: '—' },
    ],
    reminders: [
      { type: '用药', content: '钙片', enabled: true, repeat: '每天 20:00' },
      { type: '用药', content: '阿仑膦酸钠', enabled: true, repeat: '每周一 08:00' },
      { type: '活动', content: '晒太阳 15 分钟', enabled: true, repeat: '每天 10:00' },
    ],
    emergencyContacts: [
      { name: '王磊', relation: '侄子', phone: '135****4410', priority: '主联系人', notifySos: true },
      { name: '', relation: '', phone: '', priority: '备用', notifySos: false },
      { name: '', relation: '', phone: '', priority: '备用', notifySos: false },
    ],
  },
  {
    id: 4,
    name: '陈德明',
    phone: '133****6654',
    deviceId: 'XB-20231102-004',
    status: '正常',
    age: 80,
    gender: '男',
    registerAt: '2023-11-02',
    habits: {
      height: '168 cm',
      weight: '62 kg',
      bloodType: 'AB 型',
      sleepTime: '22:30 – 06:00',
      exercise: '康复师指导训练',
      diet: '软食、少食多餐',
      chronic: '冠心病、轻度认知障碍',
    },
    medications: [
      { name: '硝酸甘油', dose: '0.5mg', schedule: '必要时舌下', note: '胸痛时' },
      { name: '瑞舒伐他汀', dose: '10mg', schedule: '每日 21:00', note: '—' },
      { name: '多奈哌齐', dose: '5mg', schedule: '每日 09:00', note: '—' },
    ],
    reminders: [
      { type: '用药', content: '瑞舒伐他汀', enabled: true, repeat: '每天 21:00' },
      { type: '用药', content: '多奈哌齐', enabled: true, repeat: '每天 09:00' },
      { type: '认知', content: '记忆训练小游戏', enabled: true, repeat: '每天 15:00' },
      { type: '复诊', content: '心内科随访', enabled: true, repeat: '2026-07-02 14:00' },
    ],
    emergencyContacts: [
      { name: '陈静', relation: '女儿', phone: '138****5520', priority: '主联系人', notifySos: true },
      { name: '陈浩', relation: '儿子', phone: '159****1188', priority: '备用', notifySos: true },
      { name: '护理站', relation: '机构', phone: '400-****9012', priority: '备用', notifySos: true },
    ],
  },
  {
    id: 5,
    name: '刘玉兰',
    phone: '177****3390',
    deviceId: '—',
    status: '禁用',
    age: 69,
    gender: '女',
    registerAt: '2024-08-15',
    habits: {
      height: '160 cm',
      weight: '58 kg',
      bloodType: 'A 型',
      sleepTime: '22:00 – 06:00',
      exercise: '—',
      diet: '普通',
      chronic: '—',
    },
    medications: [],
    reminders: [
      { type: '饮水', content: '喝水提醒', enabled: false, repeat: '每天' },
    ],
    emergencyContacts: [
      { name: '刘洋', relation: '儿子', phone: '136****7701', priority: '主联系人', notifySos: true },
      { name: '', relation: '', phone: '', priority: '备用', notifySos: false },
      { name: '', relation: '', phone: '', priority: '备用', notifySos: false },
    ],
  },
]

export const mockUsers = rawUsers.map((u) => ({
  ...u,
  emergencyContacts: padEmergencyContacts(u.emergencyContacts),
}))

export function getMockUserById(id) {
  return mockUsers.find((u) => u.id === id)
}
