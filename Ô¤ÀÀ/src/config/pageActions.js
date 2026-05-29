/** 各页面操作按钮配置：type 对应按钮规范，perm 对应最低权限 */
export const pageActions = {
  dashboard: [
    { key: 'refresh', label: '刷新数据', type: 'secondary', perm: 'view' },
    { key: 'export', label: '数据导出', type: 'export', perm: 'export' },
    { key: 'alert', label: '告警查看', type: 'danger-highlight', perm: 'view' },
    { key: 'quick-qb', label: '题库新增', type: 'primary', perm: 'create', shortcut: true },
    { key: 'quick-audit', label: '内容审核', type: 'primary', perm: 'audit', shortcut: true },
    { key: 'quick-sos', label: '紧急呼救', type: 'danger-highlight', perm: 'view', shortcut: true },
  ],
  'question-bank/list': [
    { key: 'add', label: '新增题目', type: 'primary', perm: 'create' },
    { key: 'import', label: '批量导入', type: 'primary', perm: 'create' },
    { key: 'export', label: '批量导出', type: 'export', perm: 'export' },
    { key: 'toggle', label: '批量启用/禁用', type: 'secondary', perm: 'update', group: 'batch' },
    { key: 'refresh', label: '刷新', type: 'secondary', perm: 'view' },
    { key: 'filter', label: '分类筛选', type: 'secondary', perm: 'view' },
  ],
  'question-bank/category': [
    { key: 'add', label: '新增分类', type: 'primary', perm: 'create' },
    { key: 'sort', label: '排序', type: 'secondary', perm: 'update' },
  ],
  'question-bank/task': [
    { key: 'filter', label: '筛选用户', type: 'secondary', perm: 'view' },
    { key: 'progress', label: '查看采集进度', type: 'secondary', perm: 'view' },
    { key: 'reset', label: '重置采集', type: 'danger', perm: 'delete' },
    { key: 'export', label: '导出采集报表', type: 'export', perm: 'export' },
  ],
  'users/list': [
    { key: 'add', label: '新增用户', type: 'primary', perm: 'create' },
    { key: 'import', label: '批量导入', type: 'primary', perm: 'create' },
    { key: 'export', label: '导出用户档案', type: 'export', perm: 'export' },
    { key: 'unbind', label: '账号解绑', type: 'danger', perm: 'delete', group: 'batch' },
  ],
  'users/qa-archive': [
    { key: 'regen', label: '手动重生成摘要', type: 'primary', perm: 'update' },
    { key: 'export', label: '导出档案', type: 'export', perm: 'export' },
  ],
  'users/chat-history': [
    { key: 'export', label: '导出记录', type: 'export', perm: 'export' },
    { key: 'mark', label: '敏感内容标记', type: 'danger', perm: 'update' },
  ],
  'memoir/question-bank': [
    { key: 'add', label: '新增题目', type: 'primary', perm: 'create' },
    { key: 'import', label: 'Word 批量导入', type: 'primary', perm: 'create' },
    { key: 'export', label: '导出问题库', type: 'export', perm: 'export' },
  ],
  'users/memoir': [
    { key: 'regen', label: '批量重新生成', type: 'primary', perm: 'update' },
    { key: 'archive', label: '归档已完成', type: 'secondary', perm: 'update' },
    { key: 'export', label: '导出文件', type: 'export', perm: 'export' },
  ],
  'ai/voice-dialog': [
    { key: 'save', label: '保存配置', type: 'primary', perm: 'update' },
    { key: 'reset', label: '恢复默认', type: 'secondary', perm: 'update' },
    { key: 'preview', label: '音色试听', type: 'secondary', perm: 'view', fold: true },
    { key: 'test', label: '测试语音', type: 'secondary', perm: 'view', fold: true },
  ],
  'ai/memory': [
    { key: 'save', label: '保存配置', type: 'primary', perm: 'update' },
    { key: 'reset', label: '重置用户记忆', type: 'danger', perm: 'delete' },
    { key: 'close', label: '关闭长期记忆', type: 'danger', perm: 'update' },
  ],
  'elder-care/sos': [
    { key: 'filter', label: '时间筛选', type: 'secondary', perm: 'view' },
    { key: 'mark', label: '状态标记', type: 'primary', perm: 'audit', highlight: true },
    { key: 'notify', label: '一键通知家属', type: 'danger-highlight', perm: 'update', highlight: true },
    { key: 'export', label: '导出记录', type: 'export', perm: 'export' },
  ],
  'elder-care/family': [
    { key: 'sync', label: '同步用户档案', type: 'primary', perm: 'view' },
    { key: 'export', label: '导出绑定表', type: 'export', perm: 'export' },
  ],
  'elder-care/message': [
    { key: 'view', label: '查看记录', type: 'secondary', perm: 'view' },
    { key: 'pin', label: '置顶重要内容', type: 'primary', perm: 'update' },
    { key: 'delete', label: '删除无效记录', type: 'danger', perm: 'delete' },
    { key: 'export', label: '导出呼救内容', type: 'export', perm: 'export' },
  ],
  'elder-care/community': [
    { key: 'add', label: '新增服务', type: 'primary', perm: 'create' },
    { key: 'orders', label: '服务订单查看', type: 'secondary', perm: 'view' },
  ],
  'elder-care/iot': [
    { key: 'refresh', label: '刷新设备状态', type: 'primary', perm: 'view' },
    { key: 'export', label: '导出设备清单', type: 'export', perm: 'export' },
    { key: 'exportLog', label: '导出设备日志', type: 'export', perm: 'export' },
  ],
  'knowledge/list': [
    { key: 'add', label: '新增知识点', type: 'primary', perm: 'create' },
    { key: 'import', label: '批量导入', type: 'primary', perm: 'create' },
    { key: 'export', label: '导出', type: 'export', perm: 'export' },
    { key: 'approve', label: '审核通过', type: 'primary', perm: 'audit', group: 'batch' },
    { key: 'reject', label: '驳回', type: 'danger', perm: 'audit', group: 'batch' },
  ],
  'knowledge/audit': [
    { key: 'submit', label: '提交审核申请', type: 'primary', perm: 'create' },
    { key: 'batch', label: '批量审核', type: 'primary', perm: 'audit', group: 'batch' },
    { key: 'reject', label: '一键驳回', type: 'danger', perm: 'audit' },
    { key: 'mark', label: '标记待优化', type: 'secondary', perm: 'audit' },
  ],
  'knowledge/stats': [
    { key: 'filter', label: '时间筛选', type: 'secondary', perm: 'view' },
    { key: 'export', label: '导出统计报表', type: 'export', perm: 'export' },
  ],
  'system/account': [
    { key: 'add', label: '新增账号', type: 'primary', perm: 'create' },
    { key: 'reset', label: '重置密码', type: 'secondary', perm: 'update' },
    { key: 'disable', label: '禁用账号', type: 'danger', perm: 'delete' },
  ],
  'system/security': [
    { key: 'backup', label: '手动备份数据', type: 'primary', perm: 'update' },
    { key: 'storage', label: '查看存储状态', type: 'secondary', perm: 'view' },
    { key: 'encrypt', label: '加密规则配置', type: 'primary', perm: 'update' },
    { key: 'archive', label: '数据归档', type: 'secondary', perm: 'update' },
  ],
  'system/log': [
    { key: 'filter', label: '时间筛选', type: 'secondary', perm: 'view' },
    { key: 'search', label: '日志检索', type: 'secondary', perm: 'view' },
    { key: 'export', label: '导出日志', type: 'export', perm: 'export' },
  ],
  'system/version': [
    { key: 'publish', label: '发布配置', type: 'primary', perm: 'update' },
    { key: 'rollback', label: '版本回滚', type: 'danger', perm: 'delete' },
    { key: 'sync', label: '小程序/APP 参数同步', type: 'primary', perm: 'update' },
  ],
}

/** 行内操作按钮 */
export const rowActions = {
  'question-bank/list': [
    { key: 'edit', label: '编辑', perm: 'update' },
    { key: 'delete', label: '删除', perm: 'delete', danger: true },
    { key: 'preview', label: '预览', perm: 'view', fold: true },
    { key: 'toggle', label: '上下线', perm: 'update' },
  ],
  'users/list': [
    { key: 'detail', label: '查看详情', perm: 'view' },
    { key: 'edit', label: '编辑资料', perm: 'update' },
    { key: 'disable', label: '启用/禁用', perm: 'update' },
    { key: 'clear', label: '清空对话缓存', perm: 'delete', danger: true, fold: true },
  ],
  'knowledge/list': [
    { key: 'edit', label: '编辑', perm: 'update' },
    { key: 'preview', label: '预览', perm: 'view', fold: true },
    { key: 'delete', label: '删除', perm: 'delete', danger: true },
    { key: 'hot', label: '设为热门问答', perm: 'update' },
  ],
}
