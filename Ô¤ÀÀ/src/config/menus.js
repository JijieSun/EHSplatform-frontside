/** 一级菜单 + 二级子菜单：首页 → 用户档案 → 回忆录 → 知识库 → 养老设备管理 → AI引擎设置 → 系统管理 */
export const menuTree = [
  {
    key: 'dashboard',
    title: '首页',
    icon: 'Odometer',
    path: '/dashboard',
    roles: ['super_admin', 'operator', 'specialist', 'readonly'],
    children: [],
  },
  {
    key: 'users',
    title: '用户档案',
    icon: 'User',
    roles: ['super_admin', 'operator', 'specialist', 'readonly'],
    children: [
      { key: 'user-list', title: '全量用户列表', path: '/users/list' },
      { key: 'user-qa', title: '短期问答档案', path: '/users/qa-archive' },
      { key: 'user-chat', title: '历史对话记录', path: '/users/chat-history' },
    ],
  },
  {
    key: 'memoir',
    title: '回忆录',
    icon: 'Notebook',
    roles: ['super_admin', 'operator', 'specialist', 'readonly'],
    children: [
      { key: 'memoir-questions', title: '问题库', path: '/memoir/question-bank' },
      { key: 'memoir-manage', title: '个人回忆录管理', path: '/users/memoir' },
    ],
  },
  {
    key: 'knowledge',
    title: '知识库',
    icon: 'Reading',
    roles: ['super_admin', 'operator', 'specialist', 'readonly'],
    children: [
      { key: 'kb-list', title: '知识库列表', path: '/knowledge/list' },
      { key: 'kb-audit', title: '内容审核中心', path: '/knowledge/audit' },
      { key: 'kb-stats', title: '知识库数据统计', path: '/knowledge/stats' },
    ],
  },
  {
    key: 'elder-care',
    title: '养老设备管理',
    icon: 'FirstAidKit',
    roles: ['super_admin', 'operator', 'specialist', 'readonly'],
    children: [
      { key: 'ec-sos', title: '紧急呼救记录', path: '/elder-care/sos', alert: true },
      { key: 'ec-family', title: '亲情账号绑定', path: '/elder-care/family' },
      { key: 'ec-message', title: '呼救内容管理', path: '/elder-care/message' },
      { key: 'ec-community', title: '社区服务对接', path: '/elder-care/community' },
      { key: 'ec-iot', title: '养老物联设备', path: '/elder-care/iot' },
    ],
  },
  {
    key: 'ai',
    title: 'AI引擎设置',
    icon: 'Cpu',
    roles: ['super_admin', 'operator'],
    children: [
      { key: 'ai-voice-dialog', title: '语音对话参数配置', path: '/ai/voice-dialog' },
      { key: 'ai-memory', title: '心智 & 记忆管理', path: '/ai/memory' },
    ],
  },
  {
    key: 'system',
    title: '系统管理',
    icon: 'Setting',
    roles: ['super_admin'],
    children: [
      { key: 'sys-account', title: '账号权限管理', path: '/system/account' },
      { key: 'sys-security', title: '数据安全与存储', path: '/system/security' },
      { key: 'sys-log', title: '操作日志审计', path: '/system/log' },
      { key: 'sys-version', title: '前端版本 & 参数配置', path: '/system/version' },
    ],
  },
]

export const roleOptions = [
  { value: 'super_admin', label: '超级管理员' },
  { value: 'operator', label: '运营人员' },
  { value: 'specialist', label: '普通专员' },
  { value: 'readonly', label: '只读账号' },
]
