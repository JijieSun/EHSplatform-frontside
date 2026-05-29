/* 智能陪伴机器人 - 管理后台前端演示版（独立运行，无需 Node.js） */
const { createApp, ref, computed, watch, onMounted } = Vue
const { ElMessage, ElMessageBox } = ElementPlus

const ROLE_CAPS = {
  super_admin: ['view', 'create', 'update', 'delete', 'export', 'audit'],
  operator: ['view', 'create', 'update', 'export', 'audit'],
  specialist: ['view', 'export', 'audit'],
  readonly: ['view'],
}

const ROLE_OPTIONS = [
  { value: 'super_admin', label: '超级管理员' },
  { value: 'operator', label: '运营人员' },
  { value: 'specialist', label: '普通专员' },
  { value: 'readonly', label: '只读账号' },
]

const MENU_TREE = [
  { key: 'dashboard', title: '首页', icon: 'Odometer', path: '/dashboard', roles: ['super_admin', 'operator', 'specialist', 'readonly'], children: [] },
  {
    key: 'users', title: '用户档案', icon: 'User', roles: ['super_admin', 'operator', 'specialist', 'readonly'],
    children: [
      { path: '/users/list', title: '全量用户列表' },
      { path: '/users/qa-archive', title: '短期问答档案' },
      { path: '/users/chat-history', title: '历史对话记录' },
    ],
  },
  {
    key: 'memoir', title: '回忆录', icon: 'Notebook', roles: ['super_admin', 'operator', 'specialist', 'readonly'],
    children: [
      { path: '/memoir/question-bank', title: '问题库' },
      { path: '/users/memoir', title: '个人回忆录管理' },
    ],
  },
  {
    key: 'knowledge', title: '知识库', icon: 'Reading', roles: ['super_admin', 'operator', 'specialist', 'readonly'],
    children: [
      { path: '/knowledge/list', title: '知识库列表' },
      { path: '/knowledge/audit', title: '内容审核中心' },
      { path: '/knowledge/stats', title: '知识库数据统计' },
    ],
  },
  {
    key: 'elder-care', title: '养老设备管理', icon: 'FirstAidKit', roles: ['super_admin', 'operator', 'specialist', 'readonly'],
    children: [
      { path: '/elder-care/sos', title: '紧急呼救记录', alert: true },
      { path: '/elder-care/family', title: '亲情账号绑定' },
      { path: '/elder-care/message', title: '呼救内容管理' },
      { path: '/elder-care/community', title: '社区服务对接' },
      { path: '/elder-care/iot', title: '养老物联设备' },
    ],
  },
  {
    key: 'ai', title: 'AI引擎设置', icon: 'Cpu', roles: ['super_admin', 'operator'],
    children: [
      { path: '/ai/voice-dialog', title: '语音对话参数配置', type: 'voice-dialog' },
      { path: '/ai/memory', title: '心智 & 记忆管理', type: 'ai-memory' },
    ],
  },
  {
    key: 'system', title: '系统管理', icon: 'Setting', roles: ['super_admin'],
    children: [
      { path: '/system/account', title: '账号权限管理' },
      { path: '/system/security', title: '数据安全与存储' },
      { path: '/system/log', title: '操作日志审计' },
      { path: '/system/version', title: '前端版本 & 参数配置' },
    ],
  },
]

const PAGE_META = {
  '/question-bank/list': { title: '题库列表', cols: ['题目', '分类', '状态'], actions: 'qb-list', rows: true },
  '/question-bank/category': { title: '题库分类管理', cols: ['分类名称', '题目数'], actions: 'qb-category' },
  '/question-bank/task': { title: '采集任务监控', cols: ['用户', '进度', '状态'], actions: 'qb-task' },
  '/users/list': { title: '全量用户列表', type: 'user-list', actions: 'users-list' },
  '/users/qa-archive': { title: '短期问答档案', type: 'short-qa', actions: 'users-qa' },
  '/users/chat-history': { title: '历史对话记录', type: 'chat-archive', actions: 'users-chat', date: true },
  '/memoir/question-bank': { title: '回忆录问题库', type: 'memoir-qb', actions: 'memoir-qb' },
  '/users/memoir': { title: '个人回忆录管理', type: 'memoir-manage', actions: 'users-memoir' },
  '/ai/voice-dialog': { title: '语音对话参数配置', type: 'voice-dialog', actions: 'ai-voice-dialog' },
  '/ai/memory': { title: '心智 & 记忆管理', type: 'ai-memory', actions: 'ai-memory' },
  '/elder-care/sos': { title: '紧急呼救记录', cols: ['用户', '呼救时间', '处理状态'], actions: 'ec-sos', date: true, status: true },
  '/elder-care/family': { title: '亲情账号绑定', type: 'ec-family', actions: 'ec-family' },
  '/elder-care/message': { title: '呼救内容管理', type: 'ec-message', actions: 'ec-message' },
  '/elder-care/community': { title: '社区服务对接', type: 'ec-community', actions: 'ec-community' },
  '/elder-care/iot': { title: '养老物联设备', type: 'ec-iot', actions: 'ec-iot' },
  '/knowledge/list': { title: '知识库列表', cols: ['标准问', '标准答', '状态'], actions: 'kb-list', rows: true },
  '/knowledge/audit': { title: '内容审核中心', type: 'kb-audit', actions: 'kb-audit' },
  '/knowledge/stats': { title: '知识库数据统计', cols: ['热门问题', '命中次数', '解决率'], actions: 'kb-stats', date: true },
  '/system/account': { title: '账号权限管理', type: 'sys-account', actions: 'sys-account' },
  '/account/settings': { title: '账号设置', type: 'account-settings' },
  '/system/security': { title: '数据安全与存储', cols: ['监控项', '当前值', '状态'], actions: 'sys-security' },
  '/system/log': { title: '操作日志审计', cols: ['操作账号', '操作内容', '时间'], actions: 'sys-log', date: true },
  '/system/version': { title: '前端版本 & 参数配置', cols: ['版本号', '渠道', '发布状态'], actions: 'sys-version' },
}

const PAGE_ACTIONS = {
  dashboard: [
    { label: '刷新数据', type: 'default', perm: 'view' },
    { label: '数据导出', type: 'export', perm: 'export', cls: 'btn-export' },
    { label: '告警查看', type: 'danger', perm: 'view', cls: 'btn-alert' },
    { label: '题库新增', type: 'primary', perm: 'create', shortcut: true, go: '/question-bank/list' },
    { label: '内容审核', type: 'primary', perm: 'audit', shortcut: true, go: '/knowledge/audit' },
    { label: '紧急呼救', type: 'danger', perm: 'view', shortcut: true, cls: 'btn-alert', go: '/elder-care/sos' },
  ],
  'qb-list': [
    { label: '新增题目', type: 'primary', perm: 'create' },
    { label: '批量导入', type: 'primary', perm: 'create' },
    { label: '批量导出', type: 'export', perm: 'export', cls: 'btn-export' },
    { label: '批量启用/禁用', type: 'default', perm: 'update', batch: true },
    { label: '刷新', type: 'default', perm: 'view' },
    { label: '分类筛选', type: 'default', perm: 'view' },
  ],
  'qb-category': [
    { label: '新增分类', type: 'primary', perm: 'create' },
    { label: '排序', type: 'default', perm: 'update' },
  ],
  'qb-task': [
    { label: '筛选用户', type: 'default', perm: 'view' },
    { label: '查看采集进度', type: 'default', perm: 'view' },
    { label: '重置采集', type: 'danger', perm: 'delete' },
    { label: '导出采集报表', type: 'export', perm: 'export', cls: 'btn-export' },
  ],
  'users-list': [
    { label: '新增用户', type: 'primary', perm: 'create' },
    { label: '批量导入', type: 'primary', perm: 'create' },
    { label: '导出用户档案', type: 'export', perm: 'export', cls: 'btn-export' },
    { label: '账号解绑', type: 'danger', perm: 'delete', batch: true },
  ],
  'users-qa': [
    { label: '手动重生成摘要', type: 'primary', perm: 'update' },
    { label: '导出档案', type: 'export', perm: 'export', cls: 'btn-export' },
  ],
  'users-chat': [
    { label: '导出记录', type: 'export', perm: 'export', cls: 'btn-export' },
    { label: '敏感内容标记', type: 'danger', perm: 'update' },
  ],
  'memoir-qb': [
    { label: '新增题目', type: 'primary', perm: 'create' },
    { label: 'Word 批量导入', type: 'primary', perm: 'create' },
    { label: '导出问题库', type: 'export', perm: 'export', cls: 'btn-export' },
  ],
  'users-memoir': [
    { label: '批量重新生成', type: 'primary', perm: 'update' },
    { label: '归档已完成', type: 'default', perm: 'update' },
    { label: '导出文件', type: 'export', perm: 'export', cls: 'btn-export' },
  ],
  'ai-voice-dialog': [
    { label: '保存配置', type: 'primary', perm: 'update' },
    { label: '恢复默认', type: 'default', perm: 'update' },
    { label: '音色试听', type: 'default', perm: 'view', fold: true },
    { label: '测试语音', type: 'default', perm: 'view', fold: true },
  ],
  'ai-memory': [
    { label: '保存配置', type: 'primary', perm: 'update' },
    { label: '重置用户记忆', type: 'danger', perm: 'delete' },
    { label: '关闭长期记忆', type: 'danger', perm: 'update' },
  ],
  'ec-sos': [
    { label: '时间筛选', type: 'default', perm: 'view' },
    { label: '状态标记', type: 'primary', perm: 'audit', highlight: true },
    { label: '一键通知家属', type: 'danger', perm: 'update', highlight: true, cls: 'btn-alert' },
    { label: '导出记录', type: 'export', perm: 'export', cls: 'btn-export' },
  ],
  'ec-family': [
    { label: '同步用户档案', type: 'primary', perm: 'view' },
    { label: '导出绑定表', type: 'export', perm: 'export', cls: 'btn-export' },
  ],
  'ec-message': [
    { label: '查看记录', type: 'default', perm: 'view' },
    { label: '置顶重要内容', type: 'primary', perm: 'update' },
    { label: '删除无效记录', type: 'danger', perm: 'delete' },
    { label: '导出呼救内容', type: 'export', perm: 'export', cls: 'btn-export' },
  ],
  'ec-community': [
    { label: '新增服务', type: 'primary', perm: 'create' },
    { label: '服务订单查看', type: 'default', perm: 'view' },
  ],
  'ec-iot': [
    { label: '刷新设备状态', type: 'primary', perm: 'view' },
    { label: '导出设备清单', type: 'export', perm: 'export', cls: 'btn-export' },
    { label: '导出设备日志', type: 'export', perm: 'export', cls: 'btn-export' },
  ],
  'kb-list': [
    { label: '新增知识点', type: 'primary', perm: 'create' },
    { label: '批量导入', type: 'primary', perm: 'create' },
    { label: '导出', type: 'export', perm: 'export', cls: 'btn-export' },
    { label: '审核通过', type: 'primary', perm: 'audit', batch: true },
    { label: '驳回', type: 'danger', perm: 'audit', batch: true },
  ],
  'kb-audit': [
    { label: '提交审核申请', type: 'primary', perm: 'create' },
    { label: '批量审核', type: 'primary', perm: 'audit', batch: true, superOnly: true },
    { label: '一键驳回', type: 'danger', perm: 'audit', superOnly: true },
    { label: '标记待优化', type: 'default', perm: 'audit', superOnly: true },
    { label: '我的申请记录', type: 'default', perm: 'view' },
  ],
  'kb-stats': [
    { label: '时间筛选', type: 'default', perm: 'view' },
    { label: '导出统计报表', type: 'export', perm: 'export', cls: 'btn-export' },
  ],
  'sys-account': [
    { label: '新增账号', type: 'primary', perm: 'create' },
    { label: '重置密码', type: 'default', perm: 'update' },
    { label: '禁用账号', type: 'danger', perm: 'delete' },
  ],
  'sys-security': [
    { label: '手动备份数据', type: 'primary', perm: 'update' },
    { label: '查看存储状态', type: 'default', perm: 'view' },
    { label: '加密规则配置', type: 'primary', perm: 'update' },
    { label: '数据归档', type: 'default', perm: 'update' },
  ],
  'sys-log': [
    { label: '时间筛选', type: 'default', perm: 'view' },
    { label: '日志检索', type: 'default', perm: 'view' },
    { label: '导出日志', type: 'export', perm: 'export', cls: 'btn-export' },
  ],
  'sys-version': [
    { label: '发布配置', type: 'primary', perm: 'update' },
    { label: '版本回滚', type: 'danger', perm: 'delete' },
    { label: '小程序/APP 参数同步', type: 'primary', perm: 'update' },
  ],
}

const EC_SLOTS = 3
function emptyEc(i) {
  return { name: '', relation: '', phone: '', priority: i === 0 ? '主联系人' : '备用', notifySos: i === 0 }
}
function padEc(list) {
  const a = (list || []).filter((c) => c?.name?.trim() || c?.phone?.trim()).slice(0, EC_SLOTS)
  while (a.length < EC_SLOTS) a.push(emptyEc(a.length))
  return a.slice(0, EC_SLOTS)
}
function cloneUser(u) {
  const x = JSON.parse(JSON.stringify(u))
  x.status = x.status === '禁用' || x.status === '已禁用' ? '禁用' : '正常'
  x.emergencyContacts = padEc(x.emergencyContacts)
  return x
}
function activeEc(list) {
  return (list || []).filter((c) => c?.name?.trim() || c?.phone?.trim())
}
function buildFamilyBindings(users) {
  const rows = []
  users.forEach((user) => {
    activeEc(user.emergencyContacts).forEach((c) => {
      rows.push({
        elderUser: user.name,
        elderPhone: user.phone,
        deviceId: user.deviceId && user.deviceId !== '—' ? user.deviceId : '未绑定',
        familyName: c.name || '—',
        familyPhone: c.phone || '—',
        relation: c.relation || '—',
        priority: c.priority || '—',
        notifySos: c.notifySos,
      })
    })
  })
  return rows
}

const SOS_MESSAGES = [
  { userName: '张秀英', userPhone: '138****5621', sosId: 'SOS-20260528-001', sender: '张秀英（用户）', content: '我不舒服，帮我联系儿子……', time: '2026-05-28 10:32:05', pinned: true },
  { userName: '张秀英', userPhone: '138****5621', sosId: 'SOS-20260528-001', sender: '机器人小伴', content: '已为您联系主联系人张明，正在等待接听。', time: '2026-05-28 10:32:18', pinned: false },
  { userName: '张秀英', userPhone: '138****5621', sosId: 'SOS-20260528-001', sender: '张明（家属）', content: '妈你别急，我马上过来。', time: '2026-05-28 10:33:02', pinned: true },
  { userName: '李建国', userPhone: '159****1043', sosId: 'SOS-20260527-008', sender: '李建国（用户）', content: '头晕，需要帮助。', time: '2026-05-27 19:15:40', pinned: false },
]

const COMMUNITY_ORDERS = [
  { id: 1, category: '家政', serviceItem: '全屋保洁 + 厨房深度清洁', staff: '王阿姨', appointmentAt: '2026-05-29 09:00', userName: '张秀英', userPhone: '138****5621', status: '待服务' },
  { id: 2, category: '陪诊', serviceItem: '市一医院心内科复诊陪同', staff: '', appointmentAt: '2026-05-30 08:30', userName: '李建国', userPhone: '159****1043', status: '待分配' },
  { id: 3, category: '物业', serviceItem: '卫生间漏水报修上门', staff: '', appointmentAt: '2026-05-28 14:00', userName: '王美华', userPhone: '186****7789', status: '待分配' },
  { id: 4, category: '陪诊', serviceItem: '体检报告解读陪同', staff: '李护士', appointmentAt: '2026-05-27 10:00', userName: '陈德明', userPhone: '133****6654', status: '已完成' },
]

const COMMUNITY_STAFF_POOL = {
  家政: ['王阿姨', '李阿姨', '赵姐'],
  陪诊: ['李护士', '陈护士', '陪诊员小刘'],
  物业: ['物业张师傅', '物业老刘', '维修小王'],
}

const VOICE_ROLE_TEMPLATES = [
  { key: 'warm', label: '温暖陪伴', nickname: '小伴', language: '普通话', timbre: '温婉阿姨', intro: '你是专为老年人设计的情感陪伴机器人，性格温暖、耐心、善于倾听。说话语速偏慢、用词简单。' },
  { key: 'neighbor', label: '邻家晚辈', nickname: '小伴', language: '普通话', timbre: '邻家女孩', intro: '像家里晚辈一样亲切，主动关心老人起居，聊天时多复述确认。' },
  { key: 'nurse', label: '专业护理', nickname: '护理小伴', language: '普通话', timbre: '沉稳男声', intro: '具备基础健康管理常识，回答用药、作息问题时严谨条理，建议必要时就医。' },
  { key: 'shanghai', label: '沪语阿姨', nickname: '小伴', language: '沪语', timbre: '温婉阿姨', intro: '主要使用沪语与老人交流，语气热络亲切，适合本地老年用户。' },
  { key: 'butler', label: '沉稳管家', nickname: '小伴', language: '普通话', timbre: '成熟男声', intro: '语气沉稳可靠，擅长提醒日程、用药与设备使用，重要事项会重复确认。' },
]

const IOT_DEVICES = [
  { id: 'IOT-001', userName: '张秀英', userPhone: '138****5621', deviceType: '门磁', deviceName: '入户门磁', deviceSn: 'MC-XB-01', online: true, lastOnline: '2026-05-28 11:20', bindAt: '2024-03-12', logs: [{ time: '2026-05-28 11:20', level: 'info', message: '设备心跳正常' }, { time: '2026-05-28 07:15', level: 'warn', message: '门磁开启 · 外出' }] },
  { id: 'IOT-002', userName: '张秀英', userPhone: '138****5621', deviceType: '跌倒探测仪', deviceName: '客厅跌倒雷达', deviceSn: 'FD-XB-02', online: true, lastOnline: '2026-05-28 11:18', bindAt: '2024-03-12', logs: [{ time: '2026-05-28 11:18', level: 'info', message: '雷达扫描正常' }] },
  { id: 'IOT-003', userName: '李建国', userPhone: '159****1043', deviceType: '烟雾报警器', deviceName: '厨房烟感', deviceSn: 'SM-XB-01', online: false, lastOnline: '2026-05-27 09:33', bindAt: '2024-05-08', logs: [{ time: '2026-05-27 09:33', level: 'warn', message: '设备离线 · 电量不足' }] },
  { id: 'IOT-004', userName: '王美华', userPhone: '186****7789', deviceType: '跌倒探测仪', deviceName: '卧室跌倒探测', deviceSn: 'FD-XB-03', online: true, lastOnline: '2026-05-28 11:05', bindAt: '2025-01-20', logs: [{ time: '2026-05-28 11:05', level: 'info', message: '无异常活动' }] },
]

const IOT_DEVICE_TYPES = ['门磁', '跌倒探测仪', '烟雾报警器']
const SERVICE_CATEGORIES = ['家政', '陪诊', '物业']

const HEADER_MESSAGES = [
  { id: 1, title: '紧急呼救待处理', desc: '张秀英 10:32 发起呼救', path: '/elder-care/sos', type: 'danger', time: '10:32' },
  { id: 2, title: '知识库待审核', desc: '12 条待审内容', path: '/knowledge/audit', type: 'warning', time: '09:15' },
  { id: 3, title: '社区服务待分配', desc: '2 条未分配需求', path: '/elder-care/community', type: 'warning', time: '昨日' },
]

const PERM_OPTIONS = [
  { key: 'view', label: '查看' },
  { key: 'create', label: '新增' },
  { key: 'update', label: '编辑' },
  { key: 'delete', label: '删除' },
  { key: 'export', label: '导出' },
  { key: 'audit', label: '审核' },
]

const ADMIN_ACCOUNTS = [
  { id: 1, account: 'admin', displayName: '系统管理员', role: 'super_admin', status: '正常', permissions: ['view', 'create', 'update', 'delete', 'export', 'audit'] },
  { id: 2, account: 'operator01', displayName: '运营-小王', role: 'operator', status: '正常', permissions: ['view', 'create', 'update', 'export', 'audit'] },
  { id: 3, account: 'specialist01', displayName: '专员-小李', role: 'specialist', status: '正常', permissions: ['view', 'export', 'audit'] },
  { id: 4, account: 'readonly01', displayName: '只读-小张', role: 'readonly', status: '禁用', permissions: ['view'] },
]

const KB_AUDIT_PENDING = [
  { content: '高血压患者能否剧烈运动？', submitter: '运营-小王', submittedAt: '2026-05-28 09:10', status: '待审核' },
  { content: '糖尿病饮食禁忌补充条目', submitter: '专员-小李', submittedAt: '2026-05-27 16:20', status: '待审核' },
  { content: '沪语播报语速建议', submitter: '运营-小张', submittedAt: '2026-05-27 11:00', status: '待优化' },
]

const USER_INITIAL = [
  {
    id: 1, name: '张秀英', phone: '138****5621', deviceId: 'XB-20240312-001', status: '正常', age: 72, gender: '女', registerAt: '2024-03-12',
    habits: { height: '158 cm', weight: '55 kg', bloodType: 'A 型', sleepTime: '22:00 – 06:30', exercise: '每日散步 30 分钟', diet: '低盐低脂', chronic: '高血压' },
    medications: [
      { name: '苯磺酸氨氯地平', dose: '5mg', schedule: '每日 08:00', note: '餐后服用' },
      { name: '钙尔奇 D', dose: '1 片', schedule: '每日 12:30', note: '—' },
    ],
    reminders: [
      { type: '用药', content: '降压药 08:00', enabled: true, repeat: '每天' },
      { type: '运动', content: '公园散步', enabled: true, repeat: '每天 16:00' },
    ],
    emergencyContacts: padEc([
      { name: '张明', relation: '儿子', phone: '139****8820', priority: '主联系人', notifySos: true },
      { name: '张丽', relation: '女儿', phone: '136****3312', priority: '备用', notifySos: true },
      { name: '社区网格员', relation: '社区', phone: '021-****6688', priority: '备用', notifySos: false },
    ]),
  },
  {
    id: 2, name: '李建国', phone: '159****1043', deviceId: 'XB-20240508-002', status: '正常', age: 68, gender: '男', registerAt: '2024-05-08',
    habits: { height: '172 cm', weight: '70 kg', bloodType: 'O 型', sleepTime: '21:30 – 05:30', exercise: '太极拳，每周 3 次', diet: '糖尿病饮食', chronic: '2 型糖尿病' },
    medications: [{ name: '二甲双胍', dose: '0.5g', schedule: '每日 07:30、19:30', note: '餐前' }],
    reminders: [{ type: '用药', content: '二甲双胍（早）', enabled: true, repeat: '每天 07:30' }],
    emergencyContacts: padEc([
      { name: '李芳', relation: '配偶', phone: '158****2201', priority: '主联系人', notifySos: true },
      { name: '李强', relation: '儿子', phone: '137****9903', priority: '备用', notifySos: true },
    ]),
  },
  {
    id: 3, name: '王美华', phone: '186****7789', deviceId: 'XB-20250120-003', status: '正常', age: 75, gender: '女', registerAt: '2025-01-20',
    habits: { height: '155 cm', weight: '52 kg', bloodType: 'B 型', sleepTime: '23:00 – 07:00', exercise: '室内保健操', diet: '清淡易嚼', chronic: '骨质疏松' },
    medications: [{ name: '碳酸钙 D3', dose: '600mg', schedule: '每日 20:00', note: '—' }],
    reminders: [{ type: '用药', content: '钙片', enabled: true, repeat: '每天 20:00' }],
    emergencyContacts: padEc([{ name: '王磊', relation: '侄子', phone: '135****4410', priority: '主联系人', notifySos: true }]),
  },
  {
    id: 4, name: '陈德明', phone: '133****6654', deviceId: 'XB-20231102-004', status: '正常', age: 80, gender: '男', registerAt: '2023-11-02',
    habits: { height: '168 cm', weight: '62 kg', bloodType: 'AB 型', sleepTime: '22:30 – 06:00', exercise: '康复师指导训练', diet: '软食、少食多餐', chronic: '冠心病、轻度认知障碍' },
    medications: [
      { name: '瑞舒伐他汀', dose: '10mg', schedule: '每日 21:00', note: '—' },
      { name: '多奈哌齐', dose: '5mg', schedule: '每日 09:00', note: '—' },
    ],
    reminders: [{ type: '用药', content: '瑞舒伐他汀', enabled: true, repeat: '每天 21:00' }],
    emergencyContacts: padEc([
      { name: '陈静', relation: '女儿', phone: '138****5520', priority: '主联系人', notifySos: true },
      { name: '护理站', relation: '机构', phone: '400-****9012', priority: '备用', notifySos: true },
    ]),
  },
  {
    id: 5, name: '刘玉兰', phone: '177****3390', deviceId: '—', status: '禁用', age: 69, gender: '女', registerAt: '2024-08-15',
    habits: { height: '160 cm', weight: '58 kg', bloodType: 'A 型', sleepTime: '22:00 – 06:00', exercise: '—', diet: '普通', chronic: '—' },
    medications: [],
    reminders: [{ type: '饮水', content: '喝水提醒', enabled: false, repeat: '每天' }],
    emergencyContacts: padEc([{ name: '刘洋', relation: '儿子', phone: '136****7701', priority: '主联系人', notifySos: true }]),
  },
]

const SHORT_QA_RECORDS = [
  { id: 1, userName: '张秀英', phone: '138****5621', wordCount: 1986, updatedAt: '2026-05-28 10:15', summary: '用户近期关注血压管理与日常作息。偏好早晨散步……（当前记忆约2000字，每次对话后重生成）' },
  { id: 2, userName: '李建国', phone: '159****1043', wordCount: 2012, updatedAt: '2026-05-28 09:42', summary: '糖尿病患者，重视空腹血糖监测。确认二甲双胍餐前服用……' },
  { id: 3, userName: '王美华', phone: '186****7789', wordCount: 1754, updatedAt: '2026-05-27 16:30', summary: '骨质疏松咨询，钙片服用注意事项……' },
  { id: 4, userName: '陈德明', phone: '133****6654', wordCount: 1998, updatedAt: '2026-05-28 08:05', summary: '冠心病与轻度认知障碍，记忆训练互动积极……' },
  { id: 5, userName: '刘玉兰', phone: '177****3390', wordCount: 892, updatedAt: '2026-05-20 14:00', summary: '账号已禁用，短期记忆生成暂停。' },
]
const MEMOIR_Q_TOTAL = 1000
const MEMOIR_CATS = ['童年记忆', '青春岁月', '工作与事业', '婚姻家庭', '子女亲情', '兴趣爱好', '人生感悟']
const MEMOIR_QUESTIONS = Array.from({ length: MEMOIR_Q_TOTAL }, (_, i) => {
  const n = i + 1
  const cat = MEMOIR_CATS[i % MEMOIR_CATS.length]
  return { id: n, category: cat, content: `【第 ${n} 题 · ${cat}】请讲述相关回忆。`, enabled: true }
})
const MEMOIR_USERS = [
  { id: 1, userName: '张秀英', phone: '138****5621', title: '张阿姨的人生回忆录', answeredCount: 342, archiveStatus: '采集中', updatedAt: '2026-05-28' },
  { id: 2, userName: '李建国', phone: '159****1043', title: '李叔叔的往事', answeredCount: 856, archiveStatus: '采集中', updatedAt: '2026-05-27' },
  { id: 3, userName: '王美华', phone: '186****7789', title: '王阿姨记忆册', answeredCount: 1000, archiveStatus: '已完成', updatedAt: '2026-05-26' },
  { id: 4, userName: '陈德明', phone: '133****6654', title: '陈伯伯岁月记', answeredCount: 128, archiveStatus: '采集中', updatedAt: '2026-05-25' },
  { id: 5, userName: '刘玉兰', phone: '177****3390', title: '—', answeredCount: 0, archiveStatus: '已暂停', updatedAt: '2026-05-20' },
]
function memoirPct(n) { return Math.min(100, Math.round((n / MEMOIR_Q_TOTAL) * 1000) / 10) }
function getMemoirUser(id) { return MEMOIR_USERS.find((u) => u.id === id) }
function memoirEssence(user, q) {
  if (!user || q.id > user.answeredCount) return null
  return `【精要】${user.userName}在第 ${q.id} 题（${q.category}）的回答整理，约 ${300 + (q.id % 500)} 字，供回忆录素材。`
}

const CHAT_ARCHIVE_RECORDS = [
  { id: 1, userName: '张秀英', phone: '138****5621', segmentLabel: '第 12 段', roundCount: 18, updatedAt: '2026-05-28 10:12', compressedSummary: '【压缩摘要】询问血压与服药；确认已服降压药；结束。' },
  { id: 2, userName: '张秀英', phone: '138****5621', segmentLabel: '第 11 段', roundCount: 24, updatedAt: '2026-05-27 19:40', compressedSummary: '【压缩摘要】回忆录片段；沪语朗读；儿子到访。' },
  { id: 3, userName: '李建国', phone: '159****1043', segmentLabel: '第 8 段', roundCount: 15, updatedAt: '2026-05-28 09:38', compressedSummary: '【压缩摘要】空腹血糖 6.2；用药确认。' },
  { id: 4, userName: '王美华', phone: '186****7789', segmentLabel: '第 5 段', roundCount: 12, updatedAt: '2026-05-27 16:28', compressedSummary: '【压缩摘要】钙片与牛奶间隔咨询。' },
  { id: 5, userName: '陈德明', phone: '133****6654', segmentLabel: '第 20 段', roundCount: 22, updatedAt: '2026-05-28 08:02', compressedSummary: '【压缩摘要】记忆训练；晚间服药提醒。' },
]

const CONFIG_FIELDS = {}

function parseHash() {
  const h = location.hash.replace(/^#/, '') || '/dashboard'
  return h.startsWith('/') ? h : '/' + h
}

function setHash(path) {
  location.hash = path
}

const app = createApp({
  setup() {
    const role = ref('super_admin')
    const collapsed = ref(false)
    const path = ref(parseHash())
    const showDemoBar = ref(true)
    const dialogVisible = ref(false)
    const userDetailVisible = ref(false)
    const userEditVisible = ref(false)
    const selectedUser = ref(null)
    const editForm = ref(null)
    const editSnapshot = ref(null)
    const userList = ref(USER_INITIAL.map((u) => cloneUser(u)))
    const familyBindings = ref(buildFamilyBindings(userList.value))
    const keyword = ref('')
    const archiveUserKeyword = ref('')
    const archiveDateRange = ref([])

    onMounted(() => {
      window.addEventListener('hashchange', () => { path.value = parseHash() })
      if (!location.hash) setHash('/dashboard')
    })

    const caps = computed(() => ROLE_CAPS[role.value] || [])
    const can = (perm) => caps.value.includes(perm)

    const visibleMenus = computed(() =>
      MENU_TREE.filter((m) => m.roles.includes(role.value))
    )

    const breadcrumb = computed(() => {
      if (path.value === '/dashboard') return { parent: null, current: '首页控制台' }
      if (memoirAnswersUserId.value) {
        const u = getMemoirUser(memoirAnswersUserId.value)
        return { parent: '回忆录', current: (u?.userName || '') + ' · 回答精要' }
      }
      for (const m of MENU_TREE) {
        const c = m.children?.find((x) => x.path === path.value)
        if (c) return { parent: m.title, current: c.title }
      }
      return { parent: null, current: PAGE_META[path.value]?.title || '' }
    })

    const memoirAnswersUserId = computed(() => {
      const m = path.value.match(/^\/users\/memoir\/answers\/(\d+)$/)
      return m ? +m[1] : null
    })

    const pageMeta = computed(() => {
      if (memoirAnswersUserId.value) return { title: '用户回答精要', type: 'memoir-answers' }
      return PAGE_META[path.value]
    })
    const isDashboard = computed(() => path.value === '/dashboard')

    const isSuperAdmin = computed(() => role.value === 'super_admin')

    const actions = computed(() => {
      const key = isDashboard.value ? 'dashboard' : pageMeta.value?.actions
      return (PAGE_ACTIONS[key] || []).filter((a) => {
        if (a.superOnly && !isSuperAdmin.value) return false
        return can(a.perm)
      })
    })

    const mainActions = computed(() => actions.value.filter((a) => !a.batch && !a.fold && !a.shortcut))
    const batchActions = computed(() => actions.value.filter((a) => a.batch))
    const shortcutActions = computed(() => actions.value.filter((a) => a.shortcut))
    const foldActions = computed(() => actions.value.filter((a) => a.fold))

    const permHint = computed(() => ({
      super_admin: '当前：全部按钮可见',
      operator: '运营：隐藏系统管理',
      specialist: '专员：仅查看/审核/导出',
      readonly: '只读：操作按钮已隐藏',
    }[role.value]))

    const isUserList = computed(() => path.value === '/users/list')
    const isShortQa = computed(() => path.value === '/users/qa-archive')
    const isChatArchive = computed(() => path.value === '/users/chat-history')
    const isMemoirQb = computed(() => path.value === '/memoir/question-bank')
    const isMemoirManage = computed(() => path.value === '/users/memoir')
    const isMemoirAnswers = computed(() => !!memoirAnswersUserId.value)
    const isSysAccount = computed(() => path.value === '/system/account')
    const isAccountSettings = computed(() => path.value === '/account/settings')
    const isKbAudit = computed(() => path.value === '/knowledge/audit')
    const isEcFamily = computed(() => path.value === '/elder-care/family')
    const isEcMessage = computed(() => path.value === '/elder-care/message')
    const isEcCommunity = computed(() => path.value === '/elder-care/community')
    const isEcIot = computed(() => path.value === '/elder-care/iot')
    const isVoiceDialog = computed(() => path.value === '/ai/voice-dialog')
    const isAiMemory = computed(() => path.value === '/ai/memory')

    const sosUserName = ref('')
    const sosUserPhone = ref('')
    const sosKeyword = ref('')
    const filteredSosMessages = computed(() => {
      const name = sosUserName.value.trim()
      const phone = sosUserPhone.value.trim()
      const k = sosKeyword.value.trim()
      return SOS_MESSAGES.filter((m) => {
        if (name && !m.userName.includes(name)) return false
        if (phone && !m.userPhone.includes(phone)) return false
        if (k && !m.sender.includes(k) && !m.content.includes(k)) return false
        return true
      })
    })

    const communityOrders = ref([...COMMUNITY_ORDERS])
    const communityUserName = ref('')
    const communityUserPhone = ref('')
    const communityKeyword = ref('')
    const communityCategoryFilter = ref('')
    const communityPendingOnly = ref(false)
    const categoryDialogVisible = ref(false)
    const communityFormVisible = ref(false)
    const assignVisible = ref(false)
    const assignTarget = ref(null)
    const assignStaff = ref('')
    const selectedServiceCategory = ref('')
    const communityForm = ref({ appointmentAt: '', staff: '', serviceItem: '', userName: '', userPhone: '' })

    const communityPendingCount = computed(() => communityOrders.value.filter((o) => o.status === '待分配').length)

    const filteredCommunityOrders = computed(() => {
      const name = communityUserName.value.trim()
      const phone = communityUserPhone.value.trim()
      const k = communityKeyword.value.trim()
      const cat = communityCategoryFilter.value
      return communityOrders.value.filter((o) => {
        if (communityPendingOnly.value && o.status !== '待分配') return false
        if (name && !o.userName.includes(name)) return false
        if (phone && !o.userPhone.includes(phone)) return false
        if (cat && o.category !== cat) return false
        if (k && !o.serviceItem.includes(k)) return false
        return true
      })
    })

    const activeVoiceTemplate = ref('warm')
    const voiceForm = ref({
      nickname: '小伴',
      language: '普通话',
      timbre: '温婉阿姨',
      roleIntro: VOICE_ROLE_TEMPLATES[0].intro,
      wakeWord: '小伴小伴',
      emotionTone: '温和',
      speechRate: 50,
      dialogThreshold: 0.6,
      multiTurnMinutes: 30,
      kbPriority: true,
    })
    const timbreOptions = ['邻家女孩', '成熟男声', '温婉阿姨', '沉稳男声', '童声陪伴']
    const crossSessionDays = ref(7)
    const preferenceLearning = ref(true)

    const iotDevices = ref(IOT_DEVICES.map((d) => ({ ...d, logs: [...d.logs] })))
    const iotUserName = ref('')
    const iotUserPhone = ref('')
    const iotDeviceType = ref('')
    const iotOnlineFilter = ref('')
    const iotLogVisible = ref(false)
    const activeIotDevice = ref(null)

    const filteredIotDevices = computed(() => {
      const name = iotUserName.value.trim()
      const phone = iotUserPhone.value.trim()
      return iotDevices.value.filter((d) => {
        if (name && !d.userName.includes(name)) return false
        if (phone && !d.userPhone.includes(phone)) return false
        if (iotDeviceType.value && d.deviceType !== iotDeviceType.value) return false
        if (iotOnlineFilter.value === 'online' && !d.online) return false
        if (iotOnlineFilter.value === 'offline' && d.online) return false
        return true
      })
    })
    const iotOnlineCount = computed(() => filteredIotDevices.value.filter((d) => d.online).length)

    function syncFamilyFromUsers() {
      familyBindings.value = buildFamilyBindings(userList.value)
      ElMessage.success(`已从用户档案同步 ${familyBindings.value.length} 条亲情绑定`)
    }

    function openCommunityCategory() {
      categoryDialogVisible.value = true
    }

    function pickServiceCategory(c) {
      selectedServiceCategory.value = c
      categoryDialogVisible.value = false
      communityForm.value = { appointmentAt: '', staff: '', serviceItem: '', userName: '', userPhone: '' }
      communityFormVisible.value = true
    }

    function toggleCommunityPending() {
      communityPendingOnly.value = !communityPendingOnly.value
      ElMessage.info(communityPendingOnly.value ? '仅显示待分配需求' : '已显示全部需求')
    }

    function submitCommunityOrder() {
      const f = communityForm.value
      if (!f.userName?.trim() || !f.userPhone?.trim()) {
        ElMessage.warning('请填写用户名和手机号')
        return
      }
      if (!f.appointmentAt || !f.serviceItem?.trim()) {
        ElMessage.warning('请填写预约时间与具体服务项目')
        return
      }
      const staff = f.staff?.trim()
      communityOrders.value.unshift({
        id: Date.now(),
        category: selectedServiceCategory.value,
        serviceItem: f.serviceItem.trim(),
        staff: staff || '—',
        appointmentAt: f.appointmentAt,
        userName: f.userName.trim(),
        userPhone: f.userPhone.trim(),
        status: staff ? '待服务' : '待分配',
      })
      communityFormVisible.value = false
      ElMessage.success(staff ? '服务需求已添加' : '需求已登记，请分配服务人员')
    }

    function openAssignCommunity(row) {
      assignTarget.value = row
      assignStaff.value = ''
      assignVisible.value = true
    }

    function confirmCommunityAssign() {
      const name = assignStaff.value?.trim()
      if (!name) {
        ElMessage.warning('请选择或填写服务人员')
        return
      }
      const row = assignTarget.value
      if (!row) return
      row.staff = name
      row.status = '待服务'
      assignVisible.value = false
      ElMessage.success(`已为 ${row.userName} 分配 ${name}`)
    }

    function staffOptionsForCategory(cat) {
      return COMMUNITY_STAFF_POOL[cat] || []
    }

    function applyVoiceTemplate(t) {
      activeVoiceTemplate.value = t.key
      voiceForm.value.nickname = t.nickname
      voiceForm.value.language = t.language
      voiceForm.value.timbre = t.timbre
      voiceForm.value.roleIntro = t.intro
    }

    function previewVoiceTimbre() {
      ElMessage.success(`正在试听「${voiceForm.value.timbre}」音色（演示）`)
    }

    function optimizeRoleIntro() {
      voiceForm.value.roleIntro += '\n\n【AI 优化】已补充耐心复述与紧急表述处理说明。（演示）'
      ElMessage.success('角色介绍已优化')
    }

    function openIotLogs(row) {
      activeIotDevice.value = row
      iotLogVisible.value = true
    }

    function iotLogType(level) {
      return { danger: 'danger', warn: 'warning', info: 'primary' }[level] || 'primary'
    }

    const memoirQbKeyword = ref('')
    const memoirQbCategory = ref('')
    const memoirQbPage = ref(1)
    const memoirManageKeyword = ref('')
    const memoirExportFilter = ref('')
    const memoirAnsPage = ref(1)
    const memoirAnsFilter = ref('all')
    const memoirAnsCategory = ref('')
    const memoirExpandAll = ref(false)
    const memoirExpandedIds = ref(new Set())

    const adminAccounts = ref(ADMIN_ACCOUNTS.map((a) => ({ ...a, permissions: [...a.permissions] })))
    const accountSettingsTab = ref('profile')
    const accountProfile = ref({ account: 'admin', displayName: '演示管理员', phone: '138****0001', email: 'admin@demo.local' })
    const accountPwd = ref({ old: '', new1: '', new2: '' })
    const loginDevices = [
      { time: '2026-05-28 11:20', device: 'Chrome · macOS', ip: '192.168.1.108', current: true },
      { time: '2026-05-27 09:15', device: 'Safari · iPhone', ip: '10.0.0.52', current: false },
    ]

    const filteredMemoirQ = computed(() => {
      const k = memoirQbKeyword.value.trim()
      return MEMOIR_QUESTIONS.filter((q) => {
        if (memoirQbCategory.value && q.category !== memoirQbCategory.value) return false
        if (!k) return true
        return String(q.id).includes(k) || q.content.includes(k) || q.category.includes(k)
      })
    })

    const pagedMemoirQ = computed(() => {
      const start = (memoirQbPage.value - 1) * 20
      return filteredMemoirQ.value.slice(start, start + 20)
    })

    const filteredMemoirUsers = computed(() => {
      const k = memoirManageKeyword.value.trim()
      if (!k) return MEMOIR_USERS
      return MEMOIR_USERS.filter((u) => u.userName.includes(k) || u.phone.includes(k))
    })

    const memoirAnswersUser = computed(() => getMemoirUser(memoirAnswersUserId.value))

    const memoirAnswerRows = computed(() => {
      const u = memoirAnswersUser.value
      if (!u) return []
      return MEMOIR_QUESTIONS.map((q) => ({
        id: q.id,
        category: q.category,
        question: q.content,
        essence: memoirEssence(u, q),
      })).filter((row) => {
        if (memoirAnsCategory.value && row.category !== memoirAnsCategory.value) return false
        if (memoirAnsFilter.value === 'answered') return !!row.essence
        if (memoirAnsFilter.value === 'unanswered') return !row.essence
        return true
      })
    })

    const memoirCategories = computed(() => [...new Set(MEMOIR_QUESTIONS.map((q) => q.category))])

    function matchMemoirExport(row) {
      const k = memoirExportFilter.value.trim()
      if (!k) return true
      return row.userName.includes(k) || row.phone.includes(k)
    }

    function exportMemoirUsersDemo() {
      const n = MEMOIR_USERS.filter(matchMemoirExport).length
      ElMessage.success(`已导出 ${n} 位用户全部回答（CSV 演示）`)
    }

    function exportMemoirFilteredDemo() {
      ElMessage.success(`已导出 ${memoirAnswerRows.value.length} 条回答精要（CSV 演示）`)
    }

    function toggleMemoirRowExpand(id) {
      const s = new Set(memoirExpandedIds.value)
      if (s.has(id)) s.delete(id)
      else s.add(id)
      memoirExpandedIds.value = s
    }

    function onMessageGo(p) {
      if (p) navigate(p)
    }

    const pagedMemoirAnswers = computed(() => {
      const start = (memoirAnsPage.value - 1) * 15
      return memoirAnswerRows.value.slice(start, start + 15)
    })

    const filteredShortQa = computed(() => {
      const k = archiveUserKeyword.value.trim()
      if (!k) return SHORT_QA_RECORDS
      return SHORT_QA_RECORDS.filter((r) => r.userName.includes(k) || r.phone.includes(k))
    })

    const filteredChatArchive = computed(() => {
      const k = archiveUserKeyword.value.trim()
      if (!k) return CHAT_ARCHIVE_RECORDS
      return CHAT_ARCHIVE_RECORDS.filter((r) => r.userName.includes(k) || r.phone.includes(k))
    })

    const tableData = computed(() => {
      const cols = pageMeta.value?.cols || []
      return Array.from({ length: 5 }, (_, i) =>
        cols.map((c) => `${c}示例${i + 1}`)
      )
    })

    function userStatusType(status) {
      return status === '正常' ? 'success' : 'danger'
    }

    function deviceLabel(id) {
      return id && id !== '—' ? id : '未绑定'
    }

    function openUserDetail(user) {
      selectedUser.value = user
      userDetailVisible.value = true
    }

    function openUserEdit(user) {
      if (!can('update')) {
        ElMessage.warning('当前角色无权编辑')
        return
      }
      editForm.value = cloneUser(user)
      editSnapshot.value = cloneUser(user)
      userEditVisible.value = true
    }

    function openUserEditFromDetail() {
      userDetailVisible.value = false
      openUserEdit(selectedUser.value)
    }

    function saveUserEdit() {
      const f = editForm.value
      if (!f?.name?.trim() || !f?.phone?.trim()) {
        ElMessage.warning('请填写姓名和手机号')
        return
      }
      f.emergencyContacts = padEc(f.emergencyContacts)
      const idx = userList.value.findIndex((u) => u.id === f.id)
      if (idx >= 0) userList.value[idx] = cloneUser(f)
      if (selectedUser.value?.id === f.id) selectedUser.value = userList.value[idx]
      familyBindings.value = buildFamilyBindings(userList.value)
      userEditVisible.value = false
      ElMessage.success('用户档案已保存，亲情绑定已同步')
    }

    function resetUserEdit() {
      if (editSnapshot.value) editForm.value = cloneUser(editSnapshot.value)
      ElMessage.info('已恢复为打开时的内容')
    }

    function toggleUserStatus(row) {
      row.status = row.status === '禁用' ? '正常' : '禁用'
      ElMessage.success(row.status === '禁用' ? `已禁用 ${row.name}` : `已恢复 ${row.name}`)
    }

    function addMed() {
      editForm.value.medications.push({ name: '', dose: '', schedule: '', note: '' })
    }
    function addRem() {
      editForm.value.reminders.push({ type: '用药', content: '', enabled: true, repeat: '每天' })
    }

    function queryArchive() {
      const n = isShortQa.value ? filteredShortQa.value.length : filteredChatArchive.value.length
      ElMessage.info(`已筛选，共 ${n} 条`)
    }

    function resetArchiveFilter() {
      archiveUserKeyword.value = ''
      archiveDateRange.value = []
    }

    function navigate(p) {
      if (p === '/ai/voice' || p === '/ai/dialog') p = '/ai/voice-dialog'
      if (p === '/account/settings') {
        setHash(p)
        return
      }
      if (/^\/users\/memoir\/answers\/\d+$/.test(p)) {
        setHash(p)
        return
      }
      const allowed = new Set(['/dashboard'])
      MENU_TREE.forEach((m) => {
        if (m.roles.includes(role.value)) {
          if (m.path) allowed.add(m.path)
          m.children?.forEach((c) => allowed.add(c.path))
        }
      })
      if (p === '/account/settings' || allowed.has(p)) setHash(p)
      else {
        ElMessage.warning('当前角色无权访问该菜单')
        setHash('/dashboard')
      }
    }

    function goMemoirAnswers(row) {
      navigate(`/users/memoir/answers/${row.id}`)
    }

    function importMemoirWord() {
      ElMessage.success('Word 批量导入完成（演示，已追加题目）')
    }

    function onRoleChange() {
      ElMessage.info('已切换角色：' + ROLE_OPTIONS.find((r) => r.value === role.value).label)
      navigate('/dashboard')
    }

    function fire(btn) {
      if (btn.label === '新增服务' && path.value === '/elder-care/community') {
        openCommunityCategory()
        return
      }
      if (btn.go) navigate(btn.go)
      ElMessage.success('[演示] ' + btn.label)
    }


    function logout() {
      ElMessage.success('已退出登录（演示）')
    }

    function query() {
      ElMessage.info('查询中…')
    }

    function saveDialog() {
      dialogVisible.value = false
      ElMessage.success('保存成功')
    }

    function resetDialog() {
      ElMessage.info('表单已重置')
    }

    return {
      role, collapsed, path, showDemoBar, dialogVisible, userDetailVisible, selectedUser, keyword,
      ROLE_OPTIONS, visibleMenus, breadcrumb, pageMeta, isDashboard, isUserList,
      mainActions, batchActions, shortcutActions, foldActions, permHint,
      tableData, userList, CONFIG_FIELDS, navigate, onRoleChange, fire,
      logout, query, saveDialog, resetDialog, can, openUserDetail, openUserEdit, openUserEditFromDetail,
      userEditVisible, editForm, saveUserEdit, resetUserEdit, toggleUserStatus, userStatusType, deviceLabel,
      addMed, addRem, EC_SLOTS,
      isShortQa, isChatArchive, isMemoirQb, isMemoirManage, isMemoirAnswers,
      isKbAudit, isEcFamily, isEcMessage, isEcCommunity, isEcIot, isSuperAdmin, familyBindings, syncFamilyFromUsers,
      SOS_MESSAGES, KB_AUDIT_PENDING, sosUserName, sosUserPhone, sosKeyword, filteredSosMessages,
      communityOrders, communityKeyword, communityCategoryFilter, filteredCommunityOrders,
      categoryDialogVisible, communityFormVisible, selectedServiceCategory, communityForm,
      openCommunityCategory, pickServiceCategory, submitCommunityOrder, SERVICE_CATEGORIES,
      iotDevices, iotUserName, iotUserPhone, iotDeviceType, iotOnlineFilter, filteredIotDevices, iotOnlineCount,
      iotLogVisible, activeIotDevice, openIotLogs, iotLogType, IOT_DEVICE_TYPES,
      communityUserName, communityUserPhone, communityPendingOnly, communityPendingCount, toggleCommunityPending,
      assignVisible, assignTarget, assignStaff, openAssignCommunity, confirmCommunityAssign, staffOptionsForCategory,
      isVoiceDialog, isAiMemory, VOICE_ROLE_TEMPLATES, activeVoiceTemplate, voiceForm, timbreOptions,
      applyVoiceTemplate, previewVoiceTimbre, optimizeRoleIntro, crossSessionDays, preferenceLearning,
      archiveUserKeyword, archiveDateRange, filteredShortQa, filteredChatArchive,
      queryArchive, resetArchiveFilter,
      memoirQbKeyword, memoirQbCategory, memoirQbPage, filteredMemoirQ, pagedMemoirQ, MEMOIR_Q_TOTAL, MEMOIR_CATS,
      memoirManageKeyword, filteredMemoirUsers, goMemoirAnswers, memoirPct, importMemoirWord,
      memoirAnswersUser, memoirAnswersUserId, memoirAnsPage, memoirAnsFilter, memoirAnsCategory, memoirExpandAll, memoirExpandedIds,
      memoirAnswerRows, pagedMemoirAnswers, memoirCategories, memoirExportFilter, matchMemoirExport, exportMemoirUsersDemo, exportMemoirFilteredDemo, toggleMemoirRowExpand,
      HEADER_MESSAGES, onMessageGo, isSysAccount, isAccountSettings, adminAccounts, PERM_OPTIONS, accountSettingsTab, accountProfile, accountPwd, loginDevices,
    }
  },
  template: `
    <div class="admin-root" v-if="true">
      <div v-if="showDemoBar" class="demo-bar">
        <b>网页演示版</b>
        <span class="tip">浏览器直接打开 · 右上角切换角色查看权限 · 数据均为模拟</span>
        <a href="../index.html" style="color:#1677ff;text-decoration:none;font-size:13px">返回首页</a>
        <el-button link type="primary" @click="showDemoBar=false">关闭</el-button>
      </div>

      <header class="top-header">
        <div style="display:flex;align-items:center">
          <div class="logo-box"><img src="company-logo.png" alt="盛越智健" /></div>
          <span class="system-name">智能陪伴机器人管理后台</span>
        </div>
        <div class="header-flex"></div>
        <div class="header-right">
          <el-dropdown trigger="click" @command="onMessageGo">
            <el-badge :value="HEADER_MESSAGES.length">
              <el-button text>消息中心</el-button>
            </el-badge>
            <template #dropdown>
              <el-dropdown-menu style="min-width:300px">
                <el-dropdown-item v-for="msg in HEADER_MESSAGES" :key="msg.id" :command="msg.path" divided>
                  <div style="font-weight:600">{{ msg.title }}</div>
                  <div style="font-size:12px;color:#8c8c8c">{{ msg.desc }}</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button text @click="navigate('/account/settings')">账号设置</el-button>
          <span class="account">演示管理员</span>
          <el-select v-model="role" size="small" style="width:130px" @change="onRoleChange">
            <el-option v-for="r in ROLE_OPTIONS" :key="r.value" :label="r.label" :value="r.value" />
          </el-select>
          <el-button type="danger" link @click="logout">退出登录</el-button>
        </div>
      </header>

      <div class="admin-body">
        <aside class="side-nav" :style="{width: collapsed ? '64px' : '220px'}">
          <el-menu
            :default-active="path"
            :collapse="collapsed"
            background-color="#001529"
            text-color="rgba(255,255,255,0.75)"
            active-text-color="#fff"
            @select="navigate"
          >
            <template v-for="menu in visibleMenus" :key="menu.key">
              <el-menu-item v-if="!menu.children?.length" :index="menu.path">
                <span>{{ menu.title }}</span>
              </el-menu-item>
              <el-sub-menu v-else :index="menu.key">
                <template #title><span>{{ menu.title }}</span></template>
                <el-menu-item v-for="c in menu.children" :key="c.path" :index="c.path">
                  <span v-if="c.alert" class="alert-dot"></span>{{ c.title }}
                </el-menu-item>
              </el-sub-menu>
            </template>
          </el-menu>
          <button class="collapse-btn" @click="collapsed=!collapsed">{{ collapsed ? '展开' : '收起' }}菜单</button>
        </aside>

        <main class="main-content">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click="navigate('/dashboard')" style="cursor:pointer">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="breadcrumb.parent">{{ breadcrumb.parent }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="breadcrumb.current">{{ breadcrumb.current }}</el-breadcrumb-item>
          </el-breadcrumb>

          <!-- 首页控制台 -->
          <div v-if="isDashboard" class="page-card">
            <h2 class="page-title">首页控制台 · 数据总览</h2>
            <div class="toolbar-row" v-if="mainActions.length">
              <el-button v-for="b in mainActions" :key="b.label" :type="b.type==='export'?'success':b.type" :class="b.cls" @click="fire(b)">{{ b.label }}</el-button>
              <span class="perm-hint">{{ permHint }}</span>
            </div>
            <div v-if="shortcutActions.length" class="toolbar-row shortcut-group">
              <el-button v-for="b in shortcutActions" :key="b.label" :type="b.type" :class="b.cls" @click="fire(b)">{{ b.label }}</el-button>
            </div>
            <div class="stat-row">
              <div class="stat-card" v-for="s in [
                {l:'用户总量',v:'12,580'},{l:'今日对话量',v:'8,426'},
                {l:'问卷采集完成率',v:'76.4%'},{l:'呼救记录（本月）',v:'23'}
              ]" :key="s.l">
                <div style="color:#8c8c8c;font-size:13px">{{ s.l }}</div>
                <div class="stat-value">{{ s.v }}</div>
              </div>
            </div>
            <div class="dash-grid">
              <div class="page-card" style="padding:16px">
                <div style="font-weight:600;margin-bottom:12px">近 7 日对话量趋势</div>
                <div class="chart-box">图表区域（演示）</div>
              </div>
              <div class="page-card" style="padding:16px">
                <div style="font-weight:600;margin-bottom:12px">待办告警</div>
                <el-timeline>
                  <el-timeline-item type="danger" timestamp="10:32">紧急呼救 · 用户张**</el-timeline-item>
                  <el-timeline-item type="warning" timestamp="09:15">待审核知识点 12 条</el-timeline-item>
                </el-timeline>
              </div>
            </div>
          </div>

          <!-- 语音对话参数配置 -->
          <div v-else-if="isVoiceDialog" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <p class="page-desc" style="margin:-8px 0 16px;font-size:13px;color:#64748b">配置角色人设、语音音色及对话规则，保存后对新会话生效。</p>
            <div class="toolbar-row" v-if="mainActions.length">
              <el-button v-for="b in mainActions" :key="b.label" :type="b.type==='export'?'success':b.type" @click="fire(b)">{{ b.label }}</el-button>
              <el-dropdown v-if="foldActions.length">
                <el-button>更多操作</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="b in foldActions" :key="b.label" @click="fire(b)">{{ b.label }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <el-form label-position="top" style="max-width:880px">
              <el-form-item label="角色模板">
                <div style="display:flex;flex-wrap:wrap;gap:10px">
                  <el-button v-for="t in VOICE_ROLE_TEMPLATES" :key="t.key" :type="activeVoiceTemplate===t.key?'primary':'default'" @click="applyVoiceTemplate(t)">{{ t.label }}</el-button>
                </div>
              </el-form-item>
              <el-form-item label="助手昵称"><el-input v-model="voiceForm.nickname" style="max-width:320px" /></el-form-item>
              <el-row :gutter="20">
                <el-col :span="12"><el-form-item label="对话语言"><el-select v-model="voiceForm.language" style="width:100%"><el-option label="普通话" value="普通话" /><el-option label="中英混合" value="中英混合" /><el-option label="沪语" value="沪语" /></el-select></el-form-item></el-col>
                <el-col :span="12"><el-form-item label="角色音色"><div style="display:flex;gap:8px;width:100%"><el-select v-model="voiceForm.timbre" style="flex:1"><el-option v-for="v in timbreOptions" :key="v" :label="v" :value="v" /></el-select><el-button type="primary" circle @click="previewVoiceTimbre">▶</el-button></div></el-form-item></el-col>
              </el-row>
              <el-form-item label="角色介绍">
                <div style="position:relative">
                  <el-button link type="primary" style="position:absolute;top:8px;right:12px;z-index:1" @click="optimizeRoleIntro">✨ AI 一键优化</el-button>
                  <el-input v-model="voiceForm.roleIntro" type="textarea" :rows="7" maxlength="2000" show-word-limit />
                </div>
              </el-form-item>
              <el-divider content-position="left">语音参数</el-divider>
              <el-row :gutter="20">
                <el-col :span="12"><el-form-item label="唤醒词"><el-input v-model="voiceForm.wakeWord" /></el-form-item></el-col>
                <el-col :span="12"><el-form-item label="情感语气"><el-select v-model="voiceForm.emotionTone" style="width:100%"><el-option label="温和" value="温和" /><el-option label="活泼" value="活泼" /><el-option label="沉稳" value="沉稳" /></el-select></el-form-item></el-col>
              </el-row>
              <el-form-item label="播报语速"><el-slider v-model="voiceForm.speechRate" :min="20" :max="100" /></el-form-item>
              <el-divider content-position="left">对话规则</el-divider>
              <el-row :gutter="20">
                <el-col :span="8"><el-form-item label="自由对话阈值"><el-input-number v-model="voiceForm.dialogThreshold" :min="0" :max="1" :step="0.1" style="width:100%" /></el-form-item></el-col>
                <el-col :span="8"><el-form-item label="多轮记忆(分钟)"><el-input-number v-model="voiceForm.multiTurnMinutes" :min="5" :max="120" style="width:100%" /></el-form-item></el-col>
                <el-col :span="8"><el-form-item label="知识库优先级"><el-switch v-model="voiceForm.kbPriority" /></el-form-item></el-col>
              </el-row>
            </el-form>
          </div>

          <!-- 心智 & 记忆管理 -->
          <div v-else-if="isAiMemory" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <el-alert type="info" :closable="false" show-icon style="margin-bottom:20px">
              <template #title>使用说明</template>
              <p style="margin:8px 0 0;font-size:13px;line-height:1.75"><strong>跨会话记忆</strong>用于控制<strong>短期记忆摘要</strong>在后台保留的时长；到期后会话上下文摘要将清理。该设置<strong>不影响</strong>「用户档案 → 历史对话记录」中已归档的<strong>对话段精要</strong>。</p>
            </el-alert>
            <div class="toolbar-row" v-if="mainActions.length">
              <el-button v-for="b in mainActions" :key="b.label" :type="b.type==='export'?'success':b.type" @click="fire(b)">{{ b.label }}</el-button>
            </div>
            <el-form label-width="160px" style="max-width:560px;margin-top:8px">
              <el-form-item label="跨会话记忆时长（天）"><el-input-number v-model="crossSessionDays" :min="1" :max="90" /></el-form-item>
              <el-form-item label="用户偏好学习"><el-switch v-model="preferenceLearning" /></el-form-item>
            </el-form>
          </div>

          <!-- 配置页（其他） -->
          <div v-else-if="pageMeta?.type==='config'" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <div class="toolbar-row" v-if="mainActions.length">
              <el-button v-for="b in mainActions" :key="b.label" :type="b.type==='export'?'success':b.type" @click="fire(b)">{{ b.label }}</el-button>
            </div>
            <el-form label-width="140px" style="max-width:560px;margin-top:16px">
              <el-form-item v-for="f in (CONFIG_FIELDS[pageMeta.actions]||[])" :key="f.label" :label="f.label">
                <el-input :model-value="f.value" />
              </el-form-item>
            </el-form>
          </div>

          <!-- 用户列表（可点击查看档案） -->
          <div v-else-if="isUserList" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <div class="filter-bar">
              <el-input v-model="keyword" placeholder="姓名 / 手机 / 设备号" style="width:220px" clearable />
              <el-button @click="query">查询</el-button>
              <el-button @click="query">筛选</el-button>
            </div>
            <div class="toolbar-row" v-if="mainActions.length">
              <el-button v-for="b in mainActions" :key="b.label" :type="b.type==='export'?'success':b.type" :class="b.cls" @click="fire(b)">{{ b.label }}</el-button>
              <span class="perm-hint">{{ permHint }} · 点击姓名查看 · 编辑资料可改完整档案</span>
            </div>
            <div v-if="batchActions.length" class="toolbar-row batch-group">
              <el-button v-for="b in batchActions" :key="b.label" :type="b.type==='export'?'success':b.type" @click="fire(b)">{{ b.label }}</el-button>
            </div>
            <el-table :data="userList" stripe border>
              <el-table-column type="selection" width="48" />
              <el-table-column label="姓名" min-width="100">
                <template #default="{ row }">
                  <el-button type="primary" link @click="openUserDetail(row)">{{ row.name }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="手机" width="130" />
              <el-table-column label="设备号" min-width="150">
                <template #default="{ row }">
                  <span :style="{color: deviceLabel(row.deviceId)==='未绑定'?'#94a3b8':''}">{{ deviceLabel(row.deviceId) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="88">
                <template #default="{ row }">
                  <el-tag :type="userStatusType(row.status)" size="small">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="260" fixed="right">
                <template #default="{ row }">
                  <el-button v-if="can('view')" type="primary" link size="small" @click="openUserDetail(row)">查看详情</el-button>
                  <el-button v-if="can('update')" type="primary" link size="small" @click="openUserEdit(row)">编辑资料</el-button>
                  <el-button v-if="can('update')" type="danger" link size="small" @click="toggleUserStatus(row)">{{ row.status==='禁用'?'启用':'禁用' }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top:16px;display:flex;justify-content:flex-end">
              <el-pagination layout="total, prev, pager, next" :total="userList.length" />
            </div>
          </div>

          <!-- 回忆录问题库 -->
          <div v-else-if="isMemoirQb" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <p class="page-desc">预设 <strong>{{ MEMOIR_Q_TOTAL }}</strong> 道采集题，支持新增、编辑、删除及 Word 批量导入。</p>
            <div class="filter-bar">
              <el-input v-model="memoirQbKeyword" placeholder="题号 / 题目 / 分类" style="width:220px" clearable />
              <el-select v-model="memoirQbCategory" placeholder="全部分类" clearable style="width:130px">
                <el-option v-for="c in MEMOIR_CATS" :key="c" :label="c" :value="c" />
              </el-select>
              <el-button @click="memoirQbPage=1; queryArchive()">查询</el-button>
            </div>
            <div class="toolbar-row" v-if="mainActions.length">
              <el-button v-for="b in mainActions" :key="b.label" :type="b.type==='export'?'success':b.type" @click="b.label.includes('Word')?importMemoirWord():fire(b)">{{ b.label }}</el-button>
            </div>
            <p style="font-size:13px;color:#64748b;margin-bottom:12px">库内共 <b style="color:#1677ff">{{ MEMOIR_Q_TOTAL }}</b> 题</p>
            <el-table :data="pagedMemoirQ" stripe border>
              <el-table-column prop="id" label="题号" width="72" />
              <el-table-column prop="category" label="分类" width="110" />
              <el-table-column prop="content" label="题目" min-width="260" show-overflow-tooltip />
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button v-if="can('update')" type="primary" link size="small" @click="fire({label:'编辑'+row.id})">编辑</el-button>
                  <el-button v-if="can('delete')" type="danger" link size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 个人回忆录管理 -->
          <div v-else-if="isMemoirManage" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <p class="page-desc">「导出用户筛选」列可筛选要导出全部回答的用户。</p>
            <div class="filter-bar">
              <el-input v-model="memoirManageKeyword" placeholder="列表筛选" style="width:180px" clearable />
              <el-button @click="queryArchive()">查询</el-button>
              <el-button type="success" @click="exportMemoirUsersDemo">导出所选用户全部回答</el-button>
            </div>
            <el-table :data="filteredMemoirUsers" stripe border>
              <el-table-column type="selection" width="48" :selectable="matchMemoirExport" />
              <el-table-column width="150">
                <template #header>
                  <div style="font-size:12px;font-weight:600">导出用户筛选</div>
                  <el-input v-model="memoirExportFilter" size="small" placeholder="用户名/手机" clearable />
                </template>
                <template #default="{ row }">
                  <el-tag v-if="matchMemoirExport(row)" type="success" size="small">可导出</el-tag>
                  <el-tag v-else size="small" type="info">—</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="用户" width="100">
                <template #default="{ row }">
                  <el-button type="primary" link @click="goMemoirAnswers(row)">{{ row.userName }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="手机" width="130" />
              <el-table-column prop="title" label="回忆录标题" min-width="140" />
              <el-table-column label="答题进度 / 状态" min-width="200">
                <template #default="{ row }">
                  <div>{{ row.answeredCount }} / {{ MEMOIR_Q_TOTAL }}（{{ memoirPct(row.answeredCount) }}%）</div>
                  <el-progress :percentage="memoirPct(row.answeredCount)" :stroke-width="8" />
                  <el-tag size="small">{{ row.archiveStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="updatedAt" label="最近更新" width="120" />
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="goMemoirAnswers(row)">查看回答</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 用户回答精要 -->
          <div v-else-if="isMemoirAnswers && memoirAnswersUser" class="page-card">
            <el-button text type="primary" @click="navigate('/users/memoir')">← 返回列表</el-button>
            <h2 class="page-title">{{ memoirAnswersUser.userName }} · 回答精要</h2>
            <p class="page-desc">支持按问题分类筛选后导出；可展开查看完整精要。</p>
            <div class="filter-bar">
              <el-select v-model="memoirAnsCategory" placeholder="问题分类" clearable style="width:130px">
                <el-option v-for="c in memoirCategories" :key="c" :label="c" :value="c" />
              </el-select>
              <el-select v-model="memoirAnsFilter" style="width:110px">
                <el-option label="全部" value="all" />
                <el-option label="已回答" value="answered" />
                <el-option label="未回答" value="unanswered" />
              </el-select>
              <el-button @click="memoirExpandAll=!memoirExpandAll;memoirExpandedIds=new Set()">{{ memoirExpandAll?'收起全部':'展开全部' }}</el-button>
              <el-button type="success" @click="exportMemoirFilteredDemo">导出当前筛选</el-button>
            </div>
            <p style="font-size:13px;color:#64748b;margin-bottom:8px">共 {{ memoirAnswerRows.length }} 题</p>
            <el-table :data="pagedMemoirAnswers" stripe border>
              <el-table-column prop="id" label="题号" width="72" />
              <el-table-column prop="category" label="分类" width="100" />
              <el-table-column prop="question" label="题目" min-width="180" show-overflow-tooltip />
              <el-table-column label="回答精要" min-width="280">
                <template #default="{ row }">
                  <template v-if="row.essence">
                    <p :style="{whiteSpace:'pre-wrap',lineHeight:'1.75',margin:0,...(memoirExpandAll||memoirExpandedIds.has(row.id)?{}:{display:'-webkit-box',WebkitLineClamp:4,WebkitBoxOrient:'vertical',overflow:'hidden'})}">{{ row.essence }}</p>
                    <el-button v-if="row.essence.length>120" type="primary" link size="small" @click="toggleMemoirRowExpand(row.id)">{{ memoirExpandAll||memoirExpandedIds.has(row.id)?'收起':'展开全文' }}</el-button>
                  </template>
                  <el-tag v-else size="small" type="info">未回答</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 账号权限管理 -->
          <div v-else-if="isSysAccount" class="page-card">
            <h2 class="page-title">账号权限管理</h2>
            <p class="page-desc">状态列后展示权限列表，可编辑；支持禁用账号。</p>
            <el-table :data="adminAccounts" stripe border>
              <el-table-column prop="account" label="账号" width="120" />
              <el-table-column prop="displayName" label="姓名" width="110" />
              <el-table-column prop="role" label="角色" width="110" />
              <el-table-column label="状态" width="80">
                <template #default="{ row }"><el-tag :type="row.status==='正常'?'success':'danger'" size="small">{{ row.status }}</el-tag></template>
              </el-table-column>
              <el-table-column label="使用权限" min-width="260">
                <template #default="{ row }">
                  <el-tag v-for="p in PERM_OPTIONS" :key="p.key" size="small" :type="row.permissions.includes(p.key)?'primary':'info'" style="margin:2px">{{ p.label }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="fire({label:'编辑权限'})">编辑权限</el-button>
                  <el-button type="danger" link size="small" @click="row.status=row.status==='正常'?'禁用':'正常'">{{ row.status==='正常'?'禁用':'启用' }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 账号设置 -->
          <div v-else-if="isAccountSettings" class="page-card">
            <el-button text type="primary" @click="navigate('/dashboard')">← 返回</el-button>
            <h2 class="page-title">账号设置</h2>
            <el-tabs v-model="accountSettingsTab">
              <el-tab-pane label="基本信息" name="profile">
                <el-form label-width="90px" style="max-width:440px;margin-top:16px">
                  <el-form-item label="登录账号"><el-input v-model="accountProfile.account" disabled /></el-form-item>
                  <el-form-item label="显示姓名"><el-input v-model="accountProfile.displayName" /></el-form-item>
                  <el-form-item label="手机"><el-input v-model="accountProfile.phone" /></el-form-item>
                  <el-button type="primary" @click="fire({label:'保存基本信息'})">保存</el-button>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="password">
                <el-form label-width="90px" style="max-width:440px;margin-top:16px">
                  <el-form-item label="当前密码"><el-input v-model="accountPwd.old" type="password" show-password /></el-form-item>
                  <el-form-item label="新密码"><el-input v-model="accountPwd.new1" type="password" show-password /></el-form-item>
                  <el-button type="primary" @click="fire({label:'修改密码'})">确认修改</el-button>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="登录设备记录" name="devices">
                <el-table :data="loginDevices" stripe border style="margin-top:12px">
                  <el-table-column prop="time" label="登录时间" width="160" />
                  <el-table-column prop="device" label="设备" min-width="160" />
                  <el-table-column prop="ip" label="IP" width="120" />
                  <el-table-column label="状态" width="80">
                    <template #default="{ row }"><el-tag :type="row.current?'success':'info'" size="small">{{ row.current?'当前':'历史' }}</el-tag></template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>

          <!-- 短期问答档案 -->
          <div v-else-if="isShortQa" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <p class="page-desc">储存用户<strong>当前对话记忆</strong>，每次对话结束后重新生成，约为 <strong>2000 字</strong> 摘要。</p>
            <div class="filter-bar">
              <el-form :inline="true">
                <el-form-item label="用户筛选">
                  <el-input v-model="archiveUserKeyword" placeholder="手机号 / 用户名" clearable style="width:220px" />
                </el-form-item>
                <el-form-item>
                  <el-button @click="queryArchive">查询</el-button>
                  <el-button @click="resetArchiveFilter">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="toolbar-row" v-if="mainActions.length">
              <el-button v-for="b in mainActions" :key="b.label" :type="b.type==='export'?'success':b.type" :class="b.cls" @click="fire(b)">{{ b.label }}</el-button>
            </div>
            <el-table :data="filteredShortQa" stripe border>
              <el-table-column type="selection" width="48" />
              <el-table-column prop="userName" label="用户名" width="100" />
              <el-table-column prop="phone" label="手机号" width="130" />
              <el-table-column prop="wordCount" label="摘要字数" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.wordCount >= 1800 ? 'success' : 'warning'" size="small">{{ row.wordCount }} 字</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="updatedAt" label="最近更新" width="160" />
              <el-table-column prop="summary" label="当前记忆摘要" min-width="280" show-overflow-tooltip />
              <el-table-column label="操作" width="100">
                <template #default><el-button type="primary" link size="small" @click="fire({label:'查看全文'})">查看全文</el-button></template>
              </el-table-column>
            </el-table>
            <div style="margin-top:16px;text-align:right;color:#8c8c8c;font-size:13px">共 {{ filteredShortQa.length }} 条</div>
          </div>

          <!-- 历史对话记录（压缩摘要） -->
          <div v-else-if="isChatArchive" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <p class="page-desc">按<strong>对话段</strong>归档：一段沟通结束后，内容将<strong>压缩为摘要</strong>入库。</p>
            <div class="filter-bar">
              <el-form :inline="true">
                <el-form-item label="用户筛选">
                  <el-input v-model="archiveUserKeyword" placeholder="手机号 / 用户名" clearable style="width:220px" />
                </el-form-item>
                <el-form-item label="时间范围">
                  <el-date-picker v-model="archiveDateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" />
                </el-form-item>
                <el-form-item>
                  <el-button @click="queryArchive">查询</el-button>
                  <el-button @click="resetArchiveFilter">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="toolbar-row" v-if="mainActions.length">
              <el-button v-for="b in mainActions" :key="b.label" :type="b.type==='export'?'success':b.type" :class="b.cls" @click="fire(b)">{{ b.label }}</el-button>
            </div>
            <el-table :data="filteredChatArchive" stripe border>
              <el-table-column type="selection" width="48" />
              <el-table-column prop="userName" label="用户名" width="100" />
              <el-table-column prop="phone" label="手机号" width="130" />
              <el-table-column prop="segmentLabel" label="对话段" width="88" />
              <el-table-column prop="roundCount" label="轮次" width="72" align="center" />
              <el-table-column prop="updatedAt" label="结束时间" width="160" />
              <el-table-column prop="compressedSummary" label="压缩摘要" min-width="260" show-overflow-tooltip />
              <el-table-column label="操作" width="100">
                <template #default><el-button type="primary" link size="small" @click="fire({label:'查看摘要'})">查看摘要</el-button></template>
              </el-table-column>
            </el-table>
            <div style="margin-top:16px;text-align:right;color:#8c8c8c;font-size:13px">共 {{ filteredChatArchive.length }} 条</div>
          </div>

          <!-- 内容审核中心 -->
          <div v-else-if="isKbAudit" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <p v-if="isSuperAdmin" class="page-desc">超级管理员可进行<strong>审核通过、驳回、标记待优化</strong>等操作。</p>
            <el-alert v-else type="warning" :closable="false" show-icon title="权限说明" description="当前角色仅可提交审核申请，不能直接审核；审核操作仅限超级管理员。" style="margin-bottom:16px" />
            <div class="toolbar-row" v-if="mainActions.length">
              <el-button v-for="b in mainActions" :key="b.label" :type="b.type==='export'?'success':b.type" @click="fire(b)">{{ b.label }}</el-button>
              <span class="perm-hint">{{ isSuperAdmin ? '超级管理员：可审核' : '运营/专员/只读：仅可提交申请' }}</span>
            </div>
            <div v-if="batchActions.length" class="toolbar-row batch-group">
              <el-button v-for="b in batchActions" :key="b.label" :type="b.type" @click="fire(b)">{{ b.label }}</el-button>
            </div>
            <el-table :data="KB_AUDIT_PENDING" stripe border>
              <el-table-column prop="content" label="待审内容" min-width="220" show-overflow-tooltip />
              <el-table-column prop="submitter" label="提交人" width="100" />
              <el-table-column prop="submittedAt" label="提交时间" width="160" />
              <el-table-column prop="status" label="状态" width="100" />
              <el-table-column v-if="isSuperAdmin" label="操作" width="140" fixed="right">
                <template #default>
                  <el-button type="primary" link size="small" @click="fire({label:'通过'})">通过</el-button>
                  <el-button type="danger" link size="small" @click="fire({label:'驳回'})">驳回</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 亲情账号绑定 -->
          <div v-else-if="isEcFamily" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <p class="page-desc">与<strong>用户档案 → 全量用户列表</strong>中的<strong>紧急联系人</strong>自动同步，修改请前往用户列表编辑档案。</p>
            <el-alert type="info" :closable="false" show-icon title="同步说明" description="老人账号、家属姓名/手机、关系、呼救通知均来自用户「紧急联系人（3 位）」配置。" style="margin-bottom:16px" />
            <div class="filter-bar">
              <el-input v-model="keyword" placeholder="老人姓名 / 手机 / 家属手机" style="width:220px" clearable />
              <el-button @click="query">查询</el-button>
              <el-button type="primary" @click="syncFamilyFromUsers">同步用户档案</el-button>
            </div>
            <div class="toolbar-row" v-if="mainActions.length">
              <el-button v-for="b in mainActions" :key="b.label" :type="b.type==='export'?'success':b.type" @click="fire(b)">{{ b.label }}</el-button>
              <span class="perm-hint">共 {{ familyBindings.length }} 条 · 来自用户档案紧急联系人</span>
            </div>
            <el-table :data="familyBindings" stripe border>
              <el-table-column prop="elderUser" label="老人账号" width="100" />
              <el-table-column prop="elderPhone" label="老人手机" width="130" />
              <el-table-column prop="deviceId" label="设备号" min-width="150" />
              <el-table-column prop="familyName" label="家属姓名" width="100" />
              <el-table-column prop="familyPhone" label="家属手机" width="130" />
              <el-table-column prop="relation" label="关系" width="88" />
              <el-table-column prop="priority" label="优先级" width="96" />
              <el-table-column label="呼救通知" width="88">
                <template #default="{ row }">
                  <el-tag :type="row.notifySos ? 'danger' : 'info'" size="small">{{ row.notifySos ? '是' : '否' }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 呼救内容管理 -->
          <div v-else-if="isEcMessage" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <el-alert type="warning" :closable="false" show-icon style="margin-bottom:16px">
              <template #title>使用说明</template>
              <p style="margin:8px 0 0;font-size:13px;line-height:1.7">本页面用于查看与管理<strong>紧急呼救过程中</strong>产生的沟通内容记录。呼救结束后相关记录会归档至此，便于事后复盘；<strong>非日常闲聊留言</strong>。</p>
            </el-alert>
            <div class="filter-bar">
              <el-input v-model="sosUserName" placeholder="用户名" style="width:130px" clearable />
              <el-input v-model="sosUserPhone" placeholder="手机号" style="width:140px" clearable />
              <el-input v-model="sosKeyword" placeholder="发送方 / 呼救内容" style="width:180px" clearable />
              <el-button @click="query">查询</el-button>
            </div>
            <div class="toolbar-row" v-if="mainActions.length">
              <el-button v-for="b in mainActions" :key="b.label" :type="b.type==='export'?'success':b.type" @click="fire(b)">{{ b.label }}</el-button>
            </div>
            <el-table :data="filteredSosMessages" stripe border>
              <el-table-column prop="userName" label="用户名" width="100" />
              <el-table-column prop="userPhone" label="手机号" width="130" />
              <el-table-column prop="sosId" label="呼救单号" width="150" />
              <el-table-column prop="sender" label="发送方" width="120" />
              <el-table-column prop="content" label="呼救内容" min-width="220" show-overflow-tooltip />
              <el-table-column prop="time" label="时间" width="160" />
              <el-table-column label="置顶" width="72">
                <template #default="{ row }">
                  <el-tag v-if="row.pinned" type="warning" size="small">置顶</el-tag>
                  <span v-else>—</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 社区服务对接 -->
          <div v-else-if="isEcCommunity" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <p class="page-desc" style="margin:-8px 0 16px;font-size:13px;color:#64748b">支持按用户筛选、待分配需求筛选及服务人员分配。</p>
            <div class="filter-bar">
              <el-input v-model="communityUserName" placeholder="用户名" style="width:120px" clearable />
              <el-input v-model="communityUserPhone" placeholder="手机号" style="width:130px" clearable />
              <el-select v-model="communityCategoryFilter" placeholder="服务类型" clearable style="width:110px">
                <el-option v-for="c in SERVICE_CATEGORIES" :key="c" :label="c" :value="c" />
              </el-select>
              <el-input v-model="communityKeyword" placeholder="服务项目" style="width:140px" clearable />
              <el-button @click="query">查询</el-button>
              <el-button :type="communityPendingOnly?'primary':'default'" @click="toggleCommunityPending">需求待分配{{ communityPendingCount ? ' ('+communityPendingCount+')' : '' }}</el-button>
              <el-button v-if="can('create')" type="primary" @click="openCommunityCategory">新增服务</el-button>
            </div>
            <div class="toolbar-row" v-if="mainActions.filter(b=>b.label!=='新增服务').length">
              <el-button v-for="b in mainActions.filter(b=>b.label!=='新增服务')" :key="b.label" :type="b.type==='export'?'success':b.type" @click="fire(b)">{{ b.label }}</el-button>
            </div>
            <el-table :data="filteredCommunityOrders" stripe border>
              <el-table-column prop="userName" label="用户名" width="96" />
              <el-table-column prop="userPhone" label="手机号" width="128" />
              <el-table-column prop="category" label="服务类型" width="88" />
              <el-table-column prop="serviceItem" label="具体服务项目" min-width="150" show-overflow-tooltip />
              <el-table-column prop="staff" label="服务人员" width="100" />
              <el-table-column prop="appointmentAt" label="预约时间" width="150" />
              <el-table-column prop="status" label="状态" width="88">
                <template #default="{ row }">
                  <el-tag :type="row.status==='已完成'?'success':row.status==='待分配'?'danger':'warning'" size="small">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row }">
                  <el-button v-if="row.status==='待分配'" type="primary" link size="small" @click="openAssignCommunity(row)">分配人员</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 养老物联设备 -->
          <div v-else-if="isEcIot" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <p class="page-desc" style="margin:-8px 0 16px;font-size:13px;color:#64748b">展示用户绑定的门磁、跌倒探测仪、烟雾报警器等设备的在线/离线状态与设备日志。</p>
            <div class="filter-bar">
              <el-input v-model="iotUserName" placeholder="用户名" style="width:130px" clearable />
              <el-input v-model="iotUserPhone" placeholder="手机号" style="width:140px" clearable />
              <el-select v-model="iotDeviceType" placeholder="设备类型" clearable style="width:130px">
                <el-option v-for="t in IOT_DEVICE_TYPES" :key="t" :label="t" :value="t" />
              </el-select>
              <el-select v-model="iotOnlineFilter" placeholder="在线状态" clearable style="width:100px">
                <el-option label="在线" value="online" />
                <el-option label="离线" value="offline" />
              </el-select>
              <el-button @click="query">查询</el-button>
            </div>
            <div class="toolbar-row" v-if="mainActions.length">
              <el-button v-for="b in mainActions" :key="b.label" :type="b.type==='export'?'success':b.type" @click="fire(b)">{{ b.label }}</el-button>
              <span class="perm-hint">共 {{ filteredIotDevices.length }} 台 · 在线 {{ iotOnlineCount }} 台</span>
            </div>
            <el-table :data="filteredIotDevices" stripe border>
              <el-table-column prop="userName" label="用户名" width="100" />
              <el-table-column prop="userPhone" label="手机号" width="130" />
              <el-table-column prop="deviceType" label="设备类型" width="110" />
              <el-table-column prop="deviceName" label="设备名称" min-width="120" />
              <el-table-column prop="deviceSn" label="设备编号" min-width="120" />
              <el-table-column label="在线状态" width="96">
                <template #default="{ row }">
                  <el-tag :type="row.online ? 'success' : 'danger'" size="small">{{ row.online ? '在线' : '离线' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="lastOnline" label="最近在线" width="150" />
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="openIotLogs(row)">设备日志</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 列表页 -->
          <div v-else-if="pageMeta" class="page-card">
            <h2 class="page-title">{{ pageMeta.title }}</h2>
            <div class="filter-bar">
              <el-input v-model="keyword" placeholder="搜索" style="width:200px" clearable />
              <el-date-picker v-if="pageMeta.date" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" />
              <el-select v-if="pageMeta.status" placeholder="处理状态" style="width:120px">
                <el-option label="全部" value="" />
                <el-option label="已处理" value="done" />
                <el-option label="未处理" value="pending" />
              </el-select>
              <el-button @click="query">查询</el-button>
              <el-button @click="query">筛选</el-button>
            </div>
            <div class="toolbar-row" v-if="mainActions.length">
              <el-button v-for="b in mainActions" :key="b.label" :type="b.type==='export'?'success':b.type" :class="b.cls" @click="fire(b)">{{ b.label }}</el-button>
              <el-dropdown v-if="foldActions.length">
                <el-button>更多操作</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="b in foldActions" :key="b.label" @click="fire(b)">{{ b.label }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <span class="perm-hint">{{ permHint }}</span>
            </div>
            <div v-if="shortcutActions.length" class="toolbar-row shortcut-group">
              <el-button v-for="b in shortcutActions" :key="b.label" :type="b.type" :class="b.cls" @click="fire(b)">{{ b.label }}</el-button>
            </div>
            <div v-if="batchActions.length" class="toolbar-row batch-group">
              <el-button v-for="b in batchActions" :key="b.label" :type="b.type==='export'?'success':b.type" @click="fire(b)">{{ b.label }}</el-button>
            </div>
            <el-table :data="tableData" stripe border>
              <el-table-column type="selection" width="48" />
              <el-table-column v-for="(col, i) in pageMeta.cols" :key="col" :label="col">
                <template #default="{ row }">{{ row[i] }}</template>
              </el-table-column>
              <el-table-column v-if="pageMeta.rows" label="操作" width="220" fixed="right">
                <template #default>
                  <el-button v-if="can('update')" type="primary" link size="small" @click="dialogVisible=true">编辑</el-button>
                  <el-button v-if="can('delete')" type="danger" link size="small">删除</el-button>
                  <el-button v-if="can('view')" type="primary" link size="small">预览</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top:16px;display:flex;justify-content:flex-end">
              <el-pagination layout="total, prev, pager, next" :total="100" />
            </div>
          </div>
        </main>
      </div>

      <el-dialog v-model="dialogVisible" title="编辑" width="480px">
        <el-form label-width="80px">
          <el-form-item label="名称"><el-input /></el-form-item>
          <el-form-item label="备注"><el-input type="textarea" rows="3" /></el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible=false">取消</el-button>
          <el-button @click="resetDialog">重置</el-button>
          <el-button type="primary" @click="saveDialog">保存</el-button>
        </template>
      </el-dialog>

      <el-dialog v-model="categoryDialogVisible" title="选择服务类型" width="420px">
        <p style="margin:0 0 16px;font-size:13px;color:#64748b">请选择要添加的服务板块：</p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
          <el-button v-for="c in SERVICE_CATEGORIES" :key="c" size="large" @click="pickServiceCategory(c)">{{ c }}</el-button>
        </div>
      </el-dialog>

      <el-dialog v-model="communityFormVisible" :title="'新增' + selectedServiceCategory + '服务'" width="520px" destroy-on-close>
        <el-form :model="communityForm" label-width="110px">
          <el-form-item label="服务类型"><el-tag type="primary">{{ selectedServiceCategory }}</el-tag></el-form-item>
          <el-form-item label="用户名" required><el-input v-model="communityForm.userName" /></el-form-item>
          <el-form-item label="手机号" required><el-input v-model="communityForm.userPhone" /></el-form-item>
          <el-form-item label="预约时间" required><el-date-picker v-model="communityForm.appointmentAt" type="datetime" value-format="YYYY-MM-DD HH:mm" style="width:100%" /></el-form-item>
          <el-form-item label="具体服务项目" required><el-input v-model="communityForm.serviceItem" type="textarea" :rows="3" /></el-form-item>
          <el-form-item label="服务人员"><el-input v-model="communityForm.staff" placeholder="留空则进入待分配" /></el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="communityFormVisible=false">取消</el-button>
          <el-button type="primary" @click="submitCommunityOrder">确认添加</el-button>
        </template>
      </el-dialog>

      <el-dialog v-model="assignVisible" title="分配服务人员" width="440px" destroy-on-close>
        <template v-if="assignTarget">
          <p style="margin:0 0 16px;font-size:13px;color:#64748b">用户：<b>{{ assignTarget.userName }}</b>（{{ assignTarget.userPhone }}）<br>需求：{{ assignTarget.category }} · {{ assignTarget.serviceItem }}</p>
          <el-form label-width="100px">
            <el-form-item label="服务人员" required>
              <el-select v-model="assignStaff" filterable allow-create placeholder="选择或输入" style="width:100%">
                <el-option v-for="s in staffOptionsForCategory(assignTarget.category)" :key="s" :label="s" :value="s" />
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <el-button @click="assignVisible=false">取消</el-button>
          <el-button type="primary" @click="confirmCommunityAssign">确认分配</el-button>
        </template>
      </el-dialog>

      <el-drawer v-model="iotLogVisible" :title="activeIotDevice ? activeIotDevice.deviceName + ' · 设备日志' : '设备日志'" size="480px">
        <template v-if="activeIotDevice">
          <el-descriptions :column="1" border size="small" style="margin-bottom:16px">
            <el-descriptions-item label="用户">{{ activeIotDevice.userName }} · {{ activeIotDevice.userPhone }}</el-descriptions-item>
            <el-descriptions-item label="设备">{{ activeIotDevice.deviceType }} · {{ activeIotDevice.deviceSn }}</el-descriptions-item>
            <el-descriptions-item label="状态"><el-tag :type="activeIotDevice.online?'success':'danger'" size="small">{{ activeIotDevice.online?'在线':'离线' }}</el-tag></el-descriptions-item>
          </el-descriptions>
          <el-timeline>
            <el-timeline-item v-for="(log,i) in activeIotDevice.logs" :key="i" :type="iotLogType(log.level)" :timestamp="log.time">{{ log.message }}</el-timeline-item>
          </el-timeline>
        </template>
      </el-drawer>

      <el-drawer v-model="userDetailVisible" :title="selectedUser ? selectedUser.name + ' · 用户档案' : '用户档案'" size="580px" destroy-on-close>
        <template v-if="selectedUser">
          <el-button v-if="can('update')" type="primary" size="small" style="margin-bottom:16px" @click="openUserEditFromDetail">编辑完整档案</el-button>
          <div class="user-detail-section">
            <h4 class="user-detail-title">基本信息</h4>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="姓名">{{ selectedUser.name }}</el-descriptions-item>
              <el-descriptions-item label="手机">{{ selectedUser.phone }}</el-descriptions-item>
              <el-descriptions-item label="设备号">{{ deviceLabel(selectedUser.deviceId) }}</el-descriptions-item>
              <el-descriptions-item label="年龄">{{ selectedUser.age }} 岁</el-descriptions-item>
              <el-descriptions-item label="性别">{{ selectedUser.gender }}</el-descriptions-item>
              <el-descriptions-item label="状态"><el-tag :type="userStatusType(selectedUser.status)" size="small">{{ selectedUser.status }}</el-tag></el-descriptions-item>
              <el-descriptions-item label="注册" :span="2">{{ selectedUser.registerAt }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <div class="user-detail-section">
            <h4 class="user-detail-title">习惯与健康档案</h4>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="身高">{{ selectedUser.habits.height }}</el-descriptions-item>
              <el-descriptions-item label="体重">{{ selectedUser.habits.weight }}</el-descriptions-item>
              <el-descriptions-item label="血型">{{ selectedUser.habits.bloodType }}</el-descriptions-item>
              <el-descriptions-item label="作息">{{ selectedUser.habits.sleepTime }}</el-descriptions-item>
              <el-descriptions-item label="运动">{{ selectedUser.habits.exercise }}</el-descriptions-item>
              <el-descriptions-item label="饮食">{{ selectedUser.habits.diet }}</el-descriptions-item>
              <el-descriptions-item label="慢性病" :span="2">{{ selectedUser.habits.chronic || '无' }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <div class="user-detail-section">
            <h4 class="user-detail-title">用药习惯</h4>
            <el-empty v-if="!selectedUser.medications.length" description="未设置用药" :image-size="56" />
            <el-table v-else :data="selectedUser.medications" border size="small" stripe>
              <el-table-column prop="name" label="药品" min-width="110" />
              <el-table-column prop="dose" label="剂量" width="72" />
              <el-table-column prop="schedule" label="时间" min-width="100" />
              <el-table-column prop="note" label="备注" width="80" />
            </el-table>
          </div>
          <div class="user-detail-section">
            <h4 class="user-detail-title">各类提醒</h4>
            <el-empty v-if="!selectedUser.reminders.length" description="未设置提醒" :image-size="56" />
            <el-table v-else :data="selectedUser.reminders" border size="small" stripe>
              <el-table-column prop="type" label="类型" width="64" />
              <el-table-column prop="content" label="内容" min-width="100" />
              <el-table-column prop="repeat" label="规则" min-width="100" />
              <el-table-column label="状态" width="64">
                <template #default="{ row }"><el-tag :type="row.enabled?'success':'info'" size="small">{{ row.enabled?'开':'关' }}</el-tag></template>
              </el-table-column>
            </el-table>
          </div>
          <div class="user-detail-section">
            <h4 class="user-detail-title">紧急联系人（3 位）</h4>
            <el-table :data="selectedUser.emergencyContacts" border size="small" stripe>
              <el-table-column label="#" width="48"><template #default="{$index}">{{ $index + 1 }}</template></el-table-column>
              <el-table-column prop="name" label="姓名" width="80"><template #default="{row}">{{ row.name||'—' }}</template></el-table-column>
              <el-table-column prop="relation" label="关系" width="64"><template #default="{row}">{{ row.relation||'—' }}</template></el-table-column>
              <el-table-column prop="phone" label="电话" min-width="110"><template #default="{row}">{{ row.phone||'—' }}</template></el-table-column>
              <el-table-column prop="priority" label="优先级" width="80" />
              <el-table-column label="呼救" width="64">
                <template #default="{ row }"><el-tag v-if="row.name||row.phone" :type="row.notifySos?'danger':'info'" size="small">{{ row.notifySos?'是':'否' }}</el-tag><span v-else>—</span></template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-drawer>

      <el-dialog v-model="userEditVisible" :title="editForm ? '编辑档案 · ' + editForm.name : '编辑用户档案'" width="760px" top="4vh" destroy-on-close>
        <el-scrollbar v-if="editForm" max-height="68vh">
          <el-form label-width="88px" size="default">
            <h4 class="user-detail-title" style="margin-top:0">基本信息</h4>
            <el-row :gutter="12">
              <el-col :span="12"><el-form-item label="姓名"><el-input v-model="editForm.name" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="手机"><el-input v-model="editForm.phone" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="设备号"><el-input v-model="editForm.deviceId" placeholder="机器人设备编号" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="状态"><el-radio-group v-model="editForm.status"><el-radio value="正常">正常</el-radio><el-radio value="禁用">禁用</el-radio></el-radio-group></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="年龄"><el-input-number v-model="editForm.age" :min="1" :max="120" style="width:100%" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="性别"><el-select v-model="editForm.gender" style="width:100%"><el-option label="男" value="男" /><el-option label="女" value="女" /></el-select></el-form-item></el-col>
            </el-row>
            <h4 class="user-detail-title">习惯与健康档案</h4>
            <el-row :gutter="12">
              <el-col :span="12"><el-form-item label="身高"><el-input v-model="editForm.habits.height" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="体重"><el-input v-model="editForm.habits.weight" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="血型"><el-input v-model="editForm.habits.bloodType" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="作息"><el-input v-model="editForm.habits.sleepTime" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="运动"><el-input v-model="editForm.habits.exercise" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="饮食"><el-input v-model="editForm.habits.diet" /></el-form-item></el-col>
              <el-col :span="24"><el-form-item label="慢性病"><el-input v-model="editForm.habits.chronic" /></el-form-item></el-col>
            </el-row>
            <h4 class="user-detail-title">用药习惯 <el-button type="primary" link @click="addMed">+ 添加</el-button></h4>
            <div v-for="(m, i) in editForm.medications" :key="'m'+i" style="margin-bottom:8px;padding:8px;background:#fafafa;border-radius:6px">
              <el-row :gutter="8">
                <el-col :span="7"><el-input v-model="m.name" placeholder="药品" /></el-col>
                <el-col :span="5"><el-input v-model="m.dose" placeholder="剂量" /></el-col>
                <el-col :span="7"><el-input v-model="m.schedule" placeholder="时间" /></el-col>
                <el-col :span="4"><el-input v-model="m.note" placeholder="备注" /></el-col>
                <el-col :span="1"><el-button type="danger" link @click="editForm.medications.splice(i,1)">删</el-button></el-col>
              </el-row>
            </div>
            <h4 class="user-detail-title">各类提醒 <el-button type="primary" link @click="addRem">+ 添加</el-button></h4>
            <div v-for="(r, i) in editForm.reminders" :key="'r'+i" style="margin-bottom:8px;padding:8px;background:#fafafa;border-radius:6px">
              <el-row :gutter="8" align="middle">
                <el-col :span="5"><el-select v-model="r.type" style="width:100%"><el-option label="用药" value="用药" /><el-option label="运动" value="运动" /><el-option label="饮水" value="饮水" /><el-option label="复诊" value="复诊" /></el-select></el-col>
                <el-col :span="9"><el-input v-model="r.content" placeholder="内容" /></el-col>
                <el-col :span="6"><el-input v-model="r.repeat" placeholder="规则" /></el-col>
                <el-col :span="3"><el-switch v-model="r.enabled" /></el-col>
                <el-col :span="1"><el-button type="danger" link @click="editForm.reminders.splice(i,1)">删</el-button></el-col>
              </el-row>
            </div>
            <h4 class="user-detail-title">紧急联系人（固定 3 位）</h4>
            <div v-for="(c, i) in editForm.emergencyContacts" :key="'c'+i" style="margin-bottom:12px;padding:12px;border:1px solid #f0f0f0;border-radius:8px;background:#fafafa">
              <div style="font-size:13px;font-weight:600;color:#64748b;margin-bottom:8px">联系人 {{ i + 1 }}</div>
              <el-row :gutter="8">
                <el-col :span="8"><el-form-item label="姓名" label-width="48px"><el-input v-model="c.name" /></el-form-item></el-col>
                <el-col :span="8"><el-form-item label="关系" label-width="48px"><el-input v-model="c.relation" /></el-form-item></el-col>
                <el-col :span="8"><el-form-item label="电话" label-width="48px"><el-input v-model="c.phone" /></el-form-item></el-col>
                <el-col :span="8"><el-form-item label="优先级" label-width="56px"><el-select v-model="c.priority" style="width:100%"><el-option label="主联系人" value="主联系人" /><el-option label="备用" value="备用" /></el-select></el-form-item></el-col>
                <el-col :span="8"><el-form-item label="呼救通知" label-width="72px"><el-switch v-model="c.notifySos" /></el-form-item></el-col>
              </el-row>
            </div>
          </el-form>
        </el-scrollbar>
        <template #footer>
          <el-button @click="userEditVisible=false">取消</el-button>
          <el-button @click="resetUserEdit">重置</el-button>
          <el-button type="primary" @click="saveUserEdit">保存档案</el-button>
        </template>
      </el-dialog>
    </div>
  `,
})

app.use(ElementPlus, { locale: ElementPlusLocaleZhCn })
app.mount('#app')
